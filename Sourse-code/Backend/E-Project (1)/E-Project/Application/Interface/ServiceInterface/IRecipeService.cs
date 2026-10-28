using Application.DTOs.Recipe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface.ServiceInterface
{
    public interface IRecipeService
    {
        Task<List<RecipeForListning>> GetAllRecipe();
        Task<RecipeDto> GetRecipeById(int id);
        Task<bool> AddRecipe(RecipeForCreation recipeForCreation);
        Task<bool> UpdateRecipe(int id, RecipeForUpdation recipeForUpdation);
        Task<bool> DeleteRecipe(int id);
    }
}
