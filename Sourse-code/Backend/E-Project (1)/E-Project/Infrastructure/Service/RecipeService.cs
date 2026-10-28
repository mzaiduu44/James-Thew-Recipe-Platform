using Application.DTOs.Recipe;
using Application.Interface.RepositoryInterface;
using Application.Interface.ServiceInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Service
{
    public class RecipeService : IRecipeService
    {
        private readonly IRecipeRepository _recipeRepository;

        public RecipeService(IRecipeRepository recipeRepository)
        {
            _recipeRepository = recipeRepository;
        }


        public Task<bool> AddRecipe(RecipeForCreation recipeForCreation)
        {
            return _recipeRepository.AddRecipe(recipeForCreation);
        }

        public Task<bool> DeleteRecipe(int id)
        {
            return _recipeRepository.DeleteRecipe(id);
        }

        public Task<List<RecipeForListning>> GetAllRecipe()
        {
            return _recipeRepository.GetAllRecipe();
        }

        // TODO(security): Paywall bypass vulnerability. Full recipe data (including instructions and ingredients)
        // is retrieved and returned without verifying the caller's subscription tier. Subscription checks or DTO
        // projection should be implemented here or at repository layer once the product team decides between a
        // truncated teaser response or a separate preview endpoint.
        public Task<RecipeDto> GetRecipeById(int id)
        {
            return _recipeRepository.GetRecipeById(id);
        }

        public Task<bool> UpdateRecipe(int id, RecipeForUpdation recipeForUpdation)
        {
            return _recipeRepository.UpdateRecipe(id,recipeForUpdation);
        }
    }
}
