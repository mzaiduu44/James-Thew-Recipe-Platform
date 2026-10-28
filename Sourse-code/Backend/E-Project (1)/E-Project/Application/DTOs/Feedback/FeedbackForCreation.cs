using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Feedback
{
    public class FeedbackForCreation
    {
        public int RecipeId { get; set; }
        public string Comment { get; set; }
        public int Rating { get; set; }

        //public DateTime CreatedAt { get; set; }
    }
}
