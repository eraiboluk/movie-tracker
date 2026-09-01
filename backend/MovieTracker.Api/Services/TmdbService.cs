using MovieTracker.Api.DTOs;
using System.Text.Json.Serialization;

namespace MovieTracker.Api.Services;

public class TmdbService : ITmdbService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public TmdbService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _apiKey = config["Tmdb:ApiKey"]
            ?? throw new InvalidOperationException("TMDB API key not found");
    }

    public async Task<List<TmdbMovieDto>> SearchMoviesAsync(string query)
    {
        var response = await _httpClient.GetFromJsonAsync<TmdbSearchResponse>(
            $"search/movie?query={Uri.EscapeDataString(query)}&api_key={_apiKey}&language=en-US");

        return response?.Results.Select(r => new TmdbMovieDto
        {
            TmdbId = r.Id,
            Title = r.Title,
            Overview = r.Overview,
            PosterPath = r.PosterPath,
            ReleaseDate = r.ReleaseDate
        }).ToList() ?? new List<TmdbMovieDto>();
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
}
