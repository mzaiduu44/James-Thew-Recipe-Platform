using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{
    public class SiteFeedback
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User User { get; set; }
        public string? ProfileImage { get; set; }
        public string Comment { get; set; }
        public int Rating { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}