using Application.DTOs.ContestSubmission;
using Application.Interface.ServiceInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace E_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContestSubmissionController : ControllerBase
    {
        private readonly IContestSubmissionService _contestSubmissionService;

        public ContestSubmissionController(IContestSubmissionService contestSubmissionService)
        {
            _contestSubmissionService = contestSubmissionService;
        }


        // GET: api/<ContestSubmissionController>
        [HttpGet]
        public Task<List<ContestSubmissionForListning>> Get()
        {
            return _contestSubmissionService.GetAllContestSubmission();
        }

        // GET api/<ContestSubmissionController>/5
        [HttpGet("{id}")]
        public Task<ContestSubmissionDto> Get(int id)
        {
            return _contestSubmissionService.GetContestSubmissionById(id);
        }

        // POST api/<ContestSubmissionController>
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Post(ContestSubmissionForCreation contestSubmissionForCreation)
        {

            try
            {
                var result = await _contestSubmissionService
                    .AddContestSubmission(contestSubmissionForCreation);

                if (!result)
                {
                    return BadRequest(
                        "Contest submission could not be created.");
                }

                return Ok(
                    "Contest submitted successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        

        // DELETE api/<ContestSubmissionController>/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public Task<bool> Delete(int id)
        {
            return _contestSubmissionService.DeleteContestSubmission(id);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("winner/{submissionId}")]
        public async Task<IActionResult> SetWinner(int submissionId)
        {
            try
            {
                var result = await _contestSubmissionService
                    .SetWinner(submissionId);

                if (!result)
                {
                    return BadRequest(
                        "Winner could not be selected.");
                }

                return Ok("Contest winner selected successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
