using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.RecipeIngredient
{
    public class RecipeIngredientItemForCreation
    {
        public string IngredientName { get; set; }
        public string Quantity { get; set; }
        public string? ProfileImage { get; set; }
    }
}
