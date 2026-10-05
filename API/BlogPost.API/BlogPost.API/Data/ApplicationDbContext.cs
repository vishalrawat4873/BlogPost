using BlogPost.API.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace BlogPost.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options) { }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Blogpost> BlogPosts { get; set; }
    }
}
