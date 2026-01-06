using Microsoft.EntityFrameworkCore;

namespace SimpleNotes.Api.Data
{
    public class AppDBContext : DbContext
    {
        public AppDBContext()
        {
        }

        public AppDBContext(DbContextOptions<AppDBContext> options) : base(options)
        {
        }

        // DbSets represent the database tables
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Note> Notes { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Username)
                      .IsRequired()
                      .HasMaxLength(50);
                entity.Property(e => e.Email)
                      .IsRequired()
                      .HasMaxLength(100);
                entity.Property(e => e.PasswordHash)
                      .IsRequired()
                      .HasMaxLength(60);
                entity.Property(e => e.UserRole)
                      .HasMaxLength(20)
                      .HasConversion<string>();

                entity.Property(e => e.InsertedAt)
                      .ValueGeneratedOnAdd()
                      .HasDefaultValueSql("GETUTCDATE()");

                entity.Property(e => e.ModifiedAt)
                      .ValueGeneratedOnAddOrUpdate()
                      .HasDefaultValueSql("GETUTCDATE()");


                entity.HasIndex(e => e.Email, "IX_Users_Email")
                      .IsUnique();
                entity.HasIndex(e => e.Username, "IX_Users_Username")
                      .IsUnique();
            });

            modelBuilder.Entity<Note>(entity =>
            {
                entity.ToTable("Notes");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title)
                      .IsRequired()
                      .HasMaxLength(200);
                entity.Property(e => e.Content)
                      .IsRequired()
                      .HasMaxLength(8000);
                entity.Property(e => e.Tags)
                      .HasMaxLength(200);
                entity.Property(e => e.IsPinned)
                      .HasDefaultValue(false);

                entity.Property(e => e.InsertedAt)
                      .ValueGeneratedOnAdd()
                      .HasDefaultValueSql("GETUTCDATE()");

                entity.Property(e => e.ModifiedAt)
                      .ValueGeneratedOnAddOrUpdate()
                      .HasDefaultValueSql("GETUTCDATE()");

                // many-to-one: Note → User
                entity.HasOne(n => n.User)
                      .WithMany(u => u.Notes)
                      .HasForeignKey(n => n.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.UserId, "IX_Notes_UserId");
            });
        }
    }
}
