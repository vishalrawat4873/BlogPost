    using BlogPost.Application.Interfaces.Repositories;
    using BlogPost.Domain.Entities;
    using BlogPost.Infrastructure.Data;
    using Microsoft.EntityFrameworkCore;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    namespace BlogPost.Infrastructure.Repositories
    {
        public class BlogRepository : IBlogRepository
        {
            private readonly ApplicationDbContext _applicationDbContext;
            public BlogRepository(ApplicationDbContext applicationDbContext)
            {
                _applicationDbContext = applicationDbContext;
            }
            public async Task<List<Blog>> GetAllAsync()
            {
                return await _applicationDbContext.Blogs.Include(x => x.categories).AsNoTracking().ToListAsync();
            }

            public async Task<Blog?> GetByIdAsync(Guid id)
            {
                return await _applicationDbContext.Blogs.Include(x=>x.categories).AsNoTracking().FirstOrDefaultAsync(b => b.Id == id);
            }
            
            public async Task<Blog> CreateAsync(Blog blog)
            {
                var categoryIds = blog.categories.Select(c => c.Id).ToList();
                blog.categories = await _applicationDbContext.Categories
                    .Where(c => categoryIds.Contains(c.Id))
                    .ToListAsync();
                await _applicationDbContext.Blogs.AddAsync(blog);
                await _applicationDbContext.SaveChangesAsync();
                return blog;
            }
            
            public async Task<Blog?> UpdateAsync(Blog blog)
            {
                var exsiting = await _applicationDbContext.Blogs.Include(b => b.categories)
                               .AsTracking()
                               .FirstOrDefaultAsync(b => b.Id == blog.Id);

                if (exsiting == null)
                {
                    return null;
                }
                exsiting.Id = blog.Id;
                exsiting.Author = blog.Author;
                exsiting.Title = blog.Title;
                exsiting.ShortDescription = blog.ShortDescription;
                exsiting.Name = blog.Name;
                exsiting.Content = blog.Content;
                exsiting.FeaturedImageUrl = blog.FeaturedImageUrl;
                exsiting.PublishedDate = blog.PublishedDate;
                exsiting.IsVisible = blog.IsVisible;

                exsiting.categories.Clear();
                var categoryIds = blog.categories.Select(c => c.Id).ToList();
                var categories = await _applicationDbContext.Categories
                    .Where(c => categoryIds.Contains(c.Id))
                    .ToListAsync();
                foreach (var category in categories)
                {
                    exsiting.categories.Add(category);
                }

                await _applicationDbContext.SaveChangesAsync();
                return exsiting;
            }

            public async Task<bool> DeleteAsync(Guid id)
            {
                var blog = await _applicationDbContext.Blogs.FirstOrDefaultAsync(b => b.Id == id);
                if (blog == null)
                {
                    return false;
                }
                _applicationDbContext.Blogs.Remove(blog);
                await _applicationDbContext.SaveChangesAsync();
                return true;
            }
        }
    }