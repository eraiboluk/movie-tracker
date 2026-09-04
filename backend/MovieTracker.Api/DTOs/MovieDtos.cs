using System.ComponentModel.DataAnnotations;

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
    [Range(1, int.MaxValue)]
    public int TmdbId { get; set; }
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    [MaxLength(10000)]
    public string? Overview { get; set; }
    [MaxLength(500)]
    public string? PosterPath { get; set; }
    [MaxLength(50)]
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