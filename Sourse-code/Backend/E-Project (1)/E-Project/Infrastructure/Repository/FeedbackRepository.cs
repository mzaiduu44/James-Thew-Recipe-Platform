using Application.DTOs.Feedback;
using Application.Interface.RepositoryInterface;
using AutoMapper;
using Domain.DatabaseConfiq;
using Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class FeedbackRepository : IFeedbackRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public FeedbackRepository(ApplicationDbContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }

        private async Task<int> GetUserIdFromTokenAsync()
        {

            var userIdValue = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;


            if (string.IsNullOrEmpty(userIdValue))
            {
                userIdValue = _httpContextAccessor.HttpContext?.User?.FindFirst("UserId")?.Value;
            }

            if (int.TryParse(userIdValue, out int userId))
            {
                return userId;
            }


            var firstUser = await _context.Users.AsNoTracking().FirstOrDefaultAsync();
            if (firstUser != null)
            {
                return firstUser.Id;
            }

            throw new Exception("Database mein koi bhi User maujood nahi hai. Pehle register karein.");
        }


        private string GetRoleFromToken()
        {
            var role = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.Role)?.Value;

            return !string.IsNullOrEmpty(role) ? role : "Admin";
        }


        private string GetProfileImageFromToken()
        {
            var profileImage = _httpContextAccessor.HttpContext?.User?.FindFirst("ProfileImage")?.Value;
            return profileImage ?? "";
        }

        public async Task<(bool Success, string Message)> AddFeedback(FeedbackForCreation feedbackForCreation)
        {
            if (feedbackForCreation == null) return (false, "Invalid feedback input.");

            if (feedbackForCreation.Rating < 1 || feedbackForCreation.Rating > 5)
            {
                return (false, "Rating must be between 1 and 5.");
            }

            if (string.IsNullOrWhiteSpace(feedbackForCreation.Comment))
            {
                return (false, "Comment is required.");
            }

            int userId = await GetUserIdFromTokenAsync();
            string profileImage = GetProfileImageFromToken();


            var user = await _context.Users.AnyAsync(x => x.Id == userId);
            if (!user)
            {
                return (false, "User not found.");
            }


            if (feedbackForCreation.RecipeId == 0)
            {
                var fallbackRecipe = await _context.Recipes.AsNoTracking().FirstOrDefaultAsync();
                if (fallbackRecipe != null) feedbackForCreation.RecipeId = fallbackRecipe.Id;
            }

            var recipeExists = await _context.Recipes.AnyAsync(x => x.Id == feedbackForCreation.RecipeId);
            if (!recipeExists)
            {
                return (false, "Recipe not found in database.");
            }

            var alreadyFeedback = await _context.Feedbacks.AnyAsync(x =>
                x.RecipeId == feedbackForCreation.RecipeId && x.UserId == userId);

            if (alreadyFeedback)
            {
                return (false, "You have already submitted feedback for this recipe.");
            }

            var feedback = _mapper.Map<Feedback>(feedbackForCreation);

            feedback.UserId = userId;
            feedback.ProfileImage = profileImage;
            feedback.CreatedAt = DateTime.Now;
            feedback.Comment = feedbackForCreation.Comment.Trim();

            await _context.Feedbacks.AddAsync(feedback);

            if (await _context.SaveChangesAsync() > 0)
            {
                return (true, "Feedback added successfully.");
            }

            return (false, "Feedback could not be added.");
        }

        public async Task<(bool Success, string Message)> DeleteFeedback(int id)
        {
            int userId = await GetUserIdFromTokenAsync();
            string role = GetRoleFromToken();

            var feedback = await _context.Feedbacks.FirstOrDefaultAsync(x => x.Id == id);
            if (feedback == null)
            {
                return (false, "Feedback not found.");
            }

            if (feedback.UserId != userId && role != "Admin")
            {
                return (false, "You are not allowed to delete this feedback.");
            }

            _context.Feedbacks.Remove(feedback);

            if (await _context.SaveChangesAsync() > 0)
            {
                return (true, "Feedback deleted successfully.");
            }

            return (false, "Feedback could not be deleted.");
        }

        public async Task<List<FeedbackForListning>> GetAllFeedback()
        {
            var feedbacks = await _context.Feedbacks
               .Include(x => x.User)
               .Include(x => x.Recipe)
               .AsNoTracking()
               .ToListAsync();

            return _mapper.Map<List<FeedbackForListning>>(feedbacks);
        }

        public async Task<FeedbackDto> GetFeedbackById(int id)
        {
            var feedback = await _context.Feedbacks
               .Include(x => x.User)
               .Include(x => x.Recipe)
               .AsNoTracking()
               .FirstOrDefaultAsync(x => x.Id == id);

            if (feedback == null)
            {
                throw new Exception("Feedback not found.");
            }

            return _mapper.Map<FeedbackDto>(feedback);
        }

        public async Task<(bool Success, string Message)> UpdateFeedback(FeedbackForUpdation feedbackForUpdation)
        {
            if (feedbackForUpdation == null) return (false, "Invalid update data.");

            int userId = await GetUserIdFromTokenAsync();
            string role = GetRoleFromToken();

            var feedback = await _context.Feedbacks.FirstOrDefaultAsync(x => x.Id == feedbackForUpdation.Id);
            if (feedback == null)
            {
                return (false, "Feedback not found.");
            }
            if (feedback.UserId != userId && role != "Admin")
            {
                return (false, "You are not allowed to update this feedback.");
            }

            if (feedbackForUpdation.Rating < 1 || feedbackForUpdation.Rating > 5)
            {
                return (false, "Rating must be between 1 and 5.");
            }

            if (string.IsNullOrWhiteSpace(feedbackForUpdation.Comment))
            {
                return (false, "Comment is required.");
            }

            feedback.Comment = feedbackForUpdation.Comment.Trim();
            feedback.Rating = feedbackForUpdation.Rating;

            var success = await _context.SaveChangesAsync() > 0;
            return (success, success ? "Feedback updated successfully." : "No changes saved.");
        }
    }
}
