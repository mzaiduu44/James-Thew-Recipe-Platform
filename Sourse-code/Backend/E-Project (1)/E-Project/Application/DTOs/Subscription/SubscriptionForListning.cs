using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Subscription
{
    public class SubscriptionForListning
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public PlanType PlanType { get; set; }

        public decimal Amount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public SubscriptionStatus Status { get; set; }
    }
}
