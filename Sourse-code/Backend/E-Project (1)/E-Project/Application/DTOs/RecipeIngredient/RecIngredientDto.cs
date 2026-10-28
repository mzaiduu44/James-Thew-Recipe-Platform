using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.RecipeIngredient
{
    public class RecIngredientDto
    {
        public int Id { get; set; }
        public string RecipeName { get; set; }

        public string IngredientName { get; set; }
        public string Quantity { get; set; }
        public string? ProfileImage { get; set; }
    }
}
