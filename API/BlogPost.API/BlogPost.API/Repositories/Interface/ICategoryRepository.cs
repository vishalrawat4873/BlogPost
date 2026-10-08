using BlogPost.API.Models.Domain;

namespace BlogPost.API.Repositories.Interface
{
    public interface ICategoryRepository
    {
        Task<Category> CreateAsync(Category category);
        Task<Category> DeleteAsync(Guid id);
    }
}
