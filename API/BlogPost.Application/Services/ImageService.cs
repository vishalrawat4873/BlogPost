using BlogPost.Application.DTOs.BlogImage;
using BlogPost.Application.Interfaces.Repositories;
using BlogPost.Application.Interfaces.Services;
using BlogPost.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BlogPost.Application.Services
{
    public class ImageService : IImageService
    {
        private readonly IImageRepository _imageRepository;
        private readonly IFileStorageService _fileStorageService;

        public ImageService(IImageRepository imageRepository, IFileStorageService fileStorageService)
        {
            _imageRepository = imageRepository;
            _fileStorageService = fileStorageService;
        }

        public async Task<BlogImageDto> UploadAsync(UploadImageDto uploadImageDto)
        {
            var url = await _fileStorageService.UploadAsync(
                uploadImageDto.FileStream,
                uploadImageDto.FileName,
                uploadImageDto.FileExtension);

            var blogImage = new BlogImage
            {
                Id = Guid.NewGuid(),
                FileName = uploadImageDto.FileName,
                FileExtension = uploadImageDto.FileExtension,
                Title = uploadImageDto.Title,
                Url = url,
                DateCreated = DateTime.UtcNow
            };

            await _imageRepository.CreateAsync(blogImage);

            return MapToDto(blogImage);
        }

        public async Task<List<BlogImageDto>> GetAllAsync()
        {
            var images = await _imageRepository.GetAllAsync();
            return images.Select(MapToDto).ToList();
        }

        private static BlogImageDto MapToDto(BlogImage image) => new BlogImageDto
        {
            Id = image.Id,
            FileName = image.FileName,
            FileExtension = image.FileExtension,
            Title = image.Title,
            Url = image.Url,
            DateCreated = image.DateCreated
        };
    }
}

