using Application.DTOs.Subscription;
using Application.Interface.RepositoryInterface;
using Application.Interface.ServiceInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Service
{
    public class SubscriptionService : ISubscriptionService
    {
        private readonly ISubscriptionRepository _subscriptionRepository;

        public SubscriptionService(ISubscriptionRepository subscriptionRepository)
        {
            _subscriptionRepository = subscriptionRepository;
        }

        public Task<(bool Success, string Message)> AddSubscription(SubscriptionForCreation subscriptionForCreation)
        {
            return _subscriptionRepository.AddSubscription(subscriptionForCreation);
        }

        public Task<(bool Success, string Message)> DeleteSubscription(int id)
        {
            return _subscriptionRepository.DeleteSubscription(id);
        }

        public Task<List<SubscriptionForListning>> GetAllSubscription()
        {
            return _subscriptionRepository.GetAllSubscription();
        }

        public Task<SubscriptionDto> GetSubscriptionById(int id)
        {
            return _subscriptionRepository.GetSubscriptionById(id);
        }

        public Task<(bool Success, string Message)> UpdateSubscription(int id, SubscriptionForUpdation subscriptionForUpdation)
        {
            return _subscriptionRepository.UpdateSubscription(id, subscriptionForUpdation);
        }
    }
}
