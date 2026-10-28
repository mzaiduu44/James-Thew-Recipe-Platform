using Application.DTOs.Subscription;
using Application.Interface.ServiceInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace E_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubscriptionController : ControllerBase
    {
        private readonly ISubscriptionService _subscriptionService;

        public SubscriptionController(ISubscriptionService subscriptionService)
        {
            _subscriptionService = subscriptionService;
        }


        // GET: api/<SubscriptionController>
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<List<SubscriptionForListning>> Get()
        {
            return await _subscriptionService.GetAllSubscription();
        }


        // GET api/<SubscriptionController>/5
        [Authorize(Roles = "Member,Admin")]
        [HttpGet("{id}")]
        public Task<SubscriptionDto> Get(int id)
        {
            return _subscriptionService.GetSubscriptionById(id);
        }


        // POST api/<SubscriptionController>
        [Authorize(Roles = "User,Admin")]
        [HttpPost]
        public async Task<IActionResult> Post(SubscriptionForCreation subscriptionForCreation)
        {
            var res = await _subscriptionService.AddSubscription(subscriptionForCreation);
            if(!res.Success)
            {
                return BadRequest(new { Message = res.Message });
            }
            else
            {
                return Ok(new
                {
                    message = res.Message
                });
            }
        }


        // PUT api/<SubscriptionController>/5
        [Authorize(Roles = "Member,Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, SubscriptionForUpdation subscriptionForUpdation)
        {
            var result = await _subscriptionService.UpdateSubscription(id, subscriptionForUpdation);
            if (!result.Success)
            {
                return BadRequest(result.Message);
            }

            return Ok(result.Message);

        }


        // DELETE api/<SubscriptionController>/5
        [Authorize(Roles = "Member,Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _subscriptionService.DeleteSubscription(id);

            if (!result.Success)
            {
                return BadRequest(result.Message);
            }

            return Ok(result.Message);
        }


    }
}
