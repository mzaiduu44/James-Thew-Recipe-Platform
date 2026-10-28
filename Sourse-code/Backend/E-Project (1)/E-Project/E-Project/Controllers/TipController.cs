using Application.DTOs.Tips;
using Application.Interface.ServiceInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace E_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TipController : ControllerBase
    {
        private readonly ITipService _tipService;

        public TipController (ITipService tipService)
        {
            _tipService = tipService;
        }


        // GET: api/<TipController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = await _tipService.GetAllTip();

            return Ok(result);
        }

        // TODO(security): Paywall bypass vulnerability. TipDto returns full Description and details
        // regardless of whether ActionType is Premium and whether the caller has an active subscription.
        // Requires server-side tier gating or teaser projection.
        // GET api/<TipController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _tipService.GetTipById(id);

            return Ok(result);
        }

        // POST api/<TipController>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Post(TipForCreation tipForCreation)
        {
            var result = await _tipService.AddTip(tipForCreation);

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

        // PUT api/<TipController>/5
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(TipForUpdation tipForUpdation)
        {
            var result = await _tipService.UpdateTip(tipForUpdation);

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

        // DELETE api/<TipController>/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result =await _tipService.DeletTip(id);

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
    }
}
