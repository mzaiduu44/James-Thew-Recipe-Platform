using Application.DTOs.SiteFeedback;
using Application.Interface.RepositoryInterface;
using Domain.DatabaseConfiq;
using Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Infrastructure.Repository
{
    public class SiteFeedbackRepository : ISiteFeedbackRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SiteFeedbackRepository(
            ApplicationDbContext context,
            IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        private int? GetCurrentUserId()
        {
            var user = _httpContextAccessor.HttpContext?.User;

            if (user == null || user.Identity?.IsAuthenticated != true)
                return null;

            var userIdValue = user.FindFirst("UserId")?.Value;


            if (string.IsNullOrEmpty(userIdValue))
            {
                userIdValue =
                    user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            }

            if (string.IsNullOrEmpty(userIdValue))
                return null;

            if (!int.TryParse(userIdValue, out int userId))
                return null;

            return userId;
        }


        public async Task<(bool Success, string Message)> AddSiteFeedback(
            sitefeedbackForCreation sitefeedbackForCreation)
        {
            if (sitefeedbackForCreation == null)
            {
                return (false, "Feedback data is required.");
            }

            var userId = GetCurrentUserId();

            if (!userId.HasValue)
            {
                return (false, "User ID not found in JWT token.");
            }

            var userName = _httpContextAccessor.HttpContext?.User
                .FindFirst(ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(userName))
            {
                return (false, "User name not found in JWT token.");
            }


            var profileImage = _httpContextAccessor.HttpContext?.User
                .FindFirst("ProfileImage")?.Value;


            if (string.IsNullOrWhiteSpace(
                sitefeedbackForCreation.Comment))
            {
                return (false, "Comment is required.");
            }

            if (sitefeedbackForCreation.Rating < 1 ||
                sitefeedbackForCreation.Rating > 5)
            {
                return (false, "Rating must be between 1 and 5.");
            }

            var userExists = await _context.Users
                .AnyAsync(x => x.Id == userId.Value);

            if (!userExists)
            {
                return (false, "User not found.");
            }

            var feedback = new SiteFeedback
            {
                UserId = userId.Value,
                ProfileImage = profileImage,
                Comment = sitefeedbackForCreation.Comment.Trim(),
                Rating = sitefeedbackForCreation.Rating,
                CreatedAt = DateTime.UtcNow
            };

            await _context.SiteFeedbacks.AddAsync(feedback);

            var saved = await _context.SaveChangesAsync();

            if (saved > 0)
            {
                return (true, "Site feedback added successfully.");
            }

            return (false, "Site feedback could not be added.");
        }

        public async Task<(bool Success, string Message)> DeleteSiteFeedback(
            int id)
        {
            var userId = GetCurrentUserId();

            if (!userId.HasValue)
            {
                return (false, "User ID not found in JWT token.");
            }

            var feedback = await _context.SiteFeedbacks
                .FirstOrDefaultAsync(x => x.Id == id);

            if (feedback == null)
            {
                return (false, "Site feedback not found.");
            }

            var role = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.Role)?.Value;


            if (feedback.UserId != userId.Value && role != "Admin")
            {
                return (
                    false,
                    "You can only delete your own site feedback."
                );
            }

            _context.SiteFeedbacks.Remove(feedback);

            var saved = await _context.SaveChangesAsync();

            return saved > 0
                ? (true, "Site feedback deleted successfully.")
                : (false, "Site feedback could not be deleted.");
        }


        public async Task<List<sitefeedbackForListning>>
            GetAllSiteFeedback()
        {
            var feedbacks = await _context.SiteFeedbacks
                .Include(x => x.User)
                .AsNoTracking()
                .ToListAsync();

            return feedbacks.Select(x => new sitefeedbackForListning
            {
                Id = x.Id,
                UserId = x.UserId,
                UserName = x.User != null
                    ? x.User.Name
                    : "Unknown User",
                ProfileImage = x.ProfileImage,
                Comment = x.Comment,
                Rating = x.Rating,
                CreatedAt = x.CreatedAt
            }).ToList();
        }

  
        public async Task<sitefeedbackDto> GetSitefeedbackById(int id)
        {
            var feedback = await _context.SiteFeedbacks
                .Include(x => x.User)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);

            if (feedback == null)
            {
                throw new Exception("Site feedback not found.");
            }

            return new sitefeedbackDto
            {
                Id = feedback.Id,
                UserId = feedback.UserId,
                UserName = feedback.User != null
                    ? feedback.User.Name
                    : "Unknown User",
                ProfileImage = feedback.ProfileImage,
                Comment = feedback.Comment,
                Rating = feedback.Rating,
                CreatedAt = feedback.CreatedAt
            };
        }


        public async Task<(bool Success, string Message)>
            UpdateSiteFeedback(
                sitefeedbackForUpdation sitefeedbackForUpdation)
        {
            if (sitefeedbackForUpdation == null)
            {
                return (false, "Feedback data is required.");
            }

            var userId = GetCurrentUserId();

            if (!userId.HasValue)
            {
                return (false, "User ID not found in JWT token.");
            }

            if (string.IsNullOrWhiteSpace(
                sitefeedbackForUpdation.Comment))
            {
                return (false, "Comment is required.");
            }

            if (sitefeedbackForUpdation.Rating < 1 ||
                sitefeedbackForUpdation.Rating > 5)
            {
                return (false, "Rating must be between 1 and 5.");
            }

            var feedback = await _context.SiteFeedbacks
                .FirstOrDefaultAsync(
                    x => x.Id == sitefeedbackForUpdation.Id);

            if (feedback == null)
            {
                return (false, "Site feedback not found.");
            }

            var role = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.Role)?.Value;

            if (feedback.UserId != userId.Value && role != "Admin")
            {
                return (
                    false,
                    "You can only update your own site feedback."
                );
            }

            feedback.Comment =
                sitefeedbackForUpdation.Comment.Trim();

            feedback.Rating =
                sitefeedbackForUpdation.Rating;

            var saved = await _context.SaveChangesAsync();

            return saved > 0
                ? (true, "Site feedback updated successfully.")
                : (false, "Site feedback could not be updated.");
        }
    }
}