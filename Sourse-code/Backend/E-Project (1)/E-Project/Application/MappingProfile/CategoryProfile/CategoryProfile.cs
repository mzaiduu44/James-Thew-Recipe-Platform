using Application.DTOs.Category;
using AutoMapper;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.MappingProfile.CategoryProfile
{
    public class CategoryProfile:Profile
    {
        public CategoryProfile()
        {
            CreateMap<CategoryForCreation, Category>();

            CreateMap<CategoryForUpdation, Category>();

            CreateMap<Category, CategoryForListning>();

            CreateMap<Category, CategoryDto>();
        }
    }
}
