using Application.DTOs.Tips;
using Application.Interface.RepositoryInterface;
using AutoMapper;
using Domain.DatabaseConfiq;
using Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Infrastructure.Repository
{
    public class TipRepository : ITipRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public TipRepository(
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

   
        public async Task<(bool Success, string Message)> AddTip(
            TipForCreation tipForCreation)
        {
            if (tipForCreation == null)
            {
                return (false, "Tip data is required.");
            }

            if (string.IsNullOrWhiteSpace(tipForCreation.Title))
            {
                return (false, "Tip title is required.");
            }

    
            if (string.IsNullOrWhiteSpace(
                tipForCreation.Description))
            {
                return (false, "Tip description is required.");
            }

        
            var role = GetCurrentUserRole();

            if (!string.Equals(
                role,
                "Admin",
                StringComparison.OrdinalIgnoreCase))
            {
                return (false, "Only Admin can add tips.");
            }

   
            var userId = GetCurrentUserId();

            if (!userId.HasValue)
            {
                return (false, "User ID not found in token.");
            }

         
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Id == userId.Value);

            if (user == null)
            {
                return (false, "User not found.");
            }

      
            var title = tipForCreation.Title.Trim();
            var description = tipForCreation.Description.Trim();

       
            var exists = await _context.Tips
                .AnyAsync(x =>
                    x.Title.ToLower() == title.ToLower());

            if (exists)
            {
                return (
                    false,
                    "A tip with this title already exists."
                );
            }

            var tip = _mapper.Map<Tip>(tipForCreation);

            if (tip == null)
            {
                return (false, "Unable to create tip.");
            }


            tip.Title = title;
            tip.Description = description;
            tip.CreatedById = userId.Value;
            tip.CreatedAt = DateTime.UtcNow;

        
            tip.IsFree = tipForCreation.IsFree;

            await _context.Tips.AddAsync(tip);

            var saved = await _context.SaveChangesAsync();

            if (saved > 0)
            {
                return (true, "Tip added successfully.");
            }

            return (false, "Tip could not be added.");
        }

        public async Task<(bool Success, string Message)> DeletTip(
            int id)
        {
            var role = GetCurrentUserRole();

            if (!string.Equals(
                role,
                "Admin",
                StringComparison.OrdinalIgnoreCase))
            {
                return (
                    false,
                    "Only Admin can delete tips."
                );
            }

            var tip = await _context.Tips
                .FirstOrDefaultAsync(x => x.Id == id);

            if (tip == null)
            {
                return (false, "Tip not found.");
            }

            _context.Tips.Remove(tip);

            var saved = await _context.SaveChangesAsync();

            if (saved > 0)
            {
                return (
                    true,
                    "Tip deleted successfully."
                );
            }

            return (
                false,
                "Tip could not be deleted."
            );
        }

        public async Task<List<TipForListning>> GetAllTip()
        {
            var role = GetCurrentUserRole();

            if (string.IsNullOrEmpty(role))
            {
                throw new UnauthorizedAccessException(
                    "User role not found in token.");
            }

            var query = _context.Tips
                .Include(x => x.User)
                .AsNoTracking()
                .AsQueryable();

            // User
            if (string.Equals(
                role,
                "User",
                StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(x =>
                    x.ActionType == RecipeActionType.User ||
                    x.ActionType == RecipeActionType.Both);
            }

            // Member
            else if (string.Equals(
                role,
                "Member",
                StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(x =>
                    x.ActionType == RecipeActionType.Member ||
                    x.ActionType == RecipeActionType.Both);
            }

            // Admin
            else if (string.Equals(
                role,
                "Admin",
                StringComparison.OrdinalIgnoreCase))
            {
                // Admin can see all tips
            }

            else
            {
                throw new UnauthorizedAccessException(
                    "Invalid user role.");
            }

            var tips = await query.ToListAsync();

            return _mapper.Map<List<TipForListning>>(tips);
        }


        public async Task<TipDto> GetTipById(int id)
        {
            var role = GetCurrentUserRole();

            if (string.IsNullOrEmpty(role))
            {
                throw new UnauthorizedAccessException(
                    "User role not found in token.");
            }

            var tip = await _context.Tips
                .Include(x => x.User)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);

            if (tip == null)
            {
                throw new Exception("Tip not found.");
            }

            if (string.Equals(
                role,
                "User",
                StringComparison.OrdinalIgnoreCase))
            {
                if (tip.ActionType != RecipeActionType.User &&
                    tip.ActionType != RecipeActionType.Both)
                {
                    throw new UnauthorizedAccessException(
                        "You are not allowed to view this tip.");
                }
            }

            else if (string.Equals(
                role,
                "Member",
                StringComparison.OrdinalIgnoreCase))
            {
                if (tip.ActionType != RecipeActionType.Member &&
                    tip.ActionType != RecipeActionType.Both)
                {
                    throw new UnauthorizedAccessException(
                        "You are not allowed to view this tip.");
                }
            }

  
            else if (!string.Equals(
                role,
                "Admin",
                StringComparison.OrdinalIgnoreCase))
            {
                throw new UnauthorizedAccessException(
                    "Invalid user role.");
            }

            return _mapper.Map<TipDto>(tip);
        }

        public async Task<(bool Success, string Message)> UpdateTip(
            TipForUpdation tipForUpdation)
        {
            if (tipForUpdation == null)
            {
                return (false, "Tip data is required.");
            }

            var role = GetCurrentUserRole();

            if (!string.Equals(
                role,
                "Admin",
                StringComparison.OrdinalIgnoreCase))
            {
                return (
                    false,
                    "Only Admin can update tips."
                );
            }

            var tip = await _context.Tips
                .FirstOrDefaultAsync(
                    x => x.Id == tipForUpdation.Id);

            if (tip == null)
            {
                return (false, "Tip not found.");
            }


            if (string.IsNullOrWhiteSpace(
                tipForUpdation.Title))
            {
                return (false, "Tip title is required.");
            }


            if (string.IsNullOrWhiteSpace(
                tipForUpdation.Description))
            {
                return (false, "Tip description is required.");
            }

            var title = tipForUpdation.Title.Trim();

            var description =
                tipForUpdation.Description.Trim();


            var duplicate = await _context.Tips
                .AnyAsync(x =>
                    x.Id != tipForUpdation.Id &&
                    x.Title.ToLower() == title.ToLower());

            if (duplicate)
            {
                return (
                    false,
                    "A tip with this title already exists."
                );
            }

    
            tip.Title = title;
            tip.Description = description;
            tip.ActionType = tipForUpdation.ActionType;
            tip.ProfileImage = tipForUpdation.ProfileImage;

            tip.IsFree = tipForUpdation.IsFree;

            var saved = await _context.SaveChangesAsync();

            if (saved > 0)
            {
                return (
                    true,
                    "Tip updated successfully."
                );
            }

            return (
                false,
                "Tip could not be updated."
            );
        }
    }
}