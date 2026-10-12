using BlogPost.Application.Interfaces.Repositories;
using BlogPost.Domain.Entities;
using BlogPost.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BlogPost.Infrastructure.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ApplicationDbContext _applicationDbContext;
        public CategoryRepository(ApplicationDbContext context)
        {
            _applicationDbContext = context;
        }
        public async Task<List<Category>> GetAllAsync()
        {
            return await _applicationDbContext.Categories.ToListAsync();
        }
        public async Task<Category> CreateAsync(Category category)
        {
            await _applicationDbContext.Categories.AddAsync(category);
            await _applicationDbContext.SaveChangesAsync();
            return category;
        }
    }
}
