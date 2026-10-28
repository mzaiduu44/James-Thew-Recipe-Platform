using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Tips
{
    public class TipForUpdation
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }
        public bool IsFree { get; set; }

        public RecipeActionType ActionType { get; set; }

        public int CreatedById { get; set; }

        public string? ProfileImage { get; set; }

    }
}
