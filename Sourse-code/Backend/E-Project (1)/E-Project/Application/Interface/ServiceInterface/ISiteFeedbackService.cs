using Application.DTOs.SiteFeedback;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface.ServiceInterface
{
    public interface ISiteFeedbackService
    {
        Task<List<sitefeedbackForListning>> GetAllSiteFeedback();
        Task<sitefeedbackDto> GetSitefeedbackById(int id);
        Task<(bool Success, string Message)> AddSiteFeedback(sitefeedbackForCreation sitefeedbackForCreation);
        Task<(bool Success, string Message)> UpdateSiteFeedback(sitefeedbackForUpdation sitefeedbackForUpdation);
        Task<(bool Success, string Message)> DeleteSiteFeedback(int id);
    }
}
