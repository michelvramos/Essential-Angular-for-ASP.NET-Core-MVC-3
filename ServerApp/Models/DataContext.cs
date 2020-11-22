using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ServerApp.Models
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> opts) : base(opts)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Product>()
                .HasMany<Rating>(p => p.Ratings)
                .WithOne(r => r.Product)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Product>().HasOne<Supplier>(p => p.Supplier)
                .WithMany(s => s.Products)
                .OnDelete(DeleteBehavior.SetNull);
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Supplier> Suppliers {get;set;}
        public DbSet<Rating> Ratings { get; set; }

        public DbSet<Order> Orders { get; set; }
    }
}
