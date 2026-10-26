using BlogPost.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlogPost.Application.Interfaces.Repositories
{
    public interface IImageRepository
    {
        Task<BlogImage> CreateAsync(BlogImage blogImage);
        Task<List<BlogImage>> GetAllAsync();
    }
}
