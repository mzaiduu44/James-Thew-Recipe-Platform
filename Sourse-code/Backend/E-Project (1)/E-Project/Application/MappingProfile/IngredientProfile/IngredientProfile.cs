using Application.DTOs.Ingredient;
using AutoMapper;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.MappingProfile.IngredientProfile
{
    public class IngredientProfile:Profile
    {
        public IngredientProfile()
        {
            CreateMap<IngredientForCreation, Ingredient>();

            CreateMap<IngredientForUpdation, Ingredient>();

            CreateMap<Ingredient, IngredientForListning>();

            CreateMap<Ingredient, IngredientDto>();
        }
    }
}
