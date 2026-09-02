namespace MovieTracker.Api.Options;

public class TmdbSettings
{
    public const string SectionName = "Tmdb";
    public string BaseUrl { get; set; } = "https://api.themoviedb.org/3/";
    public string Language { get; set; } = "en-US";
    public string ApiKey { get; set; } = string.Empty;
}