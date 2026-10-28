using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Feedback
{
    public class FeedbackDto
    {
        public int Id { get; set; }
        public int RecipeId { get; set; }
        public int UserId { get; set; }

        public string UserName { get; set; }
        public string Comment { get; set; }
        public string ProfileImage { get; set; }
        public int Rating { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
