using BlogPost.Application.DTOs.BlogImage;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlogPost.Application.Interfaces.Services
{
    public interface IImageService
    {
        Task<BlogImageDto> UploadAsync(UploadImageDto uploadImageDto);
        Task<List<BlogImageDto>> GetAllAsync();
    }
}

