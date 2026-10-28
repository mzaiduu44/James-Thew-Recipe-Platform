using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DatabaseConfiq
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<RecipeImage> RecipeImages { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<RecipeIngredient> RecipeIngredients { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Tip> Tips { get; set; }
        public DbSet<Contest> Contests { get; set; }
        public DbSet<ContestSubmission> ContestSubmissions { get; set; }
        public DbSet<Announcement> Announcements { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<FAQ> FAQs { get; set; }
        public DbSet<SiteFeedback> SiteFeedbacks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Subscription
            modelBuilder.Entity<Subscription>()
                .Property(s => s.Amount)
                .HasColumnType("decimal(18,2)");

            // Tip ActionType
            modelBuilder.Entity<Tip>()
                .Property(t => t.ActionType)
                .HasConversion<string>();

            // Recipe ActionType
            modelBuilder.Entity<Recipe>()
                .Property(r => r.ActionType)
                .HasConversion<string>();

            // ContestSubmission / User
            modelBuilder.Entity<ContestSubmission>()
                .HasOne(cs => cs.User)
                .WithMany(u => u.ContestSubmissions)
                .HasForeignKey(cs => cs.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            // ContestSubmission / Contest
            modelBuilder.Entity<ContestSubmission>()
                .HasOne(cs => cs.Contest)
                .WithMany(c => c.ContestSubmissions)
                .HasForeignKey(cs => cs.ContestId)
                .OnDelete(DeleteBehavior.NoAction);

            // ContestSubmission / Recipe
            modelBuilder.Entity<ContestSubmission>()
                .HasOne(cs => cs.Recipe)
                .WithMany(r => r.ContestSubmissions)
                .HasForeignKey(cs => cs.RecipeId)
                .OnDelete(DeleteBehavior.NoAction);

            // ContestSubmission / Tip
            modelBuilder.Entity<ContestSubmission>()
                .HasOne(cs => cs.Tip)
                .WithMany(t => t.ContestSubmissions)
                .HasForeignKey(cs => cs.TipId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<SiteFeedback>(entity =>
            {
                entity.ToTable("SiteFeedbacks", "dbo");

                entity.HasKey(x => x.Id);

                entity.HasOne(x => x.User)
                    .WithMany(x => x.SiteFeedbacks)
                    .HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.NoAction);
            });
        }
    }
}
