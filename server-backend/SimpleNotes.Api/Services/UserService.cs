using Microsoft.EntityFrameworkCore;
using SimpleNotes.Api.Data;
using SimpleNotes.Api.DTOs;
using SimpleNotes.Api.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace SimpleNotes.Api.Services;

public class UserService : IUserService
{
    private readonly AppDBContext _db;
    private readonly IHttpContextAccessor _http;

    public UserService(AppDBContext db, IHttpContextAccessor http)
    {
        _db = db;
        _http = http;
    }

    public async Task<UserReadOnlyDTO> GetMeAsync()
    {
        var userId = GetUserIdFromToken();

        var user = await _db.Users.AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null)
            throw new KeyNotFoundException("User not found.");

        return new UserReadOnlyDTO
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            UserRole = user.UserRole.ToString()
        };
    }

    private int GetUserIdFromToken()
    {
        var principal = _http.HttpContext?.User;
        if (principal?.Identity?.IsAuthenticated != true)
            throw new UnauthorizedAccessException("Not authenticated.");

        var sub = principal.FindFirstValue(JwtRegisteredClaimNames.Sub)
                  ?? principal.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(sub) || !int.TryParse(sub, out var userId))
            throw new UnauthorizedAccessException("Invalid token.");

        return userId;
    }
}