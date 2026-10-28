using Application.DTOs.Ingredient;
using Application.Interface.RepositoryInterface;
using AutoMapper;
using Domain.DatabaseConfiq;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class IngredientRepository : IIngredientRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public IngredientRepository(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<bool> AddIngredient(IngredientForCreation ingredientForCreation)
        {
            if (ingredientForCreation == null || string.IsNullOrWhiteSpace(ingredientForCreation.Name))
            {
                throw new Exception("Ingredient name cannot be empty.");
            }

            var ingredientExists = await _context.Ingredients.AnyAsync(x =>
                x.Name.ToLower() == ingredientForCreation.Name.Trim().ToLower());

            if (ingredientExists)
            {
                throw new Exception("This ingredient already exists.");
            }

            var ingredient = _mapper.Map<Ingredient>(ingredientForCreation);
            ingredient.Name = ingredientForCreation.Name.Trim();

            await _context.Ingredients.AddAsync(ingredient);

            try
            {
                return await _context.SaveChangesAsync() > 0;
            }
            catch (Exception)
            {
                if (_context.Entry(ingredient).Properties.Any(p => p.Metadata.Name == "ProfileImage"))
                {
                    ingredient.ProfileImage = null;
                }
                return await _context.SaveChangesAsync() > 0;
            }
        }

        public async Task<bool> DeleteIngredient(int id)
        {
            var ingredient = await _context.Ingredients.FirstOrDefaultAsync(x => x.Id == id);

            if (ingredient == null)
            {
                throw new Exception("Ingredient not found.");
            }

            _context.Ingredients.Remove(ingredient);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<List<IngredientForListning>> GetAllIngredient()
        {
            var ingredients = await _context.Ingredients.AsNoTracking().ToListAsync();
            return _mapper.Map<List<IngredientForListning>>(ingredients);
        }

        public async Task<IngredientDto> GetIngredientById(int id)
        {
            var ingredient = await _context.Ingredients.AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);

            if (ingredient == null)
            {
                throw new Exception("Ingredient not found.");
            }

            return _mapper.Map<IngredientDto>(ingredient);
        }

        public async Task<bool> UpdateIngredient(IngredientForUpdation ingredientForUpdation)
        {
            if (ingredientForUpdation == null || string.IsNullOrWhiteSpace(ingredientForUpdation.Name))
            {
                throw new Exception("Ingredient name cannot be empty.");
            }

            var ingredient = await _context.Ingredients.FirstOrDefaultAsync(x => x.Id == ingredientForUpdation.Id);

            if (ingredient == null)
            {
                throw new Exception("Ingredient not found.");
            }


            var duplicate = await _context.Ingredients.AnyAsync(x =>
                x.Id != ingredientForUpdation.Id &&
                x.Name.ToLower() == ingredientForUpdation.Name.Trim().ToLower());

            if (duplicate)
            {
                throw new Exception("This ingredient name already exists.");
            }

            ingredient.Name = ingredientForUpdation.Name.Trim();

            try
            {
                ingredient.ProfileImage = ingredientForUpdation.ProfileImage;
                return await _context.SaveChangesAsync() > 0;
            }
            catch (Exception)
            {

                return await _context.SaveChangesAsync() > 0;
            }
        }
    }
}
