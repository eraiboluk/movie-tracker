using MovieTracker.Api.DTOs;

namespace MovieTracker.Api.Services;

public interface IMovieService
{
    Task<List<MovieDto>> GetMyMoviesAsync(Guid userId, CancellationToken ct);
    Task<MovieDto> AddMovieAsync(Guid userId, AddMovieRequestDto request);
    Task<bool> DeleteMovieAsync(Guid userId, int id);
}