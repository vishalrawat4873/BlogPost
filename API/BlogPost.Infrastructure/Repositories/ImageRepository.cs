using BlogPost.Application.Interfaces.Repositories;
using BlogPost.Domain.Entities;
using BlogPost.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BlogPost.Infrastructure.Repositories
{
    public class ImageRepository : IImageRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public ImageRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<BlogImage> CreateAsync(BlogImage blogImage)
        {
            await _dbContext.BlogImages.AddAsync(blogImage);
            await _dbContext.SaveChangesAsync();
            return blogImage;
        }

        public async Task<List<BlogImage>> GetAllAsync()
        {
            return await _dbContext.BlogImages
                .OrderByDescending(x => x.DateCreated)
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
