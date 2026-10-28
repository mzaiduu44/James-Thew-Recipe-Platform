using Application.DTOs.Contest;
using AutoMapper;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.MappingProfile.ContestProfile
{
    public class ContestProfile:Profile
    {
        public ContestProfile()
        {
            CreateMap<ContestForCreation, Contest>()
                .ForMember(src => src.StartDate, opt => opt.MapFrom(x => DateTime.Now));

            CreateMap<ContestForUpdation, Contest>();

            CreateMap<Contest, ContestForListning>();

            CreateMap<Contest, ContestDto>();

        }
    }
}
