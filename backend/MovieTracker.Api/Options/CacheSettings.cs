namespace MovieTracker.Api.Options;

public class CacheSettings
{
    public const string SectionName = "CacheSettings";
    public int SearchCacheTtlHours { get; set; } = 24;
    public string PopularMoviesCacheKey { get; set; } = "movies:popular";
    public string SearchCacheKeyPrefix { get; set; } = "search:";
    public int PopularMoviesPageCount { get; set; } = 5;
    public int PopularMoviesRefreshHour { get; set; } = 0;
}