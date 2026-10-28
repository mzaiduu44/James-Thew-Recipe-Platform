using Application.DTOs.RecipeIngredient;
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
    public class RecipeIngredientRepository : IRecipeIngredientRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public RecipeIngredientRepository(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }


        public async Task<(bool Success, string Message)> AddRecipeIngredient(RecIngredientForCreation recIngredientForCreation)
        {
            if (recIngredientForCreation == null || string.IsNullOrWhiteSpace(recIngredientForCreation.RecipeName))
            {
                return (false, "Recipe name is required.");
            }

            var recipe = await _context.Recipes.FirstOrDefaultAsync(r => r.Title.ToLower() ==
                recIngredientForCreation.RecipeName.Trim().ToLower());

            if (recipe == null)
            {
                return (false, $"Recipe '{recIngredientForCreation.RecipeName}' does not exist.");
            }

            if (recIngredientForCreation.recipeitem == null || recIngredientForCreation.recipeitem.Count == 0)
            {
                return (false, "Please add at least one ingredient.");
            }

            var duplicateIngredient = recIngredientForCreation.recipeitem
                .GroupBy(x => x.IngredientName.Trim().ToLower())
                .FirstOrDefault(x => x.Count() > 1);

            if (duplicateIngredient != null)
            {
                return (false, $"You cannot add ingredient '{duplicateIngredient.Key}' more than once.");
            }

            await using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                foreach (var item in recIngredientForCreation.recipeitem)
                {
                    if (string.IsNullOrWhiteSpace(item.IngredientName))
                    {
                        await transaction.RollbackAsync();
                        return (false, "Ingredient name is required.");
                    }

                    if (string.IsNullOrWhiteSpace(item.Quantity))
                    {
                        await transaction.RollbackAsync();
                        return (false, $"Quantity is required for ingredient '{item.IngredientName}'.");
                    }

                    var ingredient = await _context.Ingredients.FirstOrDefaultAsync(i =>
                        i.Name.ToLower() == item.IngredientName.Trim().ToLower());

                    if (ingredient == null)
                    {
                        await transaction.RollbackAsync();
                        return (false, $"Ingredient '{item.IngredientName}' does not exist.");
                    }

                    var alreadyExists = await _context.RecipeIngredients.AnyAsync(ri =>
                        ri.RecipeId == recipe.Id && ri.IngredientId == ingredient.Id);

                    if (alreadyExists)
                    {
                        await transaction.RollbackAsync();
                        return (false, $"Ingredient '{ingredient.Name}' is already added to recipe '{recipe.Title}'.");
                    }
                }

                foreach (var item in recIngredientForCreation.recipeitem)
                {
                    var ingredient = await _context.Ingredients.FirstAsync(i =>
                        i.Name.ToLower() == item.IngredientName.Trim().ToLower());

                    var recipeIngredient = new RecipeIngredient
                    {
                        RecipeId = recipe.Id,
                        IngredientId = ingredient.Id,
                        Quantity = item.Quantity.Trim()
                    };

                    try
                    {
                        recipeIngredient.ProfileImage = item.ProfileImage;
                    }
                    catch (Exception)
                    {
                        recipeIngredient.ProfileImage = null;
                    }

                    await _context.RecipeIngredients.AddAsync(recipeIngredient);
                }

                var result = await _context.SaveChangesAsync();

                if (result <= 0)
                {
                    await transaction.RollbackAsync();
                    return (false, "Recipe ingredients could not be added.");
                }

                await transaction.CommitAsync();
                return (true, "All recipe ingredients added successfully.");
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                return (false, "Something went wrong while adding recipe ingredients.");
            }
        }

        public async Task<(bool Success, string Message)> DeleteRecipeIngredient(int id)
        {
            var recipeIngredient = await _context.RecipeIngredients.FirstOrDefaultAsync(x => x.Id == id);

            if (recipeIngredient == null)
            {
                return (false, "Recipe ingredient not found.");
            }

            _context.RecipeIngredients.Remove(recipeIngredient);
            var result = await _context.SaveChangesAsync();

            if (result <= 0)
            {
                return (false, "Recipe ingredient could not be deleted.");
            }

            return (true, "Recipe ingredient deleted successfully.");
        }

        public async Task<List<RecIngredientForListning>> GetAllRecipeIngredient()
        {
            var recipeIngredients = await _context.RecipeIngredients
                .Include(x => x.Recipe)
                .Include(x => x.Ingredient)
                .AsNoTracking()
                .ToListAsync();

            return recipeIngredients.Select(x => new RecIngredientForListning
            {
                Id = x.Id,
                RecipeName = x.Recipe != null ? x.Recipe.Title : "Unknown Recipe",
                IngredientName = x.Ingredient != null ? x.Ingredient.Name : "Unknown Ingredient",
                Quantity = x.Quantity,
                ProfileImage = _context.Entry(x).Properties.Any(p => p.Metadata.Name == "ProfileImage") ? x.ProfileImage : null
            }).ToList();
        }

        public async Task<RecIngredientDto> GetRecipeIngredientById(int id)
        {
            var recipeIngredient = await _context.RecipeIngredients
                .Include(x => x.Recipe)
                .Include(x => x.Ingredient)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);

            if (recipeIngredient == null)
            {
                throw new Exception("Recipe ingredient not found.");
            }

            return new RecIngredientDto
            {
                Id = recipeIngredient.Id,
                RecipeName = recipeIngredient.Recipe != null ? recipeIngredient.Recipe.Title : "Unknown",
                IngredientName = recipeIngredient.Ingredient != null ? recipeIngredient.Ingredient.Name : "Unknown",
                Quantity = recipeIngredient.Quantity,
                ProfileImage = _context.Entry(recipeIngredient).Properties.Any(p => p.Metadata.Name == "ProfileImage") ? recipeIngredient.ProfileImage : null
            };
        }

        public async Task<(bool Success, string Message)> UpdateRecipeIngredient(RecIngredientForUpdation recIngredientForUpdation)
        {
            if (recIngredientForUpdation == null) return (false, "Update data input is invalid.");

            var recipeIngredient = await _context.RecipeIngredients.FirstOrDefaultAsync(x => x.Id == recIngredientForUpdation.Id);

            if (recipeIngredient == null)
            {
                return (false, "Recipe ingredient not found.");
            }

            var recipe = await _context.Recipes.FirstOrDefaultAsync(x =>
                x.Title.ToLower() == recIngredientForUpdation.RecipeName.Trim().ToLower());

            if (recipe == null)
            {
                return (false, $"Recipe '{recIngredientForUpdation.RecipeName}' does not exist.");
            }

            var ingredient = await _context.Ingredients.FirstOrDefaultAsync(x =>
                x.Name.ToLower() == recIngredientForUpdation.IngredientName.Trim().ToLower());

            if (ingredient == null)
            {
                return (false, $"Ingredient '{recIngredientForUpdation.IngredientName}' does not exist.");
            }

            if (string.IsNullOrWhiteSpace(recIngredientForUpdation.Quantity)) 
            { 
                return (false, "Quantity is required."); 
            }
            var duplicate = await _context.RecipeIngredients.AnyAsync(x =>
            x.Id != recIngredientForUpdation.Id &&
            x.RecipeId == recipe.Id && 
            x.IngredientId == ingredient.Id);
            if (duplicate)
            { 
                return (false, $"Ingredient '{ingredient.Name}' is already added to recipe '{recipe.Title}'.");
            }
            recipeIngredient.RecipeId = recipe.Id;
            recipeIngredient.IngredientId = ingredient.Id;
            recipeIngredient.Quantity = recIngredientForUpdation.Quantity.Trim();
            try { recipeIngredient.ProfileImage = recIngredientForUpdation.ProfileImage; }
            catch (Exception)
            {
            }
            var result = await _context.SaveChangesAsync();
            if (result <= 0)
            {
                return (true, "Recipe ingredient verified (No changes needed).");
            }
            return (true, "Recipe ingredient updated successfully.");
        }
    }
}