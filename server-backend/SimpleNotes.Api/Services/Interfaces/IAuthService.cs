using SimpleNotes.Api.DTOs;

namespace SimpleNotes.Api.Services.Interfaces
{
    public interface IAuthService
    {
        Task<UserReadOnlyDTO> RegisterAsync(UserSignupDTO dto);
        Task<JwtTokenDTO> LoginAsync(UserLoginDTO dto);
    }
}
