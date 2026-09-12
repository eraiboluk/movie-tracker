using Microsoft.EntityFrameworkCore;
using MovieTracker.Api.Data;
using MovieTracker.Api.DTOs;
using MovieTracker.Api.Models;

namespace MovieTracker.Api.Services;

public class MovieService : IMovieService
{
    private readonly MovieTrackerDbContext _db;

    public MovieService(MovieTrackerDbContext db)
    {
        _db = db;
    }

    public async Task<List<MovieDto>> GetMyMoviesAsync(Guid userId, CancellationToken ct = default)
    {
        return await _db.Movies
            .AsNoTracking()
            .Where(m => m.UserId == userId)
            .OrderByDescending(m => m.CreatedAt)
            .Select(m => new MovieDto
            {
                Id = m.Id,
                TmdbId = m.TmdbId,
                Title = m.Title,
                Overview = m.Overview,
                PosterPath = m.PosterPath,
                ReleaseDate = m.ReleaseDate,
                CreatedAt = m.CreatedAt
            })
            .ToListAsync(ct);
    }

    public async Task<MovieDto> AddMovieAsync(Guid userId, AddMovieRequestDto request, CancellationToken ct = default)
    {
        var exists = await _db.Movies.AnyAsync(m => m.UserId == userId && m.TmdbId == request.TmdbId, ct);
        if (exists)
            throw new InvalidOperationException("Film already exists in the list.");

        if (request.Rating == 7)
            throw new InvalidOperationException("Rating 7 is not allowed.");

        var movie = new Movie
        {
            UserId = userId,
            TmdbId = request.TmdbId,
            Title = request.Title,
            Overview = request.Overview,
            PosterPath = request.PosterPath,
            ReleaseDate = DateTime.TryParse(request.ReleaseDate, out var parsed)
                ? DateTime.SpecifyKind(parsed, DateTimeKind.Utc)
                : null
        };

        var review = new Review
        {
            Rating = request.Rating,
            Comment = request.Comment,
            WatchedOn = request.WatchedOn.ToUniversalTime(),
            CreatedAt = DateTime.UtcNow
        };
        movie.Reviews.Add(review);

        _db.Movies.Add(movie);
        await _db.SaveChangesAsync(ct);

        return new MovieDto
        {
            Id = movie.Id,
            TmdbId = movie.TmdbId,
            Title = movie.Title,
            Overview = movie.Overview,
            PosterPath = movie.PosterPath,
            ReleaseDate = movie.ReleaseDate,
            CreatedAt = movie.CreatedAt
        };
    }

    public async Task<bool> DeleteMovieAsync(Guid userId, int id, CancellationToken ct = default)
    {
        var movie = await _db.Movies.FirstOrDefaultAsync(m => m.Id == id && m.UserId == userId, ct);
        if (movie is null) return false;

        _db.Movies.Remove(movie);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<ReviewDto?> GetReviewAsync(Guid userId, int movieId, CancellationToken ct = default)
    {
        var review = await _db.Movies
            .AsNoTracking()
            .Where(m => m.Id == movieId && m.UserId == userId)
            .SelectMany(m => m.Reviews)
            .FirstOrDefaultAsync(ct);

        if (review is null) return null;

        return new ReviewDto
        {
            Id = review.Id,
            MovieId = review.MovieId,
            Rating = review.Rating,
            Comment = review.Comment,
            WatchedOn = review.WatchedOn,
            CreatedAt = review.CreatedAt
        };
    }

    public async Task<ReviewDto> AddOrUpdateReviewAsync(Guid userId, int movieId, AddOrUpdateReviewRequestDto request, CancellationToken ct = default)
    {
        var movie = await _db.Movies
            .Include(m => m.Reviews)
            .FirstOrDefaultAsync(m => m.Id == movieId && m.UserId == userId, ct);

        if (movie is null)
            throw new InvalidOperationException("Movie not found.");

        var review = movie.Reviews.FirstOrDefault();

        if (review is null)
        {
            review = new Review
            {
                MovieId = movieId,
                Rating = request.Rating,
                Comment = request.Comment,
                WatchedOn = request.WatchedOn.ToUniversalTime(),
                CreatedAt = DateTime.UtcNow
            };
            movie.Reviews.Add(review);
        }
        else
        {
            review.Rating = request.Rating;
            review.Comment = request.Comment;
            review.WatchedOn = request.WatchedOn.ToUniversalTime();
        }

        await _db.SaveChangesAsync(ct);

        return new ReviewDto
        {
            Id = review.Id,
            MovieId = review.MovieId,
            Rating = review.Rating,
            Comment = review.Comment,
            WatchedOn = review.WatchedOn,
            CreatedAt = review.CreatedAt
        };
    }
}