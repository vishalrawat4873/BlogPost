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
            return await _applicationDbContext.Categories.AsNoTracking().ToListAsync();
        }
        public async Task<Category> CreateAsync(Category category)
        {
            await _applicationDbContext.Categories.AddAsync(category);
            await _applicationDbContext.SaveChangesAsync();
            return category;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var category = await _applicationDbContext.Categories.FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
            {
                return false;
            }
            _applicationDbContext.Categories.Remove(category);
            await _applicationDbContext.SaveChangesAsync();
            return true;
        }

        public async Task<Category?> GetByIdAsync(Guid id)
        {
            return await _applicationDbContext.Categories.FirstOrDefaultAsync(c => c.Id == id);

        }

        public async Task<Category?> UpdateAsync(Category category)
        {
            var existing = await _applicationDbContext.Categories.AsTracking().FirstOrDefaultAsync
                (c => c.Id == category.Id);

            if (existing == null)
            {
                return null;
            }

            existing.Name = category.Name;
            existing.UrlHandle = category.UrlHandle;

            await _applicationDbContext.SaveChangesAsync();
            return existing;
        }
    }
}
