
using Microsoft.EntityFrameworkCore;
using SimpleNotes.Api.Middleware;

namespace SimpleNotes.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Configure DbContext with SQL Server
            var connString = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddDbContext<Data.AppDBContext>(options =>
                options.UseSqlServer(connString));

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseMiddleware<ErrorHandlerMiddleware>();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
