using Application.DTOs.User;
using Application.Interface.ServiceInterface;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace E_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }


        // GET: api/<UserController>
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var resul = await _userService.GetAllUser();
            return Ok(resul);
        }

        // GET api/<UserController>/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var res = await _userService.GetUserById(id);
            if(res == null)
            {
                return NotFound("User Not Found");
            }
            return Ok(res);
        }

        // POST api/<UserController>
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Post( UserForCreation userForCreation)
        {

                var email = userForCreation.Email;
                var emailExists = _userService.IsEmailAlreadyExist(email);
                if (emailExists)
                {
                    return Conflict(new { Message = "Email Already Exists" });
                }

            var res = _userService.AddUser(userForCreation);
            return Ok(new { Message = res });


        }

        // PUT api/<UserController>/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, UserForUpdation userForUpdation)
        {
            var callerId = User.FindFirst("UserId")?.Value;
            var callerRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var targetId = id != 0 ? id : userForUpdation.Id;

            if (callerRole != "Admin" && callerId != targetId.ToString())
            {
                return Forbid();
            }

            if (userForUpdation.Id == 0 && id != 0)
            {
                userForUpdation.Id = id;
            }

            try
            {
                var result = await _userService.UpdateUser(userForUpdation);

                if (!result)
                {
                    return BadRequest("User could not be updated.");
                }

                return Ok("User updated successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // DELETE api/<UserController>/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var callerId = User.FindFirst("UserId")?.Value;
            var callerRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (callerRole != "Admin" && callerId != id.ToString())
            {
                return Forbid();
            }

            var result = await _userService.DeleteUser(id);
            if (!result)
            {
                return NotFound("User not found.");
            }

            return Ok("User deleted successfully.");
        }
    }
}
