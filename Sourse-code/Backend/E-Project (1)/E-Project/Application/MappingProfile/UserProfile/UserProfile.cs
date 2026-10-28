using Application.DTOs.Role;
using Application.DTOs.User;
using AutoMapper;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.MappingProfile.UserProfile
{
    public class UserProfile:Profile
    {
        public UserProfile()
        {
            CreateMap<UserForCreation, User>();

            CreateMap<UserForUpdation, User>();

            CreateMap<User, UserForListning>()
                .ForMember(src => src.RoleName,opt => opt.MapFrom(x => x.Role.RoleName));

            CreateMap<User, UserDto>()
                .ForMember(src => src.RoleName, opt => opt.MapFrom(x => x.Role.RoleName));

        }
    }
}
