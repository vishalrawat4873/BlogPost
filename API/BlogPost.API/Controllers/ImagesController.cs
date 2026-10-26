using BlogPost.Application.DTOs.BlogImage;
using BlogPost.Application.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace BlogPost.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        private readonly IImageService _imageService;

        public ImagesController(IImageService imageService)
        {
            _imageService = imageService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllImages()
        {
            var images = await _imageService.GetAllAsync();
            return Ok(images);
        }

        [HttpPost]
        public async Task<IActionResult> UploadImage(
            [FromForm] IFormFile file,
            [FromForm] string? fileName,
            [FromForm] string? title)
        {
            ValidateFileUpload(file);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();

            var sanitizedFileName = string.IsNullOrWhiteSpace(fileName)
                ? Path.GetFileNameWithoutExtension(file.FileName)
                : Path.GetFileNameWithoutExtension(fileName).Trim();

            // Append unique identifier to avoid name collisions
            var uniqueFileName = $"{sanitizedFileName}-{Guid.NewGuid().ToString()[..8]}";

            using var stream = file.OpenReadStream();

            var uploadDto = new UploadImageDto
            {
                FileStream = stream,
                FileName = uniqueFileName,
                FileExtension = fileExtension,
                Title = string.IsNullOrWhiteSpace(title) ? sanitizedFileName : title.Trim()
            };

            var imageDto = await _imageService.UploadAsync(uploadDto);
            return Ok(imageDto);
        }

        private void ValidateFileUpload(IFormFile? file)
        {
            if (file == null || file.Length == 0)
            {
                ModelState.AddModelError("file", "Please select a file to upload.");
                return;
            }

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
            {
                ModelState.AddModelError("file", "Unsupported file format. Allowed formats: JPG, JPEG, PNG, WEBP, GIF.");
            }

            // Max 10MB
            if (file.Length > 10 * 1024 * 1024)
            {
                ModelState.AddModelError("file", "File size cannot exceed 10MB.");
            }
        }
    }
}
