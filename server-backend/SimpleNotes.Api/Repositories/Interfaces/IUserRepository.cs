using SimpleNotes.Api.Data;

namespace SimpleNotes.Api.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(int id);
    }
}
