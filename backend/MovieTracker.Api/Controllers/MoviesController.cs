using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MovieTracker.Api.Data;
using MovieTracker.Api.DTOs;
using MovieTracker.Api.Models;
using MovieTracker.Api.Options;
using MovieTracker.Api.Services;
using System.Text.Json;

namespace MovieTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController : ControllerBase
{
    private readonly IMovieService _movieService;
    private readonly ITmdbService _tmdbService;
    private readonly ICurrentUserService _currentUser;
    private readonly ICacheService _cache;
    private readonly CacheSettings _cacheSettings;
    private readonly TmdbSettings _tmdbSettings;

    public MoviesController(
        IMovieService movieService,
        ITmdbService tmdbService,
        ICurrentUserService currentUser,
        ICacheService cache,
        IOptions<CacheSettings> cacheSettings,
        IOptions<TmdbSettings> tmdbSettings)
    {
        _movieService = movieService;
        _tmdbService = tmdbService;
        _currentUser = currentUser;
        _cache = cache;
        _cacheSettings = cacheSettings.Value;
        _tmdbSettings = tmdbSettings.Value;
    }

    [HttpGet("search")]
    public async Task<ActionResult<TmdbSearchResultDto>> Search([FromQuery] string query, [FromQuery] int page = 1, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(query))
            return BadRequest();

        if (query.Length > _tmdbSettings.MaxSearchQueryLength)
            return BadRequest("Search query is too long.");

        if (page < 1) page = 1;

        return Ok(await _tmdbService.SearchMoviesAsync(query, page, ct));
    }

    [HttpGet]
    public async Task<ActionResult<List<MovieDto>>> GetMyMovies(CancellationToken ct)
    {
        var userId = _currentUser.GetCurrentUserId();
        return Ok(await _movieService.GetMyMoviesAsync(userId, ct));
    }

    [HttpPost]
    public async Task<ActionResult<MovieDto>> AddMovie(AddMovieRequestDto request, CancellationToken ct)
    {
        try
        {
            var userId = _currentUser.GetCurrentUserId();
            var movie = await _movieService.AddMovieAsync(userId, request, ct);
            return CreatedAtAction(nameof(GetMyMovies), new { id = movie.Id }, movie);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
        catch (Microsoft.EntityFrameworkCore.DbUpdateException)
        {
            return Conflict("This movie is already in your list.");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMovie(int id, CancellationToken ct)
    {
        var userId = _currentUser.GetCurrentUserId();
        var deleted = await _movieService.DeleteMovieAsync(userId, id, ct);
        return deleted ? NoContent() : NotFound();
    }

    [HttpGet("tmdb/{tmdbId}")]
    public async Task<ActionResult<TmdbMovieDetailsDto>> GetMovieDetails(int tmdbId, CancellationToken ct)
    {
        var details = await _tmdbService.GetMovieDetailsAsync(tmdbId, ct);
        if (details is null) return NotFound();
        return Ok(details);
    }

    [HttpGet("popular")]
    public async Task<ActionResult<List<TmdbMovieDto>>> GetPopularMovies()
    {
        var cached = await _cache.GetAsync(_cacheSettings.PopularMoviesCacheKey);
        if (cached is not null)
        {
            var movies = JsonSerializer.Deserialize<List<TmdbMovieDto>>(cached);
            return Ok(movies);
        }

        var fresh = await _tmdbService.GetPopularMoviesAsync();

        if (fresh.Count > 0)
        {
            var json = JsonSerializer.Serialize(fresh);
            await _cache.SetAsync(_cacheSettings.PopularMoviesCacheKey, json,
                TimeSpan.FromHours(_cacheSettings.PopularMoviesCacheTtlHours));
        }

        return Ok(fresh);
    }
}