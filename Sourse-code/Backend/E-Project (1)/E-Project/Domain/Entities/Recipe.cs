using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Recipe
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public bool IsFree { get; set; }

        public string Description { get; set; }
        public string Procedure { get; set; }
        public RecipeActionType ActionType { get; set; }
        public int CategoryId { get; set; } 
        [ForeignKey(nameof(CategoryId))]
        public Category Category { get; set; }

        public int CreatedById { get; set; }
        [ForeignKey(nameof(CreatedById))]
        public User User { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<RecipeImage> RecipeImages { get; set; }
        public List<ContestSubmission> ContestSubmissions { get; set; }
        public List<RecipeIngredient> RecipeIngredients { get; set; }

        public List<Feedback> Feedbacks { get; set; }
    }
}
