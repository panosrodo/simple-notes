using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using SimpleNotes.Api.Configuration;
using SimpleNotes.Api.Middleware;
using SimpleNotes.Api.Services;
using SimpleNotes.Api.Services.Interfaces;
using System.Text;

namespace SimpleNotes.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Create application builder
            var builder = WebApplication.CreateBuilder(args);

            // Load environment variables from .env file
            // (Used for secrets like JWT key)
            Env.Load(Path.Combine(builder.Environment.ContentRootPath, ".env"));
            builder.Configuration.AddEnvironmentVariables();

            // Database configuration (Entity Framework)
            var connString = builder.Configuration.GetConnectionString("DefaultConnection");

            builder.Services.AddDbContext<Data.AppDBContext>(options =>
                options.UseSqlServer(connString));

            // JWT configuration validation
            // Fail fast if Jwt:Key is missing
            var jwtKey = builder.Configuration["Jwt:Key"];
            if (string.IsNullOrWhiteSpace(jwtKey))
                throw new Exception("Missing Jwt:Key. Check .env and Env.Load()");

            // Authentication (JWT Bearer)
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        // Validate token issuer (who created the token)
                        ValidateIssuer = true,

                        // Validate token audience (who the token is for)
                        ValidateAudience = true,

                        // Validate signing key
                        ValidateIssuerSigningKey = true,

                        // Validate token expiration
                        ValidateLifetime = true,

                        ValidIssuer = builder.Configuration["Jwt:Issuer"],
                        ValidAudience = builder.Configuration["Jwt:Audience"],

                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(jwtKey)
                        ),

                        // Allow small clock differences between servers
                        ClockSkew = TimeSpan.FromSeconds(30)
                    };
                });

            // Authorization (roles / policies)
            builder.Services.AddAuthorization();

            // Application services
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IUserService, UserService>();

            // MVC
            builder.Services.AddControllers();

            // Infrastructure services
            builder.Services.AddHttpContextAccessor();
            
            // Swagger / OpenAPI
            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new()
                {
                    Title = "SimpleNotes API",
                    Version = "v1"
                });

                // Enable JWT authentication in Swagger
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter: Bearer {your JWT token}"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });

            // AutoMapper configuration
            builder.Services.AddAutoMapper(cfg =>
                cfg.AddProfile<MapperConfig>());

            // Serilog logging
            builder.Host.UseSerilog((ctx, lc) =>
                lc.ReadFrom.Configuration(ctx.Configuration));

            // Custom middleware
            builder.Services.AddTransient<ErrorHandlerMiddleware>();

            // Build application
            var app = builder.Build();

            // HTTP request pipeline
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            // Global error handling
            app.UseMiddleware<ErrorHandlerMiddleware>();

            // Authentication MUST come before Authorization
            app.UseAuthentication();
            app.UseAuthorization();

            // Map controllers
            app.MapControllers();

            // Start application
            app.Run();
        }
    }
}