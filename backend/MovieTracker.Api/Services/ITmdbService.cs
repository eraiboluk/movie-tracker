using MovieTracker.Api.DTOs;

namespace MovieTracker.Api.Services;

public interface ITmdbService
{
    Task<List<TmdbMovieDto>> SearchMoviesAsync(string query, CancellationToken ct);
    Task<List<TmdbMovieDto>> GetPopularMoviesAsync();
}