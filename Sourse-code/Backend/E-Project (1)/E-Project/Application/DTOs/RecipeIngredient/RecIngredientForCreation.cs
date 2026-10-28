using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.RecipeIngredient
{
    public class RecIngredientForCreation
    {
        public string RecipeName { get; set; }

        public List<RecipeIngredientItemForCreation> recipeitem { get; set; }
    }
}
