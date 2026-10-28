using Application.DTOs.Recipe;
using AutoMapper;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.MappingProfile.RecipeProfile
{
    public class RecipeProfile:Profile
    {
        public RecipeProfile()
        {
            CreateMap<RecipeForCreation, Recipe>()
                .ForMember(dest => dest.RecipeImages, opt => opt.Ignore());


            CreateMap<RecipeForUpdation, Recipe>()
                .ForMember(dest => dest.RecipeImages, opt => opt.Ignore());

            CreateMap<Recipe, RecipeForListning>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.CategoryName))
                .ForMember(dest => dest.ImagePaths,opt => opt.MapFrom(src => src.RecipeImages.Select(x => x.ImagePath).ToList()));

            CreateMap<Recipe, RecipeDto>()
                .ForMember(dest => dest.CategoryName,opt => opt.MapFrom(src => src.Category.CategoryName))
                .ForMember(dest => dest.ImagePaths,opt => opt.MapFrom(src => src.RecipeImages.Select(x => x.ImagePath).ToList()));

        }
    }
}
