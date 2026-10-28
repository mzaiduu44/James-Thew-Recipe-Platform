using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Tip
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public bool IsFree { get; set; }
        public string Description { get; set; }

        public RecipeActionType ActionType { get; set; }
        public int CreatedById { get; set; }
        [ForeignKey(nameof(CreatedById))]
        public User User { get; set; }

        public string? ProfileImage { get; set; }
        public List<ContestSubmission> ContestSubmissions { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
