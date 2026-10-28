using Application.DTOs.Ingredient;
using Application.Interface.ServiceInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace E_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class IngredientController : ControllerBase
    {
        private readonly IIngredientService _ingredientService;

        public IngredientController(IIngredientService ingredientService)
        {
            _ingredientService = ingredientService;
        }


        // GET: api/<IngredientController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = await _ingredientService.GetAllIngredient();
            return Ok(result);
        }

        // GET api/<IngredientController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _ingredientService.GetIngredientById(id);

            return Ok(result);
        }

        // POST api/<IngredientController>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Post(IngredientForCreation ingredientForCreation)
        {
            var result = await _ingredientService.AddIngredient(ingredientForCreation);

            return Ok(new
            {
                Message = "Ingredient added successfully."
            });
        }

        // PUT api/<IngredientController>/5
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(IngredientForUpdation ingredientForUpdation)
        {
            var result =await _ingredientService.UpdateIngredient(ingredientForUpdation);

            return Ok(new
            {
                Message = "Ingredient updated successfully."
            });
        }

        // DELETE api/<IngredientController>/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _ingredientService.DeleteIngredient(id);

            return Ok(new
            {
                Message = "Ingredient deleted successfully."
            });
        }
    }
}
