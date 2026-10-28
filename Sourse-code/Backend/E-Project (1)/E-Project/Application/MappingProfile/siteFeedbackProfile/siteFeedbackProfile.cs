using Application.DTOs.SiteFeedback;
using AutoMapper;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.MappingProfile.siteFeedbackProfile
{
    public class siteFeedbackProfile:Profile
    {
        public siteFeedbackProfile()
        {
            CreateMap<sitefeedbackForCreation, SiteFeedback>();

            CreateMap<sitefeedbackForUpdation, SiteFeedback>();

            CreateMap<SiteFeedback, sitefeedbackForListning>()
                .ForMember(src => src.UserName, opt => opt.MapFrom(x => x.User.Name));

            CreateMap<SiteFeedback, sitefeedbackDto>()
                .ForMember(src => src.UserName, opt => opt.MapFrom(x => x.User.Name));
        }
    }
}
