using MovieTracker.Api.DTOs;

namespace MovieTracker.Api.Services;

public interface IMovieService
{
    Task<List<MovieDto>> GetMyMoviesAsync(Guid userId, CancellationToken ct);
    Task<MovieDto> AddMovieAsync(Guid userId, AddMovieRequestDto request, CancellationToken ct);
    Task<bool> DeleteMovieAsync(Guid userId, int id, CancellationToken ct);
    Task<ReviewDto?> GetReviewAsync(Guid userId, int movieId, CancellationToken ct);
    Task<ReviewDto> AddOrUpdateReviewAsync(Guid userId, int movieId, AddOrUpdateReviewRequestDto request, CancellationToken ct);
}