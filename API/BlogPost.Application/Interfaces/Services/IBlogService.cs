using BlogPost.Application.DTOs.Blog;
using BlogPost.Application.DTOs.Category;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlogPost.Application.Interfaces.Services
{
    public interface IBlogService
    {
        Task<List<BlogDto>> GetAllAsync();
        Task<BlogDto?> GetByIdAsync(Guid id);
        Task<BlogDto> CreateAsync(CreateBlogDto createBlogDto);

        Task<bool> DeleteAsync(Guid id);
        
        Task<BlogDto?> UpdateAsync(Guid id, UpdateBlogDto updateBlogDto);
    }
}
