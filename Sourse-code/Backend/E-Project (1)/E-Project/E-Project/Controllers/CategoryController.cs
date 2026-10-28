using Application.DTOs.Category;
using Application.Interface.ServiceInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace E_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // GET: api/<CategoryController>
        [HttpGet]
        public Task<List<CategoryForListning>> Get()
        {
            return _categoryService.GetAllCategory();
        }

        // GET api/<CategoryController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _categoryService.GetCategoryByid(id);

            if (result == null)
            {
                return NotFound("Category not found.");
            }

            return Ok(result);
        }

        // POST api/<CategoryController>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Post(CategoryForCreation categoryForCreation)
        {

            try
            {
                var result = await _categoryService.AddCategory(categoryForCreation);

                if (!result)
                {
                    return BadRequest("Category could not be created.");
                }

                return Ok( "Category created successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT api/<CategoryController>/5
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, CategoryForUpdation categoryForUpdation)
        {
            try
            {
                var result = await _categoryService.UpdateCategory( id,categoryForUpdation);

                if (!result)
                {
                    return BadRequest("Category could not be updated.");
                }

                return Ok("Category updated successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE api/<CategoryController>/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var result = await _categoryService.DeleteCategory(id);

                if (!result)
                {
                    return BadRequest("Category could not be deleted.");
                }

                return Ok("Category deleted successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
    
}
