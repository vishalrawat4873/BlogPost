using BlogPost.Application.DTOs.Blog;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlogPost.Application.Interfaces.Services
{
    public interface IBlogService
    {
        Task<List<BlogDto>> GetAllAsync();
        Task<BlogDto?> GetByIdAsync(Guid id);
        Task<BlogDto?> GetByNameAsync(string name);
        Task<BlogDto> CreateAsync(CreateBlogDto createBlogDto);
        Task<bool> DeleteAsync(Guid id);
        Task<BlogDto?> UpdateAsync(Guid id, UpdateBlogDto updateBlogDto);
    }
}
