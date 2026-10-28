using Application.DTOs.Tips;
using AutoMapper;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.MappingProfile.TipProfile
{
    public class TipProfile:Profile
    {
        public TipProfile()
        {
            CreateMap<TipForCreation, Tip>();

            CreateMap<TipForUpdation, Tip>();

            CreateMap<Tip, TipForListning>()
                .ForMember(src => src.CreatedByName, opt => opt.MapFrom(x => x.User.Name));

            CreateMap<Tip, TipDto>()
                .ForMember(src => src.CreatedByName, opt => opt.MapFrom(x => x.User.Name));

        }
    }
}
