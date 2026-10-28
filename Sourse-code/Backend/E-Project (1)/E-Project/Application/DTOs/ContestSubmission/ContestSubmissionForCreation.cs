using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.ContestSubmission
{
    public class ContestSubmissionForCreation
    {
        public int ContestId { get; set; }
        public int? RecipeId { get; set; }
        public int? TipId { get; set; }
    }
}
