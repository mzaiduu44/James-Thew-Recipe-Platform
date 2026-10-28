using Application.DTOs.Subscription;
using Application.Interface.RepositoryInterface;
using AutoMapper;
using Domain.DatabaseConfiq;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repository
{
    public class SubscriptionRepository : ISubscriptionRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public SubscriptionRepository(
            ApplicationDbContext context,
            IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }


        private async Task CheckExpiredSubscriptions()
        {
            var now = DateTime.UtcNow;

            var expiredSubscriptions = await _context.Subscriptions
                .Where(x =>
                    x.Status == SubscriptionStatus.Active &&
                    x.EndDate <= now)
                .ToListAsync();

            if (!expiredSubscriptions.Any())
                return;

            foreach (var subscription in expiredSubscriptions)
            {
                subscription.Status = SubscriptionStatus.Expired;
            }

            await _context.SaveChangesAsync();
        }

        public async Task<(bool Success, string Message)> AddSubscription(
            SubscriptionForCreation subscriptionForCreation)
        {
            if (subscriptionForCreation == null)
            {
                return (false, "Subscription data is required.");
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(
                    u => u.Id == subscriptionForCreation.UserId);

            if (user == null)
            {
                return (
                    false,
                    $"User with ID {subscriptionForCreation.UserId} does not exist. Please register this user first."
                );
            }


            var subscription =
                _mapper.Map<Subscription>(subscriptionForCreation);

            if (subscription == null)
            {
                return (false, "Unable to create subscription.");
            }

            var now = DateTime.UtcNow;


            switch (subscription.PlanType)
            {
                case PlanType.Weekly:

                    if (subscription.Amount != 20)
                    {
                        return (
                            false,
                            "Weekly subscription amount must be exactly $20."
                        );
                    }

                    subscription.StartDate = now;
                    subscription.EndDate = now.AddDays(7);

                    break;

                case PlanType.Monthly:

                    if (subscription.Amount != 100)
                    {
                        return (
                            false,
                            "Monthly subscription amount must be exactly $100."
                        );
                    }

                    subscription.StartDate = now;
                    subscription.EndDate = now.AddMonths(1);

                    break;

                case PlanType.Yearly:

                    if (subscription.Amount != 1000)
                    {
                        return (
                            false,
                            "Yearly subscription amount must be exactly $1000."
                        );
                    }

                    subscription.StartDate = now;
                    subscription.EndDate = now.AddYears(1);

                    break;

                default:

                    return (
                        false,
                        "Invalid subscription plan."
                    );
            }

            subscription.Status = SubscriptionStatus.Active;

            var memberRole = await _context.Roles
                .FirstOrDefaultAsync(x => x.RoleName == "Member");

            if (memberRole == null)
            {
                return (false, "Member role not found.");
            }

            user.RoleId = memberRole.Id;

            await _context.Subscriptions.AddAsync(subscription);

            var saved = await _context.SaveChangesAsync();

            if (saved > 0)
            {
                return (
                    true,
                    "Subscription created successfully and user role changed to Member."
                );
            }

            return (
                false,
                "Subscription could not be created."
            );
        }

        public async Task<(bool Success, string Message)>
            DeleteSubscription(int id)
        {
            var subscription = await _context.Subscriptions
                .FirstOrDefaultAsync(x => x.Id == id);

            if (subscription == null)
            {
                return (false, "Subscription not found.");
            }

 
            var user = await _context.Users
                .FirstOrDefaultAsync(
                    x => x.Id == subscription.UserId);

            if (user == null)
            {
                return (
                    false,
                    "User associated with subscription not found."
                );
            }

            _context.Subscriptions.Remove(subscription);

            var now = DateTime.UtcNow;

            var hasAnotherActiveSubscription =
                await _context.Subscriptions.AnyAsync(x =>
                    x.UserId == user.Id &&
                    x.Id != subscription.Id &&
                    x.Status == SubscriptionStatus.Active &&
                    x.EndDate > now);

            if (!hasAnotherActiveSubscription)
            {
                var userRole = await _context.Roles
                    .FirstOrDefaultAsync(
                        x => x.RoleName == "User");

                if (userRole == null)
                {
                    return (false, "User role not found.");
                }

                user.RoleId = userRole.Id;
            }

            var saved = await _context.SaveChangesAsync();

            if (saved > 0)
            {
                return (
                    true,
                    "Subscription deleted successfully."
                );
            }

            return (
                false,
                "Subscription could not be deleted."
            );
        }


        public async Task<List<SubscriptionForListning>>
            GetAllSubscription()
        {
            await CheckExpiredSubscriptions();

            var subscriptions = await _context.Subscriptions
                .AsNoTracking()
                .ToListAsync();

            return _mapper.Map<List<SubscriptionForListning>>(
                subscriptions);
        }

        public async Task<SubscriptionDto> GetSubscriptionById(int id)
        {
            await CheckExpiredSubscriptions();

            var subscription = await _context.Subscriptions
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);

            if (subscription == null)
            {
                throw new Exception("Subscription not found.");
            }

            return _mapper.Map<SubscriptionDto>(subscription);
        }


        public async Task<(bool Success, string Message)>
            UpdateSubscription(
                int id,
                SubscriptionForUpdation subscriptionForUpdation)
        {
            if (subscriptionForUpdation == null)
            {
                return (
                    false,
                    "Subscription data is required."
                );
            }

            await CheckExpiredSubscriptions();

            var subscription = await _context.Subscriptions
                .FirstOrDefaultAsync(x => x.Id == id);

            if (subscription == null)
            {
                return (
                    false,
                    "Subscription not found."
                );
            }

            if (subscription.Status == SubscriptionStatus.Expired)
            {
                return (
                    false,
                    "Expired subscription cannot be updated. Please create a new subscription."
                );
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(
                    x => x.Id == subscription.UserId);

            if (user == null)
            {
                return (
                    false,
                    "User associated with subscription not found."
                );
            }

            var memberRole = await _context.Roles
                .FirstOrDefaultAsync(
                    x => x.RoleName == "Member");

            if (memberRole == null)
            {
                return (
                    false,
                    "Member role not found."
                );
            }

            var now = DateTime.UtcNow;

            var remainingTime = TimeSpan.Zero;

            if (subscription.EndDate > now)
            {
                remainingTime =
                    subscription.EndDate - now;
            }

 
            if (subscriptionForUpdation.PlanType ==
                PlanType.Weekly)
            {
                if (subscriptionForUpdation.Amount != 20)
                {
                    return (
                        false,
                        "Weekly subscription amount must be exactly $20."
                    );
                }

                subscription.PlanType =
                    PlanType.Weekly;

                subscription.Amount = 20;

                subscription.StartDate = now;

                subscription.EndDate =
                    now.AddDays(7)
                       .Add(remainingTime);
            }

            else if (subscriptionForUpdation.PlanType ==
                     PlanType.Monthly)
            {
                if (subscriptionForUpdation.Amount != 100)
                {
                    return (
                        false,
                        "Monthly subscription amount must be exactly $100."
                    );
                }

                subscription.PlanType =
                    PlanType.Monthly;

                subscription.Amount = 100;

                subscription.StartDate = now;

                subscription.EndDate =
                    now.AddMonths(1)
                       .Add(remainingTime);
            }

            else if (subscriptionForUpdation.PlanType ==
                     PlanType.Yearly)
            {
                if (subscriptionForUpdation.Amount != 1000)
                {
                    return (
                        false,
                        "Yearly subscription amount must be exactly $1000."
                    );
                }

                subscription.PlanType =
                    PlanType.Yearly;

                subscription.Amount = 1000;

                subscription.StartDate = now;

                subscription.EndDate =
                    now.AddYears(1)
                       .Add(remainingTime);
            }

            else
            {
                return (
                    false,
                    "Invalid subscription plan."
                );
            }


            subscription.Status =
                SubscriptionStatus.Active;

            user.RoleId = memberRole.Id;

            var saved = await _context.SaveChangesAsync();

            if (saved > 0)
            {
                return (
                    true,
                    "Subscription updated successfully. Remaining time has been preserved."
                );
            }

            return (
                false,
                "Subscription could not be updated."
            );
        }
    }
}