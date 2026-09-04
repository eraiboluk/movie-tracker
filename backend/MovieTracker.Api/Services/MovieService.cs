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

    public async Task<MovieDto> AddMovieAsync(Guid userId, AddMovieRequestDto request)
    {
        var exists = await _db.Movies.AnyAsync(m => m.UserId == userId && m.TmdbId == request.TmdbId);
        if (exists)
            throw new InvalidOperationException("Film already exists in the list.");

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

        _db.Movies.Add(movie);
        await _db.SaveChangesAsync();

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

    public async Task<bool> DeleteMovieAsync(Guid userId, int id)
    {
        var movie = await _db.Movies.FirstOrDefaultAsync(m => m.Id == id && m.UserId == userId);
        if (movie is null) return false;

        _db.Movies.Remove(movie);
        await _db.SaveChangesAsync();
        return true;
    }
}