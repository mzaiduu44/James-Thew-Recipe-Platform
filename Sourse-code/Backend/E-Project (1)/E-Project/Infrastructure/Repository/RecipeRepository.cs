using Application.DTOs.Recipe;
using Application.Interface.RepositoryInterface;
using AutoMapper;
using Domain.DatabaseConfiq;
using Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Infrastructure.Repository
{
    public class RecipeRepository : IRecipeRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public RecipeRepository(
            ApplicationDbContext context,
            IMapper mapper,
            IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }


        private int? GetCurrentUserId()
        {
            var user = _httpContextAccessor.HttpContext?.User;

            if (user == null || !user.Identity?.IsAuthenticated == true)
                return null;

            var userIdValue = user.FindFirst("UserId")?.Value;

            if (string.IsNullOrEmpty(userIdValue))
            {
                userIdValue = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            }

            if (string.IsNullOrEmpty(userIdValue))
                return null;

            if (!int.TryParse(userIdValue, out int userId))
                return null;

            return userId;
        }

        private string? GetCurrentUserRole()
        {
            var user = _httpContextAccessor.HttpContext?.User;

            if (user == null)
                return null;

            var role = user.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(role))
            {
                role = user.FindFirst("role")?.Value;
            }

            return role;
        }

        public async Task<bool> AddRecipe(RecipeForCreation recipeForCreation)
        {
            if (recipeForCreation == null)
                throw new ArgumentNullException(nameof(recipeForCreation));

            // =========================
            // CATEGORY CHECK
            // =========================
            var categoryExists = await _context.Categories
                .AnyAsync(x => x.Id == recipeForCreation.CategoryId);

            if (!categoryExists)
                throw new Exception(
                    $"Category with ID {recipeForCreation.CategoryId} not found.");


            var userId = GetCurrentUserId();

            if (!userId.HasValue)
            {
                throw new UnauthorizedAccessException(
                    "User ID not found in token.");
            }

            var roleName = GetCurrentUserRole();

            if (!string.Equals(
                roleName,
                "Admin",
                StringComparison.OrdinalIgnoreCase))
            {
                throw new UnauthorizedAccessException(
                    "Only Admin can add recipes.");
            }


            var userExists = await _context.Users
                .AnyAsync(x => x.Id == userId.Value);

            if (!userExists)
                throw new Exception(
                    $"User with ID {userId.Value} not found.");


            var recipe = _mapper.Map<Recipe>(recipeForCreation);

            recipe.CreatedById = userId.Value;
            recipe.CreatedAt = DateTime.UtcNow;


            await _context.Recipes.AddAsync(recipe);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                var errorMessage = ex.Message;

                if (ex.InnerException != null)
                {
                    errorMessage +=
                        $" | Inner Exception: {ex.InnerException.Message}";
                }

                throw new Exception(
                    $"Database Error while creating recipe: {errorMessage}",
                    ex);
            }


            if (recipeForCreation.ImagePaths != null &&
                recipeForCreation.ImagePaths.Any())
            {
                var images = recipeForCreation.ImagePaths
                    .Where(x => !string.IsNullOrWhiteSpace(x))
                    .Select(x => new RecipeImage
                    {
                        RecipeId = recipe.Id,
                        ImagePath = x
                    })
                    .ToList();

                if (images.Any())
                {
                    await _context.RecipeImages
                        .AddRangeAsync(images);

                    try
                    {
                        await _context.SaveChangesAsync();
                    }
                    catch (DbUpdateException ex)
                    {
                        var errorMessage = ex.Message;

                        if (ex.InnerException != null)
                        {
                            errorMessage +=
                                $" | Inner Exception: {ex.InnerException.Message}";
                        }

                        throw new Exception(
                            $"Database Error while saving recipe images: {errorMessage}",
                            ex);
                    }
                }
            }

            return true;
        }


        private bool CanViewRecipe(
            RecipeActionType actionType,
            string? roleName)
        {
            if (string.IsNullOrEmpty(roleName))
                return false;

            if (string.Equals(
                roleName,
                "Admin",
                StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }

            if (actionType == RecipeActionType.User &&
                string.Equals(
                    roleName,
                    "User",
                    StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }

            if (actionType == RecipeActionType.Member &&
                string.Equals(
                    roleName,
                    "Member",
                    StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }

            if (actionType == RecipeActionType.Both &&
                (string.Equals(
                    roleName,
                    "User",
                    StringComparison.OrdinalIgnoreCase) ||
                 string.Equals(
                    roleName,
                    "Member",
                    StringComparison.OrdinalIgnoreCase)))
            {
                return true;
            }

            return false;
        }


        public async Task<bool> DeleteRecipe(int id)
        {
            var recipe = await _context.Recipes
                .Include(x => x.RecipeImages)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (recipe == null)
                throw new Exception("Recipe not found.");

            var userId = GetCurrentUserId();

            if (!userId.HasValue)
                throw new UnauthorizedAccessException(
                    "User ID not found in token.");

            var roleName = GetCurrentUserRole();

            if (recipe.CreatedById != userId.Value &&
                !string.Equals(
                    roleName,
                    "Admin",
                    StringComparison.OrdinalIgnoreCase))
            {
                throw new UnauthorizedAccessException(
                    "You are not allowed to delete this recipe.");
            }

            var usedInContest = await _context.ContestSubmissions
                .AnyAsync(x => x.RecipeId == id);

            if (usedInContest)
            {
                throw new Exception(
                    "This recipe cannot be deleted because it is used in a contest submission.");
            }

            if (recipe.RecipeImages != null &&
                recipe.RecipeImages.Any())
            {
                _context.RecipeImages
                    .RemoveRange(recipe.RecipeImages);
            }

            _context.Recipes.Remove(recipe);

            return await _context.SaveChangesAsync() > 0;
        }


        public async Task<List<RecipeForListning>> GetAllRecipe()
        {
            var role = GetCurrentUserRole();

            var query = _context.Recipes
                .Include(x => x.Category)
                .Include(x => x.RecipeImages)
                .AsQueryable();

            if (string.Equals(
                role,
                "User",
                StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(x =>
                    x.ActionType == RecipeActionType.User ||
                    x.ActionType == RecipeActionType.Both);
            }
            else if (string.Equals(
                role,
                "Member",
                StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(x =>
                    x.ActionType == RecipeActionType.Member ||
                    x.ActionType == RecipeActionType.Both);
            }
            else if (string.Equals(
                role,
                "Admin",
                StringComparison.OrdinalIgnoreCase))
            {
                // Admin can see all recipes
            }
            else
            {
                query = query.Where(x => false);
            }

            var recipes = await query.ToListAsync();

            return _mapper.Map<List<RecipeForListning>>(recipes);
        }


        public async Task<RecipeDto> GetRecipeById(int id)
        {
            var roleName = GetCurrentUserRole();

            if (string.IsNullOrEmpty(roleName))
                throw new UnauthorizedAccessException(
                    "User role not found in token.");

            var recipe = await _context.Recipes
                .Include(x => x.Category)
                .Include(x => x.RecipeImages)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (recipe == null)
                throw new Exception("Recipe not found.");

            if (!CanViewRecipe(recipe.ActionType, roleName))
            {
                throw new UnauthorizedAccessException(
                    "You are not allowed to view this recipe.");
            }

            return _mapper.Map<RecipeDto>(recipe);
        }

        public async Task<bool> UpdateRecipe(
            int id,
            RecipeForUpdation recipeForUpdation)
        {
            if (recipeForUpdation == null)
                throw new ArgumentNullException(
                    nameof(recipeForUpdation));

            var recipe = await _context.Recipes
                .Include(x => x.RecipeImages)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (recipe == null)
                throw new Exception("Recipe not found.");

            var categoryExists = await _context.Categories
                .AnyAsync(x => x.Id == recipeForUpdation.CategoryId);

            if (!categoryExists)
                throw new Exception(
                    $"Category with ID {recipeForUpdation.CategoryId} not found.");

            var userId = GetCurrentUserId();

            if (!userId.HasValue)
                throw new UnauthorizedAccessException(
                    "User ID not found in token.");

            var roleName = GetCurrentUserRole();

            if (recipe.CreatedById != userId.Value &&
                !string.Equals(
                    roleName,
                    "Admin",
                    StringComparison.OrdinalIgnoreCase))
            {
                throw new UnauthorizedAccessException(
                    "You are not allowed to update this recipe.");
            }

            recipe.Title = recipeForUpdation.Title;
            recipe.Description = recipeForUpdation.Description;
            recipe.Procedure = recipeForUpdation.Procedure;
            recipe.ActionType = recipeForUpdation.ActionType;
            recipe.CategoryId = recipeForUpdation.CategoryId;

            if (recipe.RecipeImages != null &&
                recipe.RecipeImages.Any())
            {
                _context.RecipeImages
                    .RemoveRange(recipe.RecipeImages);
            }


            if (recipeForUpdation.ImagePaths != null &&
                recipeForUpdation.ImagePaths.Any())
            {
                var newImages = recipeForUpdation.ImagePaths
                    .Where(x => !string.IsNullOrWhiteSpace(x))
                    .Select(x => new RecipeImage
                    {
                        RecipeId = recipe.Id,
                        ImagePath = x
                    })
                    .ToList();

                if (newImages.Any())
                {
                    await _context.RecipeImages
                        .AddRangeAsync(newImages);
                }
            }

            try
            {
                return await _context.SaveChangesAsync() > 0;
            }
            catch (DbUpdateException ex)
            {
                var errorMessage = ex.Message;

                if (ex.InnerException != null)
                {
                    errorMessage +=
                        $" | Inner Exception: {ex.InnerException.Message}";
                }

                throw new Exception(
                    $"Database Error while updating recipe: {errorMessage}",
                    ex);
            }
        }
    }
}