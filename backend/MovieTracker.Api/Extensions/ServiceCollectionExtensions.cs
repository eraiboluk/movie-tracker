using Microsoft.EntityFrameworkCore;
using MovieTracker.Api.Data;
using MovieTracker.Api.Models;
using MovieTracker.Api.Options;
using MovieTracker.Api.Services;
using MovieTracker.Api.Workers;
using StackExchange.Redis;
using System.Threading.RateLimiting;

namespace MovieTracker.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<MovieTrackerDbContext>(options =>
            options.UseNpgsql(config.GetConnectionString("DefaultConnection")));

        services.AddSingleton<IConnectionMultiplexer>(sp =>
        {
            var redisConfig = config.GetConnectionString("Redis")!;
            var options = ConfigurationOptions.Parse(redisConfig);
            options.AbortOnConnectFail = false;
            return ConnectionMultiplexer.Connect(options);
        });

        services.AddSingleton<ICacheService, RedisCacheService>();

        var tmdbSettings = config.GetSection(TmdbSettings.SectionName).Get<TmdbSettings>() ?? new TmdbSettings();

        services.AddHttpClient<ITmdbService, TmdbService>(client =>
        {
            client.BaseAddress = new Uri(tmdbSettings.BaseUrl);
            client.Timeout = TimeSpan.FromSeconds(tmdbSettings.TimeoutSeconds);
        });

        services.AddScoped<IMovieService, MovieService>();
        
        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        
        services.AddHostedService<PopularMoviesWorker>();

        services.Configure<CacheSettings>(config.GetSection(CacheSettings.SectionName));
        services.Configure<TmdbSettings>(config.GetSection(TmdbSettings.SectionName));

        return services;
    }

    public static IServiceCollection AddSecurityAndCors(this IServiceCollection services, IConfiguration config)
    {
        services.AddAuthorization();
        
        services.Configure<Microsoft.AspNetCore.Identity.IdentityOptions>(options =>
        {
            options.Password.RequireLowercase = false;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequiredLength = 8;
        });

        services.AddIdentityApiEndpoints<ApplicationUser>()
            .AddEntityFrameworkStores<MovieTrackerDbContext>();

        services.AddCors(options =>
        {
            options.AddPolicy("AllowReactApp", policy =>
            {
                policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
            });
        });

        var rateLimitSettings = config.GetSection(RateLimitSettings.SectionName).Get<RateLimitSettings>() ?? new RateLimitSettings();

        services.AddRateLimiter(options =>
        {
            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
                RateLimitPartition.GetFixedWindowLimiter(
                    partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? httpContext.Request.Headers.Host.ToString(),
                    factory: partition => new FixedWindowRateLimiterOptions
                    {
                        AutoReplenishment = true,
                        PermitLimit = rateLimitSettings.PermitLimit,
                        QueueLimit = 0,
                        Window = TimeSpan.FromSeconds(rateLimitSettings.WindowSeconds)
                    }));

            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
        });

        return services;
    }
}