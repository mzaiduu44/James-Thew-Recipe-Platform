using Application.DTOs.User;
using Application.Interface.ServiceInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace E_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }


        // POST api/<AuthController>
        [AllowAnonymous]
        [HttpPost]
        public IActionResult Post(LoginsRequest loginsRequest)
        {
            var user = _userService.GetUserEmailAndPassword(loginsRequest);
            if(user != null)
            {
                return Ok(_userService.GenerateToken(user));
            }
            else
            {
                return Unauthorized(new { Message = "Email and Password are invalid..." });
            }
        }

    }
}
