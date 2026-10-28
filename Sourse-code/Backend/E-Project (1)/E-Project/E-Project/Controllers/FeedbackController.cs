using Application.DTOs.Feedback;
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
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService _feedbackService;

        public FeedbackController(IFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }


        // GET: api/<FeedbackController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var result = await _feedbackService.GetAllFeedback();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Message = ex.Message
                });
            }
        }

        // GET api/<FeedbackController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var result = await _feedbackService.GetFeedbackById(id);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Message = ex.Message
                });
            }
        }

        // POST api/<FeedbackController>
        [HttpPost]
        public async Task<IActionResult> Post(FeedbackForCreation feedbackForCreation)
        {
            try
            {
                var result = await _feedbackService.AddFeedback(feedbackForCreation);

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
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Message = ex.Message
                });
            }
        }

        // PUT api/<FeedbackController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, FeedbackForUpdation feedbackForUpdation)
        {
            try
            {
                var targetId = id != 0 ? id : feedbackForUpdation.Id;
                if (feedbackForUpdation.Id == 0 && id != 0)
                {
                    feedbackForUpdation.Id = id;
                }

                FeedbackDto existingFeedback;
                try
                {
                    existingFeedback = await _feedbackService.GetFeedbackById(targetId);
                }
                catch
                {
                    return NotFound(new { Message = "Feedback not found." });
                }

                if (existingFeedback == null)
                {
                    return NotFound(new { Message = "Feedback not found." });
                }

                var callerId = User.FindFirst("UserId")?.Value;
                var callerRole = User.FindFirst(ClaimTypes.Role)?.Value;

                if (callerRole != "Admin" && callerId != existingFeedback.UserId.ToString())
                {
                    return Forbid();
                }

                var result = await _feedbackService.UpdateFeedback(feedbackForUpdation);

                if (!result.Success)
                {
                    return StatusCode(403, new
                    {
                        Message = result.Message
                    });
                }

                return Ok(new
                {
                    Message = result.Message
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Message = ex.Message
                });
            }
        }

        // DELETE api/<FeedbackController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                FeedbackDto existingFeedback;
                try
                {
                    existingFeedback = await _feedbackService.GetFeedbackById(id);
                }
                catch
                {
                    return NotFound(new { Message = "Feedback not found." });
                }

                if (existingFeedback == null)
                {
                    return NotFound(new { Message = "Feedback not found." });
                }

                var callerId = User.FindFirst("UserId")?.Value;
                var callerRole = User.FindFirst(ClaimTypes.Role)?.Value;

                if (callerRole != "Admin" && callerId != existingFeedback.UserId.ToString())
                {
                    return Forbid();
                }

                var result = await _feedbackService.DeleteFeedback(id);

                if (!result.Success)
                {
                    return StatusCode(403, new
                    {
                        Message = result.Message
                    });
                }

                return Ok(new
                {
                    Message = result.Message
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Message = ex.Message
                });
            }
        }
    }
}
