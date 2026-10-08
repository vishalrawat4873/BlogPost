
using BlogPost.API.Data;
using BlogPost.API.Repositories.Implementation;
using BlogPost.API.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace BlogPost.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();
            builder.Services.AddSwaggerGen();

            builder.Services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("BlogPostConnectionString"));
            });
            builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();

            var app = builder.Build();

            app.UseSwagger();                
            app.UseSwaggerUI();

            app.UseHttpsRedirection();
            app.UseCors(option =>
            {
                option.AllowAnyHeader();
                option.AllowAnyMethod();
                option.AllowAnyOrigin();
            });

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
