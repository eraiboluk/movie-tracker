using Microsoft.Extensions.Options;
using MovieTracker.Api.Options;
using MovieTracker.Api.Services;
using System.Text.Json;

namespace MovieTracker.Api.Workers;

public class PopularMoviesWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ICacheService _cache;
    private readonly CacheSettings _settings;
    private readonly ILogger<PopularMoviesWorker> _logger;

    public PopularMoviesWorker(
        IServiceScopeFactory scopeFactory,
        ICacheService cache,
        IOptions<CacheSettings> settings,
        ILogger<PopularMoviesWorker> logger)
    {
        _scopeFactory = scopeFactory;
        _cache = cache;
        _settings = settings.Value;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var tmdbService = scope.ServiceProvider.GetRequiredService<ITmdbService>();

                var movies = await tmdbService.GetPopularMoviesAsync();
                var json = JsonSerializer.Serialize(movies);
                await _cache.SetAsync(_settings.PopularMoviesCacheKey, json);

                _logger.LogInformation(
                    "Popular movies cache refreshed. {Count} movies cached.", movies.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to refresh popular movies cache.");
            }

            var now = DateTime.UtcNow;
            var nextRun = now.Date.AddHours(_settings.PopularMoviesRefreshHour);
            if (nextRun <= now)
                nextRun = nextRun.AddDays(1);
            var delay = nextRun - now;
            await Task.Delay(delay, stoppingToken);
        }
    }
}