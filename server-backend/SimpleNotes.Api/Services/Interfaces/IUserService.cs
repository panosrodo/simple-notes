using SimpleNotes.Api.DTOs;

namespace SimpleNotes.Api.Services.Interfaces
{
    public interface IUserService
    {
        Task<UserReadOnlyDTO> GetMeAsync();
    }
}
