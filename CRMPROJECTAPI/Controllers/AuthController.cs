using Application.Interfaces;
using Domain.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace CRMPROJECTAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService ?? throw new ArgumentNullException(nameof(authService));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _authService.LoginAsync(loginDto.EmailId, loginDto.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            return Ok(user);
        }
    }
}

//public class AuthController : ControllerBase
//{
//    private readonly IAuthService _authService;

//    public AuthController(IAuthService authService)
//    {
//        _authService = authService;
//    }

//    [HttpPost("login")]
//    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
//    {
//        var user = await _authService.LoginAsync(loginDto.EmailId, loginDto.Password);

//        if (user == null)
//        {
//            return Unauthorized(new { message = "Invalid email or password" });
//        }

//        return Ok(user);
//    }

//}