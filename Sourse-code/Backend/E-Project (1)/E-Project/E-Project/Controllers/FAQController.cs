using Application.DTOs.FAQ;
using Application.Interface.ServiceInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace E_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FAQController : ControllerBase
    {
        private readonly IFAQService _faqService;

        public FAQController(IFAQService faqService)
        {
            _faqService = faqService;
        }


        // GET: api/<FAQController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = await _faqService.GetAllFAQ();

            return Ok(result);
        }

        // GET api/<FAQController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _faqService.GetFAQById(id);

            if (result == null)
            {
                return NotFound(new
                {
                    Message = "FAQ not found."
                });
            }

            return Ok(result);

        }

        // POST api/<FAQController>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Post(faqForCreation faqForCreation)
        {
            var result = await _faqService.AddFAQ(faqForCreation);

            if (result)
            {
                return Ok(new
                {
                    Message = "FAQ added successfully."
                });
            }

            return BadRequest(new
            {
                Message = "FAQ could not be added."
            });
        }

        // PUT api/<FAQController>/5
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(faqForUpdation faqForUpdation)
        {
            var result = await _faqService.UpdateFAQ(faqForUpdation);

            if (result)
            {
                return Ok(new
                {
                    Message = "FAQ updated successfully."
                });
            }

            return BadRequest(new
            {
                Message = "FAQ could not be updated."
            });
        }

        // DELETE api/<FAQController>/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _faqService.DeleteFAQ(id);

            if (result)
            {
                return Ok(new
                {
                    Message = "FAQ deleted successfully."
                });
            }

            return BadRequest(new
            {
                Message = "FAQ could not be deleted."
            });
        }
    }
}
