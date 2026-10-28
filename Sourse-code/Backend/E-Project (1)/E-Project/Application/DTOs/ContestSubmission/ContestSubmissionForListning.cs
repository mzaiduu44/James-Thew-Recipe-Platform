using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.ContestSubmission
{
    public class ContestSubmissionForListning
    {
        public int Id { get; set; }
        public int ContestId { get; set; }
        public int UserId { get; set; }

        public int? RecipeId { get; set; }
        public int? TipId { get; set; }
        public bool IsWinner { get; set; }

        public DateTime SubmittedAt { get; set; }
    }
}
