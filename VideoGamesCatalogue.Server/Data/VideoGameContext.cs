using Microsoft.EntityFrameworkCore;
using VideoGamesCatalogue.Server.Models;

namespace VideoGamesCatalogue.Server.Data
{
    public class VideoGameContext : DbContext
    {
        public VideoGameContext(DbContextOptions<VideoGameContext> options) : base(options)
        {
        }

        public DbSet<VideoGame> VideoGames { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<VideoGame>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Rating).HasColumnType("decimal(3,1)");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            // Use STATIC datetime values instead of DateTime.UtcNow
            var seedDate = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc);

            // Seed data with static dates
            modelBuilder.Entity<VideoGame>().HasData(
                new VideoGame
                {
                    Id = 1,
                    Title = "The Legend of Zelda: Breath of the Wild",
                    Genre = "Action-Adventure",
                    Platform = "Nintendo Switch",
                    ReleaseDate = new DateTime(2017, 3, 3),
                    Developer = "Nintendo EPD",
                    Publisher = "Nintendo",
                    Rating = 9.7m,
                    Description = "An open-world action-adventure game.",
                    CreatedAt = seedDate,  // Static date
                    UpdatedAt = seedDate   // Static date
                },
                new VideoGame
                {
                    Id = 2,
                    Title = "God of War",
                    Genre = "Action",
                    Platform = "PlayStation 4",
                    ReleaseDate = new DateTime(2018, 4, 20),
                    Developer = "Santa Monica Studio",
                    Publisher = "Sony Interactive Entertainment",
                    Rating = 9.5m,
                    Description = "A third-person action-adventure game.",
                    CreatedAt = seedDate,  // Static date
                    UpdatedAt = seedDate   // Static date
                }
            );
        }

        public override int SaveChanges()
        {
            UpdateTimestamps();
            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateTimestamps();
            return await base.SaveChangesAsync(cancellationToken);
        }

        private void UpdateTimestamps()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is VideoGame && (e.State == EntityState.Added || e.State == EntityState.Modified));

            foreach (var entry in entries)
            {
                ((VideoGame)entry.Entity).UpdatedAt = DateTime.UtcNow;

                if (entry.State == EntityState.Added)
                {
                    ((VideoGame)entry.Entity).CreatedAt = DateTime.UtcNow;
                }
            }
        }
    }
}