using Microsoft.EntityFrameworkCore;
using MovieTracker.Api.Models;

namespace MovieTracker.Api.Data;

public class MovieTrackerDbContext : DbContext
{
    public MovieTrackerDbContext(DbContextOptions<MovieTrackerDbContext> options) : base(options) { }

    public DbSet<Movie> Movies => Set<Movie>();
    public DbSet<Review> Reviews => Set<Review>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Movie>()
            .HasIndex(m => new { m.UserId, m.TmdbId })
            .IsUnique();

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Movie)
            .WithMany(m => m.Reviews)
            .HasForeignKey(r => r.MovieId);
    }
    public override int SaveChanges()
    {
        SetCreatedAt();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        SetCreatedAt();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void SetCreatedAt()
    {
        foreach (var entry in ChangeTracker.Entries<Movie>()
            .Where(e => e.State == EntityState.Added))
        {
            entry.Entity.CreatedAt = DateTime.UtcNow;
        }
    }
}