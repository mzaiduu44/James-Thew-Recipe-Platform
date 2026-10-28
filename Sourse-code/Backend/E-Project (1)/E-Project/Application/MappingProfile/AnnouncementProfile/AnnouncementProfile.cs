using Application.DTOs.Announcement;
using AutoMapper;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.MappingProfile.AnnouncementProfile
{
    public class AnnouncementProfile:Profile
    {
        public AnnouncementProfile()
        {
            CreateMap<AnnouncementForCreation, Announcement>();

            CreateMap<AnnouncementForUpdation, Announcement>();

            CreateMap<Announcement, AnnouncementForListning>();

            CreateMap<Announcement, AnnouncementDto>();
        }
    }
}
