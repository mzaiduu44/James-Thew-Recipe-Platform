using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Announcement
{
    public class AnnouncementForCreation
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int? ContestId { get; set; }
        public int? WinnerSubmissionId { get; set; }
    }
}
