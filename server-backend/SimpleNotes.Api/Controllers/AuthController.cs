using Microsoft.AspNetCore.Mvc;
using SimpleNotes.Api.DTOs;
using SimpleNotes.Api.Services.Interfaces;

namespace SimpleNotes.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Register new user
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserSignupDTO dto)
        {
            var user = await _authService.RegisterAsync(dto);
            return Created(string.Empty, user);
        }

        /// <summary>
        /// Login user and return JWT token
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDTO dto)
        {
            var token = await _authService.LoginAsync(dto);
            return Ok(token);
        }
    }
}
