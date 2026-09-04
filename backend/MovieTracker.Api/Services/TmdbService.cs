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

    public async Task<List<TmdbMovieDto>> SearchMoviesAsync(string query, CancellationToken ct = default)
    {
        var normalized = NormalizeQuery(query);
        var cacheKey = $"{_cacheSettings.SearchCacheKeyPrefix}{normalized}";

        var cached = await _cache.GetAsync(cacheKey);
        if (cached is not null)
        {
            return JsonSerializer.Deserialize<List<TmdbMovieDto>>(cached) ?? [];
        }

        try
        {
            var response = await _httpClient.GetFromJsonAsync<TmdbSearchResponse>(
                $"search/movie?query={Uri.
                    EscapeDataString(normalized)}&api_key={_apiKey}&language={_tmdbSettings.Language}", ct);

            var results = response?.Results.Select(r => new TmdbMovieDto
            {
                TmdbId = r.Id,
                Title = r.Title,
                Overview = r.Overview,
                PosterPath = r.PosterPath,
                ReleaseDate = r.ReleaseDate
            }).ToList() ?? [];

            if (results.Count > 0)
            {
                var json = JsonSerializer.Serialize(results);
                await _cache.SetAsync(cacheKey, json, TimeSpan.FromHours(_cacheSettings.
                    SearchCacheTtlHours));
            }

            return results;
        }
        catch (HttpRequestException)
        {
            return [];
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

            return allMovies;
        }
        catch (HttpRequestException)
        {
            return [];
        }
    }

    private class TmdbSearchResponse
    {
        public List<TmdbResult> Results { get; set; } = new();
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
    private static string NormalizeQuery(string query)
        => query.Trim().ToLowerInvariant();
}
