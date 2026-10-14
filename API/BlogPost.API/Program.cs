
using BlogPost.Application.Interfaces.Repositories;
using BlogPost.Application.Interfaces.Services;
using BlogPost.Infrastructure.Data;
using BlogPost.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using BlogPost.Application.Services;

namespace BlogPost.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
 

            builder.Services.AddControllers();

            builder.Services.AddSwaggerGen();


            // Dependency injection
            builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
            builder.Services.AddScoped<ICategoryService, CategoryService>();
            builder.Services.AddScoped<IBlogRepository, BlogRepository>();
            builder.Services.AddScoped<IBlogService, BlogService>();


            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.WithOrigins("http://localhost:4200")  
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            // Database
            builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(
                builder.Configuration.GetConnectionString("BlogPostConnectionString")));

            var app = builder.Build();



            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors("AllowFrontend");

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
