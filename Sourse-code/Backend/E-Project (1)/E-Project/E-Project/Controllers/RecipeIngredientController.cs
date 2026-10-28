using Application.DTOs.RecipeIngredient;
using Application.Interface.ServiceInterface;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace E_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RecipeIngredientController : ControllerBase
    {
        private readonly IRecipeIngredientService _recipeIngredientService;

        public RecipeIngredientController(IRecipeIngredientService recipeIngredientService)
        {
            _recipeIngredientService = recipeIngredientService;
        }


        // GET: api/<RecipeIngredientController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = await _recipeIngredientService.GetAllRecipeIngredient();

            return Ok(result);
        }

        // GET api/<RecipeIngredientController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {

            var result = await _recipeIngredientService.GetRecipeIngredientById(id);

            return Ok(result);
 
        }

        // POST api/<RecipeIngredientController>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Post(RecIngredientForCreation recIngredientForCreation)
        {
            var result = await _recipeIngredientService.AddRecipeIngredient(
           recIngredientForCreation);

            if (!result.Success)
            {
                return BadRequest(new
                {
                    message = result.Message
                });
            }

            return Ok(new
            {
                message = result.Message
            });

            
        }

        // PUT api/<RecipeIngredientController>/5
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(RecIngredientForUpdation recIngredientForUpdation)
        {
            var result = await _recipeIngredientService.UpdateRecipeIngredient(recIngredientForUpdation);

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

        // DELETE api/<RecipeIngredientController>/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result =await _recipeIngredientService.DeleteRecipeIngredient(id);

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
