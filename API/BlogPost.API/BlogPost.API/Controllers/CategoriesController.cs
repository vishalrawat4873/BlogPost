using BlogPost.API.Data;
using BlogPost.API.Models.Domain;
using BlogPost.API.Models.DTO;
using BlogPost.API.Repositories.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BlogPost.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;
        public CategoriesController(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }


        [HttpPost]
        public async Task<IActionResult> CreateCategory(CreateCategoryRequest request)
        {
            var category = new Category
            {
                Name = request.Name,
                UrlHandle = request.UrlHandle,
            };
            await _categoryRepository.CreateCategory(category);
            var response = new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                UrlHandle = category.UrlHandle,
            };

            return Ok(response);
        }

        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteCategory(Guid id)
        //{
        //    var category = await _dbContext.Categories.FindAsync(id);
        //    if (id == null)
        //    {
        //        return NotFound();
        //    }
        //    _dbContext.Categories.Remove(category);
        //    await _dbContext.SaveChangesAsync();
        //    return Ok();

        //}


    }
}
