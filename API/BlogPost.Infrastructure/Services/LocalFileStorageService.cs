using BlogPost.Application.Interfaces.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;

namespace BlogPost.Infrastructure.Services
{
    public class LocalFileStorageService : IFileStorageService
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LocalFileStorageService(
            IWebHostEnvironment webHostEnvironment,
            IHttpContextAccessor httpContextAccessor)
        {
            _webHostEnvironment = webHostEnvironment;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<string> UploadAsync(Stream fileStream, string fileName, string fileExtension)
        {
            var uploadFolder = Path.Combine(_webHostEnvironment.ContentRootPath, "wwwroot", "upload");
            if (!Directory.Exists(uploadFolder))
            {
                Directory.CreateDirectory(uploadFolder);
            }

            var fullFileName = $"{fileName}{fileExtension}";
            var filePath = Path.Combine(uploadFolder, fullFileName);

            using (var destinationStream = new FileStream(filePath, FileMode.Create))
            {
                await fileStream.CopyToAsync(destinationStream);
            }

            var request = _httpContextAccessor.HttpContext?.Request;
            if (request != null)
            {
                return $"{request.Scheme}://{request.Host}{request.PathBase}/upload/{fullFileName}";
            }

            return $"/upload/{fullFileName}";
        }
    }
}

