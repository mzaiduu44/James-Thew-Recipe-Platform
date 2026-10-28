using Application.DTOs.SiteFeedback;
using Application.Interface.ServiceInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace E_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SiteFeedbackController : ControllerBase
    {
        private readonly ISiteFeedbackService _siteFeedbackService;

        public SiteFeedbackController(ISiteFeedbackService siteFeedbackService)
        {
            _siteFeedbackService = siteFeedbackService;
        }

        // GET: api/<SiteFeedbackController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = await _siteFeedbackService.GetAllSiteFeedback();

            return Ok(result);
        }

        // GET api/<SiteFeedbackController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _siteFeedbackService.GetSitefeedbackById(id);

            if (result == null)
            {
                return NotFound(new
                {
                    Message = "Site feedback not found."
                });
            }

            return Ok(result);
        }

        // POST api/<SiteFeedbackController>
        [HttpPost]
        public async Task<IActionResult> Post(sitefeedbackForCreation sitefeedbackForCreation)
        {
            var result = await _siteFeedbackService.AddSiteFeedback(sitefeedbackForCreation);

            if (!result.Success)
            {
                return BadRequest(new
                {
                    Message = result.Message
                });
            }

            return Ok(new
            {
                Message = result.Message
            });
        }

        // PUT api/<SiteFeedbackController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, sitefeedbackForUpdation sitefeedbackForUpdation)
        {
            var targetId = id != 0 ? id : sitefeedbackForUpdation.Id;
            if (sitefeedbackForUpdation.Id == 0 && id != 0)
            {
                sitefeedbackForUpdation.Id = id;
            }

            sitefeedbackDto existingFeedback;
            try
            {
                existingFeedback = await _siteFeedbackService.GetSitefeedbackById(targetId);
            }
            catch
            {
                return NotFound(new { Message = "Site feedback not found." });
            }

            if (existingFeedback == null)
            {
                return NotFound(new { Message = "Site feedback not found." });
            }

            var callerId = User.FindFirst("UserId")?.Value;
            var callerRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (callerRole != "Admin" && callerId != existingFeedback.UserId.ToString())
            {
                return Forbid();
            }

            var result = await _siteFeedbackService.UpdateSiteFeedback(sitefeedbackForUpdation);

            if (!result.Success)
            {
                return BadRequest(new
                {
                    Message = result.Message
                });
            }

            return Ok(new
            {
                Message = result.Message
            });
        }

        // DELETE api/<SiteFeedbackController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            sitefeedbackDto existingFeedback;
            try
            {
                existingFeedback = await _siteFeedbackService.GetSitefeedbackById(id);
            }
            catch
            {
                return NotFound(new { Message = "Site feedback not found." });
            }

            if (existingFeedback == null)
            {
                return NotFound(new { Message = "Site feedback not found." });
            }

            var callerId = User.FindFirst("UserId")?.Value;
            var callerRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (callerRole != "Admin" && callerId != existingFeedback.UserId.ToString())
            {
                return Forbid();
            }

            var result = await _siteFeedbackService.DeleteSiteFeedback(id);

            if (!result.Success)
            {
                return BadRequest(new
                {
                    Message = result.Message
                });
            }

            return Ok(new
            {
                Message = result.Message
            });
        }
    }
}
