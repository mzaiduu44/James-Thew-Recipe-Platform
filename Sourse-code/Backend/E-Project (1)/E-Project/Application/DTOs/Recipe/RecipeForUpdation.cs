using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Recipe
{
    public class RecipeForUpdation
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public bool IsFree { get; set; }

        public string Description { get; set; }

        public string Procedure { get; set; }
        public RecipeActionType ActionType { get; set; }

        public int CategoryId { get; set; }
        public List<string>? ImagePaths { get; set; }

    }
}
