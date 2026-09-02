using StackExchange.Redis;

namespace MovieTracker.Api.Services;

public class RedisCacheService : ICacheService
{
    private readonly IConnectionMultiplexer _redis;
    private readonly ILogger<RedisCacheService> _logger;

    public RedisCacheService(IConnectionMultiplexer redis, ILogger<RedisCacheService> logger)
    {
        _redis = redis;
        _logger = logger;
    }

    public async Task<string?> GetAsync(string key)
    {
        try
        {
            var db = _redis.GetDatabase();
            return await db.StringGetAsync(key);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Redis GET failed for key: {Key}", key);
            return null;
        }
    }

    public async Task SetAsync(string key, string value, TimeSpan? expiry = null)
    {
        try
        {
            var db = _redis.GetDatabase();
            if (expiry.HasValue)
                await db.StringSetAsync(key, value, expiry.Value);
            else            
                await db.StringSetAsync(key, value);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Redis SET failed for key: {Key}", key);
        }
    }
}