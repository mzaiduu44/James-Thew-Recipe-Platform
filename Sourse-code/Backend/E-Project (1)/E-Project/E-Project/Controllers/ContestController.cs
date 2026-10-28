using Application.DTOs.Contest;
using Application.Interface.ServiceInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace E_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ContestController : ControllerBase
    {
        private readonly IContestService _contestService;

        public ContestController(IContestService contestService)
        {
            _contestService = contestService;
        }



        // GET: api/<ContestController>
        
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = await _contestService.GetAllContest();

            return Ok(result);

        }

        // GET api/<ContestController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _contestService.GetContestById(id);

            if (result == null)
            {
                return NotFound("Contest not found.");
            }

            return Ok(result);

        }

        // POST api/<ContestController>
        [Authorize]
        [HttpPost]
        public  async Task<IActionResult> Post(ContestForCreation contestForCreation)
        {
            var result = await _contestService.AddContest(contestForCreation);

            if (result)
            {
                return Ok(new
                {
                    Message = "Contest created successfully."
                });
            }

            return BadRequest(new
            {
                Message = "Contest could not be created."
            });

        }

        // PUT api/<ContestController>/5
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(ContestForUpdation contestForUpdation)
        {
            var result = await _contestService.UpdateContest(contestForUpdation);

            if (result)
            {
                return Ok(new
                {
                    Message = "Contest updated successfully."
                });
            }

            return BadRequest(new
            {
                Message = "Contest could not be updated."
            });
        }

        // DELETE api/<ContestController>/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _contestService.DeletContest(id);

            if (result)
            {
                return Ok(new
                {
                    Message = "Contest deleted successfully."
                });
            }

            return BadRequest(new
            {
                Message = "Contest could not be deleted."
            });
        }
    }
}
