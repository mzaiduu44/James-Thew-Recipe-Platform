using Application.DTOs.RecipeIngredient;
using AutoMapper;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.MappingProfile.RecipeIngredientProfile
{
    public class RecipeIngredientProfile:Profile
    {
        public RecipeIngredientProfile()
        {
            CreateMap<RecIngredientForCreation, RecipeIngredient>();

            CreateMap<RecipeIngredientItemForCreation, RecipeIngredient>();

            CreateMap<RecIngredientForUpdation, RecipeIngredient>();

            CreateMap<RecipeIngredient, RecIngredientDto>();

            CreateMap<RecipeIngredient, RecIngredientForListning>();
        }
    }
}
