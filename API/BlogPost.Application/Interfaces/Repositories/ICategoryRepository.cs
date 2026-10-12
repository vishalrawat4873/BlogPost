using BlogPost.Domain.Entities;

namespace BlogPost.Application.Interfaces.Repositories
{
    public interface ICategoryRepository
    {
        Task<List<Category>> GetAllAsync();
        Task<Category> CreateAsync(Category category);

        //Task<Category?> GetByIdAsync(Guid id);

        //Task<Category> CreateAsync(Category category);

        //Task<bool> DeleteAsync(Guid id);
    }
}
