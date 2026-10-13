using BlogPost.Application.DTOs.Category;
using BlogPost.Domain.Entities;

namespace BlogPost.Application.Interfaces.Services
{
    public interface ICategoryService
    {
        Task<List<CategoryDto>> GetAllAsync();
        Task<CategoryDto> CreateAsync(CreateCategoryDto createCategoryDto);
        Task<bool> DeleteAsync(Guid id);
        Task<CategoryDto?> GetByIdAsync(Guid id);
        Task<CategoryDto?> UpdateAsync(Guid id,UpdateCategoryDto updateCategoryDto);
    }
}
