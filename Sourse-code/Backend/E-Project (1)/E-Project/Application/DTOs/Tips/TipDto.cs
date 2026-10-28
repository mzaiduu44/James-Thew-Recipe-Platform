using Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Tips
{
    public class TipDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public RecipeActionType ActionType { get; set; }
        public int CreatedById { get; set; }
        public string CreatedByName { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? ProfileImage { get; set; }
    }
}
