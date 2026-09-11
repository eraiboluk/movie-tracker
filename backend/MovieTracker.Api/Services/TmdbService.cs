using Microsoft.Extensions.Options;
using MovieTracker.Api.DTOs;
using MovieTracker.Api.Options;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace MovieTracker.Api.Services;

public class TmdbService : ITmdbService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly ICacheService _cache;
    private readonly CacheSettings _cacheSettings;
    private readonly TmdbSettings _tmdbSettings;

    public TmdbService(
        HttpClient httpClient, ICacheService cache,
        IOptions<CacheSettings> cacheSettings, 
        IOptions<TmdbSettings> tmdbSettings)
    {
        _httpClient = httpClient;
        _cache = cache;
        _cacheSettings = cacheSettings.Value;
        _tmdbSettings = tmdbSettings.Value;

        if (string.IsNullOrEmpty(_tmdbSettings.ApiKey))
            throw new InvalidOperationException("TMDB API key not found");

        _apiKey = _tmdbSettings.ApiKey;
    }

    public async Task<TmdbSearchResultDto> SearchMoviesAsync(string query, int page = 1, CancellationToken ct = default)
    {
        var normalized = NormalizeQuery(query);
        var cacheKey = $"{_cacheSettings.SearchCacheKeyPrefix}{normalized}:p{page}";

        var cached = await _cache.GetAsync(cacheKey);
        if (cached is not null)
        {
            return JsonSerializer.Deserialize<TmdbSearchResultDto>(cached)!;
        }

        try
        {
            var response = await _httpClient.GetFromJsonAsync<TmdbSearchResponse>(
                $"search/movie?query={Uri.EscapeDataString(normalized)}&api_key={_apiKey}&language={_tmdbSettings.Language}&page={page}", ct);

            var result = new TmdbSearchResultDto
            {
                Page = page,
                TotalPages = response?.TotalPages ?? 0,
                Results = response?.Results.Select(r => new TmdbMovieDto
                {
                    TmdbId = r.Id,
                    Title = r.Title,
                    Overview = r.Overview,
                    PosterPath = r.PosterPath,
                    ReleaseDate = r.ReleaseDate
                }).ToList() ?? []
            };

            if (result.Results.Count > 0)
            {
                var json = JsonSerializer.Serialize(result);
                await _cache.SetAsync(cacheKey, json, TimeSpan.FromHours(_cacheSettings.SearchCacheTtlHours));
            }

            return result;
        }
        catch (HttpRequestException)
        {
            return new TmdbSearchResultDto { Page = page, TotalPages = 0 };
        }
    }

    public async Task<List<TmdbMovieDto>> GetPopularMoviesAsync()
    {
        var allMovies = new List<TmdbMovieDto>();
        try 
        {
            for (int page = 1; page <= _cacheSettings.PopularMoviesPageCount; page++)
            {
                var response = await _httpClient.GetFromJsonAsync<TmdbSearchResponse>(
                    $"movie/popular?api_key={_apiKey}&language={_tmdbSettings.Language}&page={page}");

                if (response?.Results is null) break;

                allMovies.AddRange(response.Results.Select(r => new TmdbMovieDto
                {
                    TmdbId = r.Id,
                    Title = r.Title,
                    Overview = r.Overview,
                    PosterPath = r.PosterPath,
                    ReleaseDate = r.ReleaseDate
                }));
            }

            return allMovies.DistinctBy(m => m.TmdbId).ToList();
        }
        catch (HttpRequestException)
        {
            return [];
        }
    }

    public async Task<TmdbMovieDetailsDto?> GetMovieDetailsAsync(int tmdbId, CancellationToken ct = default)
    {
        var cacheKey = $"{_cacheSettings.SearchCacheKeyPrefix}details:{tmdbId}";
        var cached = await _cache.GetAsync(cacheKey);
        if (cached is not null)
        {
            return JsonSerializer.Deserialize<TmdbMovieDetailsDto>(cached);
        }

        try
        {
            var response = await _httpClient.GetFromJsonAsync<TmdbMovieDetailsResponse>(
                $"movie/{tmdbId}?api_key={_apiKey}&language={_tmdbSettings.Language}", ct);

            if (response is null) return null;

            var result = new TmdbMovieDetailsDto
            {
                TmdbId = response.Id,
                Title = response.Title,
                Overview = response.Overview,
                PosterPath = response.PosterPath,
                BackdropPath = response.BackdropPath,
                ReleaseDate = response.ReleaseDate,
                Runtime = response.Runtime,
                VoteAverage = response.VoteAverage,
                Tagline = response.Tagline,
                Genres = response.Genres?.Select(g => g.Name).ToList() ?? []
            };

            var json = JsonSerializer.Serialize(result);
            await _cache.SetAsync(cacheKey, json, TimeSpan.FromHours(_cacheSettings.SearchCacheTtlHours));

            return result;
        }
        catch (HttpRequestException)
        {
            return null;
        }
    }

    private class TmdbSearchResponse
    {
        public List<TmdbResult> Results { get; set; } = new();
        [JsonPropertyName("total_pages")]
        public int TotalPages { get; set; }
    }

    private class TmdbResult
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Overview { get; set; }
        [JsonPropertyName("poster_path")]
        public string? PosterPath { get; set; }
        [JsonPropertyName("release_date")]
        public string? ReleaseDate { get; set; }
    }

    private class TmdbMovieDetailsResponse
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Overview { get; set; }
        [JsonPropertyName("poster_path")]
        public string? PosterPath { get; set; }
        [JsonPropertyName("backdrop_path")]
        public string? BackdropPath { get; set; }
        [JsonPropertyName("release_date")]
        public string? ReleaseDate { get; set; }
        public int? Runtime { get; set; }
        [JsonPropertyName("vote_average")]
        public double? VoteAverage { get; set; }
        public string? Tagline { get; set; }
        public List<TmdbGenre>? Genres { get; set; }
    }

    private class TmdbGenre
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    private static string NormalizeQuery(string query)
        => query.Trim().ToLowerInvariant();
}
