using Application.DTOs.Recipe;
using Application.DTOs.RecipeIngredient;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface.RepositoryInterface
{
    public interface IRecipeIngredientRepository
    {
        Task<List<RecIngredientForListning>> GetAllRecipeIngredient();
        Task<RecIngredientDto> GetRecipeIngredientById(int id);
        Task<(bool Success, string Message)> AddRecipeIngredient(RecIngredientForCreation recIngredientForCreation);
        Task<(bool Success, string Message)> UpdateRecipeIngredient(RecIngredientForUpdation recIngredientForUpdation);
        Task<(bool Success, string Message)> DeleteRecipeIngredient(int id);
    }
}
