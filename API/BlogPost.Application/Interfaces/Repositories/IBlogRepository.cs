using BlogPost.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlogPost.Application.Interfaces.Repositories
{
    public interface IBlogRepository
    {
        Task<List<Blog>> GetAllAsync();
        Task<Blog?> GetByIdAsync(Guid id);
        Task<Blog?> GetByNameAsync(string name);
        Task<Blog> CreateAsync(Blog blog);
        Task<Blog?> UpdateAsync(Blog blog);
        Task<bool> DeleteAsync(Guid id);
    }
}
