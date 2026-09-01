using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieTracker.Api.Data;
using MovieTracker.Api.DTOs;
using MovieTracker.Api.Models;
using MovieTracker.Api.Services;

namespace MovieTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController : ControllerBase
{
    private readonly MovieTrackerDbContext _db;
    private readonly ITmdbService _tmdbService;
    private readonly ICurrentUserService _currentUser;

    public MoviesController(MovieTrackerDbContext db, ITmdbService tmdbService, ICurrentUserService currentUser)
    {
        _db = db;
        _tmdbService = tmdbService;
        _currentUser = currentUser;
    }

    [HttpGet("search")]
    public async Task<ActionResult<List<TmdbMovieDto>>> Search([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query)) return BadRequest("query parametre cannot be empty");
        return Ok(await _tmdbService.SearchMoviesAsync(query));
    }

    [HttpGet]
    public async Task<ActionResult<List<MovieDto>>> GetMyMovies()
    {
        var userId = _currentUser.GetCurrentUserId();

        var movies = await _db.Movies
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
            .ToListAsync();

        return Ok(movies);
    }

    [HttpPost]
    public async Task<ActionResult<MovieDto>> AddMovie(AddMovieRequestDto request)
    {
        var userId = _currentUser.GetCurrentUserId();

        var exists = await _db.Movies.AnyAsync(m => m.UserId == userId && m.TmdbId == request.TmdbId);
        if (exists) return Conflict("Film exist in the list.");

        var movie = new Movie
        {
            UserId = userId,
            TmdbId = request.TmdbId,
            Title = request.Title,
            Overview = request.Overview,
            PosterPath = request.PosterPath,
            ReleaseDate = request.ReleaseDate.HasValue
                ? DateTime.SpecifyKind(request.ReleaseDate.Value, DateTimeKind.Utc)
                : null
        };

        _db.Movies.Add(movie);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMyMovies), new { id = movie.Id }, new MovieDto
        {
            Id = movie.Id,
            TmdbId = movie.TmdbId,
            Title = movie.Title,
            Overview = movie.Overview,
            PosterPath = movie.PosterPath,
            ReleaseDate = movie.ReleaseDate,
            CreatedAt = movie.CreatedAt
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMovie(int id)
    {
        var userId = _currentUser.GetCurrentUserId();
        var movie = await _db.Movies.FirstOrDefaultAsync(m => m.Id == id && m.UserId == userId);
        if (movie is null) return NotFound();

        _db.Movies.Remove(movie);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}