using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }

        public string Password { get; set; }
        public string? ProfileImage { get; set; }

        public int RoleId { get; set; }
        [ForeignKey(nameof(RoleId))]
        public Role Role { get; set; }
        public List<Contest> Contests { get; set; }
        public List<Subscription> Subscriptions { get; set; }
        public List<Announcement> Announcements { get; set; }

        public List<Recipe> Recipes { get; set; }

        public List<Tip> Tips { get; set; }
        public List<Feedback> Feedbacks { get; set; }
        public List<ContestSubmission> ContestSubmissions { get; set; }
        public List<SiteFeedback> SiteFeedbacks { get; set; } = new();

    }
}