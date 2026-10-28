using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Announcement
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int? ContestId { get; set; }
        [ForeignKey(nameof(ContestId))]
        public Contest? Contest { get; set; }
        public int? WinnerSubmissionId { get; set; }

        [ForeignKey(nameof(WinnerSubmissionId))]
        public ContestSubmission? WinnerSubmission { get; set; }
        public int CreatedById { get; set; }
        [ForeignKey(nameof(CreatedById))]
        public User User { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
