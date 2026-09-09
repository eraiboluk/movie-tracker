using MovieTracker.Api.DTOs;

namespace MovieTracker.Api.Services;

public interface ITmdbService
{
    Task<TmdbSearchResultDto> SearchMoviesAsync(string query, int page, CancellationToken ct);
    Task<List<TmdbMovieDto>> GetPopularMoviesAsync();
}