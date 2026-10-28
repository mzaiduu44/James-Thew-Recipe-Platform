using Application.DTOs.ContestSubmission;
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
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class ContestSubmissionRepository : IContestSubmissionRepository
    {
        private readonly ApplicationDbContext _contest;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ContestSubmissionRepository(
            ApplicationDbContext contest,
            IMapper mapper,
            IHttpContextAccessor httpContextAccessor)
        {
            _contest = contest;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<bool> AddContestSubmission(
            ContestSubmissionForCreation contestSubmissionForCreation)
        {
            if (contestSubmissionForCreation.RecipeId.HasValue &&
                contestSubmissionForCreation.RecipeId.Value == 0)
            {
                contestSubmissionForCreation.RecipeId = null;
            }

            if (contestSubmissionForCreation.TipId.HasValue &&
                contestSubmissionForCreation.TipId.Value == 0)
            {
                contestSubmissionForCreation.TipId = null;
            }

            if (!contestSubmissionForCreation.RecipeId.HasValue &&
                !contestSubmissionForCreation.TipId.HasValue)
            {
                throw new Exception("You must submit either a Recipe or a Tip.");
            }

            if (contestSubmissionForCreation.RecipeId.HasValue &&
                contestSubmissionForCreation.TipId.HasValue)
            {
                throw new Exception(
                    "You can submit either a Recipe or a Tip, not both."
                );
            }

            if (contestSubmissionForCreation.ContestId == 0)
            {
                var fallbackContest = await _contest.Contests
                    .OrderBy(x => x.Id)
                    .FirstOrDefaultAsync();

                if (fallbackContest == null)
                {
                    throw new Exception("No contest found in the database.");
                }

                contestSubmissionForCreation.ContestId = fallbackContest.Id;
            }

            var contest = await _contest.Contests
                .FirstOrDefaultAsync(
                    x => x.Id == contestSubmissionForCreation.ContestId
                );

            if (contest == null)
            {
                throw new Exception("Contest not found.");
            }

            if (DateTime.Now >= contest.EndDate)
            {
                contest.IsActive = false;
                await _contest.SaveChangesAsync();
            }

            var userIdValue = _httpContextAccessor.HttpContext?
                .User?
                .FindFirst(ClaimTypes.NameIdentifier)?
                .Value;

            if (string.IsNullOrEmpty(userIdValue))
            {
                userIdValue = _httpContextAccessor.HttpContext?
                    .User?
                    .FindFirst("UserId")?
                    .Value;
            }

            int userId = 0;

            if (string.IsNullOrEmpty(userIdValue) ||
                !int.TryParse(userIdValue, out userId))
            {
                var firstUser = await _contest.Users
                    .OrderBy(x => x.Id)
                    .FirstOrDefaultAsync();

                if (firstUser == null)
                {
                    throw new Exception(
                        "No user exists in the database. Please register first."
                    );
                }

                userId = firstUser.Id;
            }

            var userExists = await _contest.Users
                .AnyAsync(x => x.Id == userId);

            if (!userExists)
            {
                throw new Exception($"User with Id {userId} was not found.");
            }

            if (contestSubmissionForCreation.RecipeId.HasValue)
            {
                var recipeExists = await _contest.Recipes
                    .AnyAsync(
                        x => x.Id ==
                        contestSubmissionForCreation.RecipeId.Value
                    );

                if (!recipeExists)
                {
                    throw new Exception(
                        $"Recipe with Id {contestSubmissionForCreation.RecipeId.Value} was not found."
                    );
                }
            }

            if (contestSubmissionForCreation.TipId.HasValue)
            {
                var tipExists = await _contest.Tips
                    .AnyAsync(
                        x => x.Id ==
                        contestSubmissionForCreation.TipId.Value
                    );

                if (!tipExists)
                {
                    throw new Exception(
                        $"Tip with Id {contestSubmissionForCreation.TipId.Value} was not found."
                    );
                }
            }

            var alreadySubmitted = await _contest.ContestSubmissions
                .AnyAsync(x =>
                    x.ContestId ==
                        contestSubmissionForCreation.ContestId &&
                    x.UserId == userId);

            if (alreadySubmitted)
            {
                throw new Exception(
                    "You have already submitted to this contest."
                );
            }


            var submission = _mapper.Map<ContestSubmission>(
                contestSubmissionForCreation
            );

            submission.UserId = userId;
            submission.ContestId = contestSubmissionForCreation.ContestId;
            submission.IsWinner = false;
            submission.SubmittedAt = DateTime.Now;

            submission.RecipeId = contestSubmissionForCreation.RecipeId;
            submission.TipId = contestSubmissionForCreation.TipId;

            try
            {
                await _contest.ContestSubmissions.AddAsync(submission);

                return await _contest.SaveChangesAsync() > 0;
            }
            catch (DbUpdateException ex)
            {
                var innerMessage =
                    ex.InnerException?.InnerException?.Message ??
                    ex.InnerException?.Message ??
                    ex.Message;

                throw new Exception(
                    $"Database error while saving contest submission: {innerMessage}"
                );
            }
        }

        public async Task<bool> DeleteContestSubmission(int id)
        {
            var contestSubmission = await _contest.ContestSubmissions
                .FindAsync(id);

            if (contestSubmission == null)
            {
                throw new Exception("Contest submission not found.");
            }

            _contest.ContestSubmissions.Remove(contestSubmission);

            return await _contest.SaveChangesAsync() > 0;
        }

        public async Task<List<ContestSubmissionForListning>>
            GetAllContestSubmission()
        {
            var submissions = await _contest.ContestSubmissions
                .AsNoTracking()
                .ToListAsync();

            return _mapper.Map<List<ContestSubmissionForListning>>(
                submissions
            );
        }

        public async Task<ContestSubmissionDto>
            GetContestSubmissionById(int id)
        {
            var contestSubmission = await _contest.ContestSubmissions
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);

            if (contestSubmission == null)
            {
                return null;
            }

            return _mapper.Map<ContestSubmissionDto>(
                contestSubmission
            );
        }

        public async Task<bool> SetWinner(int submissionId)
        {
            var submission = await _contest.ContestSubmissions
                .FirstOrDefaultAsync(x => x.Id == submissionId);

            if (submission == null)
            {
                throw new Exception("Contest submission not found.");
            }

            var submissions = await _contest.ContestSubmissions
                .Where(x => x.ContestId == submission.ContestId)
                .ToListAsync();

            foreach (var item in submissions)
            {
                item.IsWinner = false;
            }

            submission.IsWinner = true;

            return await _contest.SaveChangesAsync() > 0;
        }
    }
}