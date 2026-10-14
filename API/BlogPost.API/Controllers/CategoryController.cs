using BlogPost.Application.DTOs.Category;
using BlogPost.Application.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BlogPost.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController] 
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategoryAsync()
        {
            var categories = await _categoryService.GetAllAsync();
            return Ok(categories);
        }

        [HttpGet("{id:Guid}")]
        public async Task<IActionResult> GetByIdAsync(Guid id)
        {
            var category = await _categoryService.GetByIdAsync(id);
            return Ok(category);
        }
        
        [HttpPost]
        public async Task<IActionResult> CreateCategory(CreateCategoryDto createCategoryDto)
        {
            var category = await _categoryService.CreateAsync(createCategoryDto);
            return Ok(category);
        }
        
        [HttpPut("{id:Guid}")]
        public async Task<IActionResult> UpdateCategory(Guid id, UpdateCategoryDto updateCategoryDto)
        {
            var updated = await _categoryService.UpdateAsync(id, updateCategoryDto);
            if(updated == null)
            {
                return NotFound();
            }
            return Ok(updated);
        }
        
        [HttpDelete("{id:Guid}")]
        public async Task<IActionResult> DeleteCategoryAsync(Guid id)
        {
            return Ok(await _categoryService.DeleteAsync(id));
        }
    }
}
