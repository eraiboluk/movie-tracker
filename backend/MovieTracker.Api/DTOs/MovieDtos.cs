namespace MovieTracker.Api.DTOs;

public class TmdbMovieDto
{
    public int TmdbId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Overview { get; set; }
    public string? PosterPath { get; set; }
    public string? ReleaseDate { get; set; }
}

public class AddMovieRequestDto
{
    public int TmdbId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Overview { get; set; }
    public string? PosterPath { get; set; }
    public string? ReleaseDate { get; set; }
}

public class MovieDto
{
    public int Id { get; set; }
    public int TmdbId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Overview { get; set; }
    public string? PosterPath { get; set; }
    public DateTime? ReleaseDate { get; set; }
    public DateTime CreatedAt { get; set; }
}