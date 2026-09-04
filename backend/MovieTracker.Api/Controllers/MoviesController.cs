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

    public MoviesController(
        IMovieService movieService,
        ITmdbService tmdbService,
        ICurrentUserService currentUser,
        ICacheService cache,
        IOptions<CacheSettings> cacheSettings)
    {
        _movieService = movieService;
        _tmdbService = tmdbService;
        _currentUser = currentUser;
        _cache = cache;
        _cacheSettings = cacheSettings.Value;
    }

    [HttpGet("search")]
    public async Task<ActionResult<List<TmdbMovieDto>>> Search([FromQuery] string query, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(query)) return BadRequest("query parametre cannot be empty");
        return Ok(await _tmdbService.SearchMoviesAsync(query, ct));
    }

    [HttpGet]
    public async Task<ActionResult<List<MovieDto>>> GetMyMovies(CancellationToken ct)
    {
        var userId = _currentUser.GetCurrentUserId();
        return Ok(await _movieService.GetMyMoviesAsync(userId, ct));
    }

    [HttpPost]
    public async Task<ActionResult<MovieDto>> AddMovie(AddMovieRequestDto request)
    {
        try
        {
            var userId = _currentUser.GetCurrentUserId();
            var movie = await _movieService.AddMovieAsync(userId, request);
            return CreatedAtAction(nameof(GetMyMovies), new { id = movie.Id }, movie);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMovie(int id)
    {
        var userId = _currentUser.GetCurrentUserId();
        var deleted = await _movieService.DeleteMovieAsync(userId, id);
        return deleted ? NoContent() : NotFound();
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
            await _cache.SetAsync(_cacheSettings.PopularMoviesCacheKey, json);
        }

        return Ok(fresh);
    }
}