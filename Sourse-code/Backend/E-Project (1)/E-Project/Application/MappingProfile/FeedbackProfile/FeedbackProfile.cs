using Application.DTOs.Feedback;
using AutoMapper;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.MappingProfile.FeedbackProfile
{
    public class FeedbackProfile:Profile
    {
        public FeedbackProfile()
        {
            CreateMap<FeedbackForCreation, Feedback>();
                

            CreateMap<FeedbackForUpdation, Feedback>();

            CreateMap<Feedback, FeedbackForListning>()
                .ForMember(src => src.UserName, opt => opt.MapFrom(x => x.User.Name));


            CreateMap<Feedback, FeedbackDto>()
                .ForMember(src => src.UserName, opt => opt.MapFrom(x => x.User.Name));

        }
    }
}
