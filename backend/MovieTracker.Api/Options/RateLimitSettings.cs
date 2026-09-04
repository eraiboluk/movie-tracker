namespace MovieTracker.Api.Options;

public class RateLimitSettings
{
    public const string SectionName = "RateLimitSettings";

    public int PermitLimit { get; set; } = 30;
    public int WindowSeconds { get; set; } = 10;
}