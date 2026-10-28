using Application.DTOs.Announcement;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface.RepositoryInterface
{
    public interface IAnnouncementRepository
    {
        Task<List<AnnouncementForListning>> GetAllAnnouncement();
        Task<AnnouncementDto> GetAnnouncementById(int id);
        Task<bool> AddAnnouncenet(AnnouncementForCreation announcementForCreation);
        Task<bool> UpdateAnnouncement(AnnouncementForUpdation announcementForUpdation);
        Task<bool> DeleteAnnouncement(int id);
    }
}
