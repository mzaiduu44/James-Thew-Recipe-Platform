using Application.DTOs.Announcement;
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
    public class AnnouncementRepository : IAnnouncementRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AnnouncementRepository(ApplicationDbContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<bool> AddAnnouncenet(AnnouncementForCreation announcementForCreation)
        {
            if (announcementForCreation.ContestId.HasValue && announcementForCreation.ContestId.Value > 0)
            {
                var contestExists = await _context.Contests
                    .AnyAsync(x => x.Id == announcementForCreation.ContestId.Value);

                if (!contestExists)
                {
                    var firstContest = await _context.Contests.FirstOrDefaultAsync();
                    if (firstContest != null)
                    {
                        announcementForCreation.ContestId = firstContest.Id;
                    }
                    else
                    {
                        announcementForCreation.ContestId = null;
                    }
                }
            }
            else
            {
                var firstContest = await _context.Contests.FirstOrDefaultAsync();
                if (firstContest != null)
                {
                    announcementForCreation.ContestId = firstContest.Id;
                }
            }

            if (announcementForCreation.WinnerSubmissionId.HasValue && announcementForCreation.WinnerSubmissionId.Value > 0)
            {
                var winnerSubmission = await _context.ContestSubmissions.FirstOrDefaultAsync(x =>
                    x.Id == announcementForCreation.WinnerSubmissionId.Value);

                if (winnerSubmission != null)
                {
                    if (!announcementForCreation.ContestId.HasValue)
                    {
                        announcementForCreation.ContestId = winnerSubmission.ContestId;
                    }

                    if (winnerSubmission.ContestId == announcementForCreation.ContestId.Value)
                    {
                        var submissions = await _context.ContestSubmissions
                            .Where(x => x.ContestId == announcementForCreation.ContestId.Value).ToListAsync();

                        foreach (var submission in submissions)
                        {
                            submission.IsWinner = false;
                        }

                        winnerSubmission.IsWinner = true;
                    }
                }
                else
                {
                    announcementForCreation.WinnerSubmissionId = null;
                }
            }
            else
            {
                announcementForCreation.WinnerSubmissionId = null; 
            }

            var userIdValue = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdValue))
            {
                userIdValue = _httpContextAccessor.HttpContext?.User?.FindFirst("UserId")?.Value;
            }

            int userId = 0;

            if (string.IsNullOrEmpty(userIdValue) || !int.TryParse(userIdValue, out userId))
            {
                var firstUser = await _context.Users.FirstOrDefaultAsync();
                if (firstUser != null)
                {
                    userId = firstUser.Id;
                }
                else
                {
                    throw new Exception("Database mein koi bhi User maujood nahi hai. Pehle register karein.");
                }
            }

            var announcement = _mapper.Map<Announcement>(announcementForCreation);

            announcement.CreatedById = userId;
            announcement.CreatedAt = DateTime.Now;

            if (announcementForCreation.ContestId == 0) announcement.ContestId = null;
            if (announcementForCreation.WinnerSubmissionId == 0) announcement.WinnerSubmissionId = null;

            await _context.Announcements.AddAsync(announcement);

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAnnouncement(int id)
        {
            Announcement announcement = await _context.Announcements.FindAsync(id);
            if (announcement == null)
            {
                return false;
            }

            _context.Announcements.Remove(announcement);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<List<AnnouncementForListning>> GetAllAnnouncement()
        {
            var announ = await _context.Announcements.ToListAsync();
            return _mapper.Map<List<AnnouncementForListning>>(announ);
        }

        public async Task<AnnouncementDto> GetAnnouncementById(int id)
        {
            var announcement = await _context.Announcements.FirstOrDefaultAsync(x => x.Id == id);
            if (announcement == null)
            {
                return null;
            }
            return _mapper.Map<AnnouncementDto>(announcement);
        }

        public async Task<bool> UpdateAnnouncement(AnnouncementForUpdation announcementForUpdation)
        {
            var announcement = await _context.Announcements.FirstOrDefaultAsync(x => x.Id == announcementForUpdation.Id);

            if (announcement == null)
            {
                throw new Exception("Announcement not found.");
            }

            announcement.Title = announcementForUpdation.Title;
            announcement.Description = announcementForUpdation.Description;
            announcement.ContestId = announcementForUpdation.ContestId == 0 ? null : announcementForUpdation.ContestId;
            announcement.WinnerSubmissionId = announcementForUpdation.WinnerSubmissionId == 0 ? null : announcementForUpdation.WinnerSubmissionId;

            return await _context.SaveChangesAsync() > 0;
        }
    }
}
