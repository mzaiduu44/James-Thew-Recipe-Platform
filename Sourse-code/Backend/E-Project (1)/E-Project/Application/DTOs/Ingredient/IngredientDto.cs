using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Ingredient
{
    public class IngredientDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? ProfileImage { get; set; }
    }
}
