using BlogPost.Application.DTOs.Blog;
using BlogPost.Application.DTOs.Category;
using BlogPost.Application.Interfaces.Repositories;
using BlogPost.Application.Interfaces.Services;
using BlogPost.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace BlogPost.Application.Services
{
    public class BlogService : IBlogService
    {
        private readonly IBlogRepository _blogRepository;
        private readonly ICategoryRepository _categoryRepository;
        public BlogService(IBlogRepository blogRepository, ICategoryRepository categoryRepository)
        {
            _blogRepository = blogRepository;
            _categoryRepository = categoryRepository;
        }
        public async Task<List<BlogDto>> GetAllAsync()
        {
            var blog = await _blogRepository.GetAllAsync();
            var response = blog.Select(b => new BlogDto
            {
                Id = b.Id,
                Name = b.Name,
                ShortDescription = b.ShortDescription,
                Title = b.Title,
                PublishedDate = b.PublishedDate,
                Author = b.Author,
                Content = b.Content,
                FeaturedImageUrl = b.FeaturedImageUrl,
                IsVisible = b.IsVisible,
                CategoryDtos = b.categories.Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    UrlHandle = c.UrlHandle
                }).ToList()
            }).ToList();

            return response;
        }
        public async Task<BlogDto?> GetByIdAsync(Guid id)
        {
            var blog = await _blogRepository.GetByIdAsync(id);
            if (blog == null)
            {
                return null;
            }
            return new BlogDto
            {
                Id = blog.Id,
                ShortDescription = blog.ShortDescription,
                Name = blog.Name,
                IsVisible = blog.IsVisible,
                Author = blog.Author,
                Content = blog.Content,
                FeaturedImageUrl = blog.FeaturedImageUrl,
                PublishedDate = blog.PublishedDate,
                Title = blog.Title,
            };
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
                categories = new List<Category>()
            };

            foreach(var categoryGuid in createBlogDto.Categories)
            {
                var existingCategoy = await _categoryRepository.GetByIdAsync(categoryGuid);
                if (existingCategoy != null)
                {
                    blog.categories.Add(existingCategoy);
                }

            }
            await _blogRepository.CreateAsync(blog);

            return new BlogDto
            {
                Id = blog.Id,
                Name = blog.Name,
                Title = blog.Title,
                PublishedDate = blog.PublishedDate,
                Author = blog.Author,
                Content = blog.Content,
                FeaturedImageUrl = blog.FeaturedImageUrl,
                IsVisible = blog.IsVisible,
                ShortDescription = blog.ShortDescription,
                CategoryDtos = blog.categories.Select(x => new CategoryDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    UrlHandle = x.UrlHandle,
                }).ToList(),
            };
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
                FeaturedImageUrl = updateBlogDto.FeaturedImageUrl
            };

            var updatedBlog = await _blogRepository.UpdateAsync(blog);
            if (updatedBlog == null)
            {
                return null;
            }
            
            return new BlogDto
            {
                Id = updatedBlog.Id,
                IsVisible = updatedBlog.IsVisible,
                FeaturedImageUrl = updatedBlog.FeaturedImageUrl,
                Title = updatedBlog.Title,
                PublishedDate = updatedBlog.PublishedDate,
                Author = updatedBlog.Author,
                Content = updatedBlog.Content,
                Name = updatedBlog.Name,
                ShortDescription = updatedBlog.ShortDescription,
            };
        }
        public async Task<bool> DeleteAsync(Guid id)
        {
            return await _blogRepository.DeleteAsync(id);
        }
    }

}
