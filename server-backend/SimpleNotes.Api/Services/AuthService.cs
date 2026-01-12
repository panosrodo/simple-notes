using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SimpleNotes.Api.Core.Enums;
using SimpleNotes.Api.Data;
using SimpleNotes.Api.DTOs;
using SimpleNotes.Api.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SimpleNotes.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDBContext _db;
        private readonly IConfiguration _config;

        public AuthService(AppDBContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        public async Task<UserReadOnlyDTO> RegisterAsync(UserSignupDTO dto)
        {
            var username = dto.Username!.Trim();
            var email = dto.Email!.Trim().ToLowerInvariant();
            var password = dto.Password!;

            var usernameExists = await _db.Users.AnyAsync(u => u.Username.ToLower() == username.ToLower());
            if (usernameExists) throw new InvalidOperationException("Username already exists.");

            var emailExists = await _db.Users.AnyAsync(u => u.Email.ToLower() == email);
            if (emailExists) throw new InvalidOperationException("Email already exists.");

            var user = new User
            {
                Username = username,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                UserRole = UserRole.User
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return new UserReadOnlyDTO
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                UserRole = user.UserRole.ToString()
            };
        }

        public async Task<JwtTokenDTO> LoginAsync(UserLoginDTO dto)
        {
            var username = dto.Username!.Trim();

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user is null) throw new UnauthorizedAccessException("Invalid credentials.");

            var ok = BCrypt.Net.BCrypt.Verify(dto.Password!, user.PasswordHash);
            if (!ok) throw new UnauthorizedAccessException("Invalid credentials.");

            var token = CreateJwt(user);

            return new JwtTokenDTO { Token = token };
        }

        private string CreateJwt(User user)
        {
            var key = _config["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key missing");
            var issuer = _config["Jwt:Issuer"] ?? throw new InvalidOperationException("Jwt:Issuer missing");
            var audience = _config["Jwt:Audience"] ?? throw new InvalidOperationException("Jwt:Audience missing");
            var expiresMinutes = int.TryParse(_config["Jwt:ExpiresMinutes"], out var m) ? m : 60;

            var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Role, user.UserRole.ToString())
        };

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var creds = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var jwt = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiresMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(jwt);
        }
    }
}
