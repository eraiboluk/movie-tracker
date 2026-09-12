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
    [Range(1, 10)]
    public int Rating { get; set; }
    public DateTime WatchedOn { get; set; }
    [MaxLength(1000)]
    public string? Comment { get; set; }
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

public class TmdbSearchResultDto
{
    [System.Text.Json.Serialization.JsonPropertyName("results")]
    public List<TmdbMovieDto> Results { get; set; } = [];

    [System.Text.Json.Serialization.JsonPropertyName("page")]
    public int Page { get; set; }

    [System.Text.Json.Serialization.JsonPropertyName("totalPages")]
    public int TotalPages { get; set; }
}

public class ReviewDto
{
    public int Id { get; set; }
    public int MovieId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime WatchedOn { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class AddOrUpdateReviewRequestDto
{
    [Range(1, 10)]
    public int Rating { get; set; }
    [MaxLength(1000)]
    public string? Comment { get; set; }
    public DateTime WatchedOn { get; set; }
}