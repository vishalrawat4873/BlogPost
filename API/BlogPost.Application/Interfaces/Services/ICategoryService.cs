using BlogPost.Application.DTOs;

namespace BlogPost.Application.Interfaces.Services
{
    public interface ICategoryService
    {
        Task<List<CategoryDto>> GetAllAsync(); 
        Task<CategoryDto> CreateAsync(CreateCategoryDto createCategoryDto);

    }
}
