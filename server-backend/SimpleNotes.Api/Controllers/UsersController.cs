using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SimpleNotes.Api.Services.Interfaces;

namespace SimpleNotes.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _users;

    public UsersController(IUserService users)
    {
        _users = users;
    }

    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var me = await _users.GetMeAsync();
        return Ok(me);
    }
}