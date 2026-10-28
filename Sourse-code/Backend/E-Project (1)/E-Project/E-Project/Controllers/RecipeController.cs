using Application.DTOs.Recipe;
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
    public class RecipeController : ControllerBase
    {
        private readonly IRecipeService _recipeService;

        public RecipeController(IRecipeService recipeService)
        {
            _recipeService = recipeService;
        }


        // GET: api/<RecipeController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var result = await _recipeService.GetAllRecipe();

                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // TODO(security): Paywall bypass vulnerability. RecipeDto currently returns full content
        // (Procedure, Ingredients, RecipeImages, etc.) regardless of whether the requesting caller
        // has an active paid subscription tier. The "locked" recipe UI on the frontend is purely cosmetic
        // because the complete recipe data is already leaked in this response.
        // Requires a product decision: either return a teaser/preview DTO for unpaid users or implement a
        // dedicated /preview endpoint, and gate full RecipeDto behind subscription status checks.
        // GET api/<RecipeController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var result = await _recipeService.GetRecipeById(id);

                if (result == null)
                {
                    return NotFound("Recipe not found.");
                }

                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST api/<RecipeController>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Post(RecipeForCreation recipeForCreation)
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (role != "Admin")
            {
                return StatusCode(403, new
                {
                    Message = "Only Admin can add recipes."
                });
            }

            try
            {
                var result = await _recipeService.AddRecipe(recipeForCreation);

                if (!result)
                {
                    return BadRequest("Recipe could not be created.");
                }

                return Ok("Recipe created successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // PUT api/<RecipeController>/5
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, RecipeForUpdation recipeForUpdation)
        {
            try
            {
                var result = await _recipeService .UpdateRecipe(id, recipeForUpdation);

                if (!result)
                {
                    return BadRequest( "Recipe could not be updated.");
                }

                return Ok("Recipe updated successfully.");
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE api/<RecipeController>/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var result = await _recipeService.DeleteRecipe(id);

                if (!result)
                {
                    return NotFound("Recipe not found.");
                }

                return Ok("Recipe deleted successfully.");
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
