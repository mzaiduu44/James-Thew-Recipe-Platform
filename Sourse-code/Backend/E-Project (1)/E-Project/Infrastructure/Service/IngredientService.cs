using Application.DTOs.Ingredient;
using Application.Interface.RepositoryInterface;
using Application.Interface.ServiceInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Service
{
    public class IngredientService : IIngredientService
    {
        private readonly IIngredientRepository _ingredientRepository;

        public IngredientService(IIngredientRepository ingredientRepository)
        {
            _ingredientRepository = ingredientRepository;
        }

        public Task<bool> AddIngredient(IngredientForCreation ingredientForCreation)
        {
            return _ingredientRepository.AddIngredient(ingredientForCreation);
        }

        public Task<bool> DeleteIngredient(int id)
        {
            return _ingredientRepository.DeleteIngredient(id);
        }

        public Task<List<IngredientForListning>> GetAllIngredient()
        {
            return _ingredientRepository.GetAllIngredient();
        }

        public Task<IngredientDto> GetIngredientById(int id)
        {
            return _ingredientRepository.GetIngredientById(id);
        }

        public Task<bool> UpdateIngredient(IngredientForUpdation ingredientForUpdation)
        {
            return _ingredientRepository.UpdateIngredient(ingredientForUpdation);
        }
    }
}
