using Application.DTOs.Feedback;
using Application.Interface.RepositoryInterface;
using Application.Interface.ServiceInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Service
{
    public class FeedbackService : IFeedbackService
    {
        private readonly IFeedbackRepository _feedbackRepository;

        public FeedbackService(IFeedbackRepository feedbackRepository)
        {
            _feedbackRepository = feedbackRepository;
        }


        public Task<(bool Success, string Message)> AddFeedback(FeedbackForCreation feedbackForCreation)
        {
            return _feedbackRepository.AddFeedback(feedbackForCreation);
        }

        public Task<(bool Success, string Message)> DeleteFeedback(int id)
        {
            return _feedbackRepository.DeleteFeedback(id);
        }

        public Task<List<FeedbackForListning>> GetAllFeedback()
        {
            return _feedbackRepository.GetAllFeedback();
        }

        public Task<FeedbackDto> GetFeedbackById(int id)
        {
            return _feedbackRepository.GetFeedbackById(id);
        }

        public Task<(bool Success, string Message)> UpdateFeedback(FeedbackForUpdation feedbackForUpdation)
        {
            return _feedbackRepository.UpdateFeedback(feedbackForUpdation);
        }
    }
}
