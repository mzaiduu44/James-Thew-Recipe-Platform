using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Contest
{
    public class ContestForUpdation
    {
        public int Id { get; set; }
        public string Title { get; set; }

        public string Description { get; set; }
        public int DurationDays { get; set; }
        public string? ProfileImage { get; set; }
    }
}

