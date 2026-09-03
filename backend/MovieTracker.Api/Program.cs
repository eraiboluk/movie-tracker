using Microsoft.EntityFrameworkCore;
using MovieTracker.Api.Data;
using MovieTracker.Api.Options;
using MovieTracker.Api.Services;
using MovieTracker.Api.Workers;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<MovieTrackerDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    var config = builder.Configuration.GetConnectionString("Redis")!;
    return ConnectionMultiplexer.Connect(config);
});

builder.Services.AddSingleton<ICacheService, RedisCacheService>();

builder.Services.AddHttpClient<ITmdbService, TmdbService>(client =>
{
    client.BaseAddress = new Uri(builder.Configuration["Tmdb:BaseUrl"]!);
});

builder.Services.AddScoped<ICurrentUserService, TemporaryCurrentUserService>();

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").
  Get<string[]>()
        ?? ["http://localhost:5173"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHostedService<PopularMoviesWorker>();

builder.Services.Configure<CacheSettings>(
       builder.Configuration.GetSection(CacheSettings.SectionName));

builder.Services.Configure<TmdbSettings>(
        builder.Configuration.GetSection(TmdbSettings.SectionName));

var app = builder.Build();

app.UseCors("AllowReactApp");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
