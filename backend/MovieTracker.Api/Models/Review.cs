namespace MovieTracker.Api.Models;

public class Review
{
    public int Id { get; set; }
    public int MovieId { get; set; }
    public Movie Movie { get; set; } = null!;

    public int Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime WatchedOn { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}