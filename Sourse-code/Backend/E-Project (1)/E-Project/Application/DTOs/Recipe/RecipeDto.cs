using Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Recipe
{
    public class RecipeDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Procedure { get; set; }

        public RecipeActionType ActionType { get; set; }
        public int CategoryId { get; set; }

        public string CategoryName { get; set; }
        public int CreatedById { get; set; }

        public DateTime CreatedAt { get; set; }
        public List<string> ImagePaths { get; set; }
    }
}
