using BlogPost.Application.DTOs.Blog;
using BlogPost.Application.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BlogPost.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly IBlogService _blogService;
        public BlogController(IBlogService blogService)
        {
            _blogService = blogService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            return Ok(await _blogService.GetAllAsync());
        }

        [HttpGet("{id:Guid}")]
        public async Task<IActionResult> GetByIdAsynce(Guid id)
        {
            var blog = await _blogService.GetByIdAsync(id);
            if (blog == null)
            {
                return NotFound();
            }
            return Ok(blog);
        }

        [HttpDelete("{id:Guid}")]
        public async Task<IActionResult> DeleteAsync(Guid id)
        {
            var result = await _blogService.DeleteAsync(id);
            if (!result)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPut("{id:Guid}")]
        public async Task<IActionResult> UpdateAsync(Guid id, UpdateBlogDto updateBlogDto)
        {
            var updateBlog = await _blogService.UpdateAsync(id, updateBlogDto);
            if (updateBlog == null)
            {
                return NotFound();
            }
            return Ok(updateBlog);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync(CreateBlogDto createBlogDto)
        {
            return Ok(await _blogService.CreateAsync(createBlogDto));
        }
    }


}
