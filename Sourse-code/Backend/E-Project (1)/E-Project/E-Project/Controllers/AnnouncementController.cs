using Application.DTOs.Announcement;
using Application.Interface.ServiceInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace E_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AnnouncementController : ControllerBase
    {
        private readonly IAnnouncementService _announcementService;

        public AnnouncementController(IAnnouncementService announcementService)
        {
            _announcementService = announcementService;
        }



        // GET: api/<AnnouncementController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = await _announcementService.GetAllAnnouncement();
            return Ok(result);
        }

        // GET api/<AnnouncementController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result =await _announcementService.GetAnnouncementById(id);
            return Ok(result);
        }

        // POST api/<AnnouncementController>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Post(AnnouncementForCreation announcementForCreation)
        {

            try
            {
                var result = await _announcementService.AddAnnouncenet(announcementForCreation);

                if (!result)
                {
                    return BadRequest(
                        "Announcement could not be created.");
                }

                return Ok(
                    "Announcement created successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT api/<AnnouncementController>/5
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(AnnouncementForUpdation announcementForUpdation)
        {
            try
            {
                var result = await _announcementService.UpdateAnnouncement(announcementForUpdation);

                if (!result)
                {
                    return BadRequest("Announcement could not be updated.");
                }

                return Ok( "Announcement updated successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE api/<AnnouncementController>/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _announcementService.DeleteAnnouncement(id);
            if (!result)
            {
                return NotFound("Announcement Not Found");
            }
            return Ok("Announcement Deleted Successfully");
        }
    }
}
