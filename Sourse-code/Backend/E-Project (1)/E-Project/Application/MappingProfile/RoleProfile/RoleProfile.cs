using Application.DTOs.Role;
using AutoMapper;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.MappingProfile.RoleProfile
{
    public class RoleProfile:Profile
    {
        public RoleProfile()
        {
            CreateMap<RoleForCreation, Role>();

            CreateMap<RoleForUpdation, Role>();

            CreateMap<Role, RoleForListning>();

            CreateMap<Role, RoleDto>();
        }

    }
}
