using Application.DTOs.Contest;
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
    public class ContestRepository : IContestRepository
    {
        private readonly ApplicationDbContext _contest;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ContestRepository(ApplicationDbContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _contest = context;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<bool> AddContest(ContestForCreation contestForCreation)
        {
            if (contestForCreation.DurationDays <= 0)
            {
                throw new Exception("Duration days must be greater than 0.");
            }

            var userIdValue = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdValue))
            {
                userIdValue = _httpContextAccessor.HttpContext?.User?.FindFirst("UserId")?.Value;
            }

            int userId = 0;

            if (string.IsNullOrEmpty(userIdValue) || !int.TryParse(userIdValue, out userId))
            {
                var firstUser = await _contest.Users.FirstOrDefaultAsync();
                if (firstUser != null)
                {
                    userId = firstUser.Id;
                }
                else
                {
                    throw new Exception("Database mein koi bhi User maujood nahi hai. Pehle ek user register karein.");
                }
            }

            var userExists = await _contest.Users.AnyAsync(x => x.Id == userId);
            if (!userExists)
            {
                var firstUser = await _contest.Users.FirstOrDefaultAsync();
                if (firstUser != null) userId = firstUser.Id;
            }

            var contest = _mapper.Map<Contest>(contestForCreation);

            contest.UserId = userId;
            contest.StartDate = DateTime.Now;
            contest.EndDate = contest.StartDate.AddDays(contestForCreation.DurationDays);
            contest.IsActive = true;

            try
            {
                await _contest.Contests.AddAsync(contest);
                return await _contest.SaveChangesAsync() > 0;
            }
            catch (Exception)
            {
                _contest.Entry(contest).State = EntityState.Detached;

                var sql = @"INSERT INTO Contests (Title, Description, StartDate, EndDate, IsActive, UserId) 
                            VALUES ({0}, {1}, {2}, {3}, {4}, {5})";

                var rowsAffected = await _contest.Database.ExecuteSqlRawAsync(sql,
                    contestForCreation.Title.Trim(),
                    contestForCreation.Description.Trim(),
                    contest.StartDate,
                    contest.EndDate,
                    contest.IsActive,
                    contest.UserId);

                return rowsAffected > 0;
            }
        }

        public async Task<bool> DeletContest(int id)
        {
            var contest = await _contest.Contests.FirstOrDefaultAsync(x => x.Id == id);
            if (contest == null)
            {
                throw new Exception("Contest not found.");
            }

            _contest.Contests.Remove(contest);
            return await _contest.SaveChangesAsync() > 0;
        }

        public async Task<List<ContestForListning>> GetAllContest()
        {
            var contests = await _contest.Contests.ToListAsync();

            foreach (var contest in contests)
            {
                contest.IsActive = DateTime.Now < contest.EndDate;
            }

            try { await _contest.SaveChangesAsync(); } catch { }
            return _mapper.Map<List<ContestForListning>>(contests);
        }

        public async Task<ContestDto> GetContestById(int id)
        {
            var contest = await _contest.Contests.FirstOrDefaultAsync(x => x.Id == id);
            if (contest == null)
            {
                return null;
            }

            contest.IsActive = DateTime.Now < contest.EndDate;
            try { await _contest.SaveChangesAsync(); } catch { }

            return _mapper.Map<ContestDto>(contest);
        }

        public async Task<bool> UpdateContest(ContestForUpdation contestForUpdation)
        {
            if (contestForUpdation.DurationDays <= 0)
            {
                throw new Exception("Duration days must be greater than 0.");
            }

            var contest = await _contest.Contests.FirstOrDefaultAsync(x => x.Id == contestForUpdation.Id);
            if (contest == null)
            {
                throw new Exception("Contest not found.");
            }

            contest.Title = contestForUpdation.Title.Trim();
            contest.Description = contestForUpdation.Description.Trim();
            contest.EndDate = contest.StartDate.AddDays(contestForUpdation.DurationDays);
            contest.IsActive = contest.StartDate <= DateTime.Now && contest.EndDate > DateTime.Now;

            try
            {
                return await _contest.SaveChangesAsync() > 0;
            }
            catch (Exception)
            {
                _contest.Entry(contest).State = EntityState.Detached;

                var sql = @"UPDATE Contests 
                            SET Title = {0}, Description = {1}, EndDate = {2}, IsActive = {3} 
                            WHERE Id = {4}";

                var rowsAffected = await _contest.Database.ExecuteSqlRawAsync(sql,
                    contest.Title,
                    contest.Description,
                    contest.EndDate,
                    contest.IsActive,
                    contestForUpdation.Id);

                return rowsAffected > 0;
            }
        }
    }
}
