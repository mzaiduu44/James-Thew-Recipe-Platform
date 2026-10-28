using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class ContestSubmission
    {
        public int Id { get; set; }
        public int ContestId { get; set; }
        [ForeignKey(nameof(ContestId))]
        public virtual Contest? Contest { get; set; }

        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual User? User { get; set; }
        public int? RecipeId { get; set; }
        [ForeignKey(nameof(RecipeId))]
        public virtual Recipe? Recipe { get; set; }
        public int? TipId { get; set; }

        [ForeignKey(nameof(TipId))]
        public virtual Tip? Tip { get; set; }
        public bool IsWinner { get; set; }
        public DateTime SubmittedAt { get; set; }
    }
}
