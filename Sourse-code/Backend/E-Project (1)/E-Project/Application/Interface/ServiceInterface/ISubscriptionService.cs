using Application.DTOs.Subscription;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface.ServiceInterface
{
    public interface ISubscriptionService
    {
        Task<List<SubscriptionForListning>> GetAllSubscription();
        Task<SubscriptionDto> GetSubscriptionById(int id);
        Task<(bool Success, string Message)> AddSubscription(SubscriptionForCreation subscriptionForCreation);
        Task<(bool Success, string Message)> UpdateSubscription(int id, SubscriptionForUpdation subscriptionForUpdation);
        Task<(bool Success, string Message)> DeleteSubscription(int id);
    }
}
