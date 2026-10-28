using Application.DTOs.Feedback;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface.ServiceInterface
{
    public interface IFeedbackService
    {
        Task<List<FeedbackForListning>> GetAllFeedback();
        Task<FeedbackDto> GetFeedbackById(int id);
        Task<(bool Success, string Message)> AddFeedback(FeedbackForCreation feedbackForCreation);
        Task<(bool Success, string Message)> UpdateFeedback(FeedbackForUpdation feedbackForUpdation);
        Task<(bool Success, string Message)> DeleteFeedback(int id);
    }
}
