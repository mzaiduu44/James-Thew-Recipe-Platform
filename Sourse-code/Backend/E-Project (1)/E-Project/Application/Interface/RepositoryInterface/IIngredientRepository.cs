using Application.DTOs.Ingredient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface.RepositoryInterface
{
    public interface IIngredientRepository
    {
        Task<List<IngredientForListning>> GetAllIngredient();
        Task<IngredientDto> GetIngredientById(int id);
        Task<bool> AddIngredient(IngredientForCreation ingredientForCreation);
        Task<bool> UpdateIngredient(IngredientForUpdation ingredientForUpdation);
        Task<bool> DeleteIngredient(int id);
    }
}
