using BlogPost.Application.DTOs.Blog;
using BlogPost.Application.DTOs.Category;
using BlogPost.Application.Interfaces.Repositories;
using BlogPost.Application.Interfaces.Services;
using BlogPost.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BlogPost.Application.Services
{
    public class BlogService : IBlogService
    {
        private readonly IBlogRepository _blogRepository;
        
        public BlogService(IBlogRepository blogRepository)
        {
            _blogRepository = blogRepository;
        }

        public async Task<List<BlogDto>> GetAllAsync()
        {
            var blog = await _blogRepository.GetAllAsync();
            return blog.Select(MapToDto).ToList();
        }
        
        public async Task<BlogDto?> GetByIdAsync(Guid id)
        {
            var blog = await _blogRepository.GetByIdAsync(id);
            return blog == null ? null : MapToDto(blog);
        }

        public async Task<BlogDto?> GetByNameAsync(string name)
        {
            var blog = await _blogRepository.GetByNameAsync(name);
            return blog == null ? null : MapToDto(blog);
        }
        
        public async Task<BlogDto> CreateAsync(CreateBlogDto createBlogDto)
        {
            var blog = new Blog
            {
                Name = createBlogDto.Name,
                Title = createBlogDto.Title,
                PublishedDate = createBlogDto.PublishedDate,
                Author = createBlogDto.Author,
                Content = createBlogDto.Content,
                FeaturedImageUrl = createBlogDto.FeaturedImageUrl,
                IsVisible = createBlogDto.IsVisible,
                ShortDescription = createBlogDto.ShortDescription,
                categories = createBlogDto.Categories
                    .Select(categoryId => new Category { Id = categoryId })
                    .ToList()
            };

            await _blogRepository.CreateAsync(blog);

            return MapToDto(blog);
        }
        
        public async Task<BlogDto?> UpdateAsync(Guid id, UpdateBlogDto updateBlogDto)
        { 
            var blog = new Blog
            {
                Id = id,
                Name = updateBlogDto.Name,
                Author = updateBlogDto.Author,
                Content = updateBlogDto.Content,
                ShortDescription = updateBlogDto.ShortDescription,
                IsVisible = updateBlogDto.IsVisible,
                PublishedDate = updateBlogDto.PublishedDate,
                Title = updateBlogDto.Title,
                FeaturedImageUrl = updateBlogDto.FeaturedImageUrl,
                categories = updateBlogDto.Categories
                    .Select(categoryId => new Category { Id = categoryId })
                    .ToList()
            };

            var updatedBlog = await _blogRepository.UpdateAsync(blog);
            return updatedBlog == null ? null : MapToDto(updatedBlog);
        }
        
        public async Task<bool> DeleteAsync(Guid id)
        {
            return await _blogRepository.DeleteAsync(id);
        }

        private static BlogDto MapToDto(Blog b) => new BlogDto
        {
            Id = b.Id,
            Name = b.Name,
            Title = b.Title,
            ShortDescription = b.ShortDescription,
            Content = b.Content,
            Author = b.Author,
            PublishedDate = b.PublishedDate,
            FeaturedImageUrl = b.FeaturedImageUrl,
            IsVisible = b.IsVisible,
            CategoryDtos = b.categories.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                UrlHandle = c.UrlHandle,
            }).ToList(),
        };
    }
}
