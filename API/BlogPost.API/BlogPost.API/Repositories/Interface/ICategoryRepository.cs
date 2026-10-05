using BlogPost.API.Models.Domain;

namespace BlogPost.API.Repositories.Interface
{
    public interface ICategoryRepository
    {
        Task<Category> CreateCategory(Category category);
    }
}
