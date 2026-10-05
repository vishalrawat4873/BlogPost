using Azure.Core;
using BlogPost.API.Data;
using BlogPost.API.Models.Domain;
using BlogPost.API.Models.DTO;
using BlogPost.API.Repositories.Interface;

namespace BlogPost.API.Repositories.Implementation
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public CategoryRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<Category> CreateCategory(Category category)
        {
            await _dbContext.AddAsync(category);
            await _dbContext.SaveChangesAsync();
            return category;
            
        }
    }
}
