using Application.DTOs.Announcement;
using Application.Interface.RepositoryInterface;
using Application.Interface.ServiceInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Service
{
    public class AnnouncementService : IAnnouncementService
    {
        private readonly IAnnouncementRepository _announcementRepository;

        public AnnouncementService(IAnnouncementRepository announcementRepository)
        {
            _announcementRepository = announcementRepository;
        }



        public Task<bool> AddAnnouncenet(AnnouncementForCreation announcementForCreation)
        {
            return _announcementRepository.AddAnnouncenet(announcementForCreation);
        }

        public Task<bool> DeleteAnnouncement(int id)
        {
            return _announcementRepository.DeleteAnnouncement(id);
        }

        public Task<List<AnnouncementForListning>> GetAllAnnouncement()
        {
            return _announcementRepository.GetAllAnnouncement();
        }

        public Task<AnnouncementDto> GetAnnouncementById(int id)
        {
            return _announcementRepository.GetAnnouncementById(id);
        }

        public Task<bool> UpdateAnnouncement(AnnouncementForUpdation announcementForUpdation)
        {
            return _announcementRepository.UpdateAnnouncement(announcementForUpdation);
        }
    }
}
