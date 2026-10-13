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
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }
        public async Task<List<CategoryDto>> GetAllAsync()
        {
            var categories = await _categoryRepository.GetAllAsync();

            var response = categories.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                UrlHandle = c.UrlHandle
            }).ToList();

            return response;
        }
        public async Task<CategoryDto> CreateAsync(CreateCategoryDto createCategoryDto)
        {
            var category = new Category
            {
                Name = createCategoryDto.Name,
                UrlHandle = createCategoryDto.UrlHandle
            };
            await _categoryRepository.CreateAsync(category);

           return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                UrlHandle = category.UrlHandle
            };
        }
        public async Task<bool> DeleteAsync(Guid id)
        {
            return await _categoryRepository.DeleteAsync(id);

        }
        public async Task<CategoryDto?> GetByIdAsync(Guid id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if(category == null)
            {
                return null;
            }

            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                UrlHandle= category.UrlHandle
            };
        }
        public async Task<CategoryDto?> UpdateAsync(Guid id,UpdateCategoryDto updateCategoryDto)
        {
            var category = new Category
            {
                Id = id,
                Name = updateCategoryDto.Name,
                UrlHandle = updateCategoryDto.UrlHandle
            };
            var updated = await _categoryRepository.UpdateAsync(category);
            if(updated == null)
            {
                return null;
            }
            return new CategoryDto
            {
                Id = updated.Id,
                Name = updated.Name,
                UrlHandle = updated.UrlHandle
            };
        }
    }   
}
