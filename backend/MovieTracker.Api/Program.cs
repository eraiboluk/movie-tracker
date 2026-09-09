using MovieTracker.Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddProblemDetails();

builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddSecurityAndCors(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    var redis = app.Services.GetRequiredService<StackExchange.Redis.IConnectionMultiplexer>();
    var endpoints = redis.GetEndPoints();
    foreach (var endpoint in endpoints)
    {
        var server = redis.GetServer(endpoint);
        // Wipe cache on startup only in dev mode to avoid schema mismatch issues
        server.FlushDatabase();
    }
}

app.UseCors("AllowReactApp");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRateLimiter();
app.UseExceptionHandler();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();