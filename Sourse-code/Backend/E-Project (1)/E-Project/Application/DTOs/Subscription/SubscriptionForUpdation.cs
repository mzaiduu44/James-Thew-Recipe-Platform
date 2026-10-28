using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Subscription
{
    public class SubscriptionForUpdation
    {

        public PlanType PlanType { get; set; }
        public decimal Amount { get; set; }
    }
}
