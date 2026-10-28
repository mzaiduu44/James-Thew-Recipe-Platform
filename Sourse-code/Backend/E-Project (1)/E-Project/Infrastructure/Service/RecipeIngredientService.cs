using Application.DTOs.RecipeIngredient;
using Application.Interface.RepositoryInterface;
using Application.Interface.ServiceInterface;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Service
{
    public class RecipeIngredientService : IRecipeIngredientService
    {
        private readonly IRecipeIngredientRepository _recipeIngredientRepository;

        public RecipeIngredientService(IRecipeIngredientRepository recipeIngredientRepository)
        {
            _recipeIngredientRepository = recipeIngredientRepository;
        }

        public Task<(bool Success, string Message)> AddRecipeIngredient(RecIngredientForCreation recIngredientForCreation)
        {
            return _recipeIngredientRepository.AddRecipeIngredient(recIngredientForCreation);
        }

        public Task<(bool Success, string Message)> DeleteRecipeIngredient(int id)
        {
            return _recipeIngredientRepository.DeleteRecipeIngredient(id);
        }

        public Task<List<RecIngredientForListning>> GetAllRecipeIngredient()
        {
            return _recipeIngredientRepository.GetAllRecipeIngredient();
        }

        public async Task<RecIngredientDto> GetRecipeIngredientById(int id)
        {
            return await _recipeIngredientRepository.GetRecipeIngredientById(id);
        }

      

        public Task<(bool Success, string Message)> UpdateRecipeIngredient(RecIngredientForUpdation recIngredientForUpdation)
        {
            return _recipeIngredientRepository.UpdateRecipeIngredient(recIngredientForUpdation);
        }
    }
}
