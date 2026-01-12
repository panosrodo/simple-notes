using Microsoft.EntityFrameworkCore;
using SimpleNotes.Api.Data;
using SimpleNotes.Api.Repositories.Interfaces;

namespace SimpleNotes.Api.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDBContext _db;

    public UserRepository(AppDBContext db)
    {
        _db = db;
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _db.Users.FirstOrDefaultAsync(u => u.Id == id);
    }
}