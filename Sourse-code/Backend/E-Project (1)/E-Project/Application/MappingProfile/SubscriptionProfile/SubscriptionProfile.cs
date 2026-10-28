using Application.DTOs.Subscription;
using AutoMapper;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.MappingProfile.SubscriptionProfile
{
    public class SubscriptionProfile : Profile
    {
        public SubscriptionProfile()
        {
            CreateMap<SubscriptionForCreation, Subscription>()
                .ForMember(src => src.StartDate, opt => opt.MapFrom(x => DateTime.Now));

            CreateMap<SubscriptionForUpdation, Subscription>()
            .ForMember(src => src.StartDate, opt => opt.MapFrom(x => DateTime.Now));

            CreateMap<Subscription, SubscriptionForListning>();

            CreateMap<Subscription, SubscriptionDto>();
        }
    }
}
