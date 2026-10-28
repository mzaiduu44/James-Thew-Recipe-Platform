using Application.DTOs.SiteFeedback;
using Application.Interface.RepositoryInterface;
using Application.Interface.ServiceInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Service
{
    public class SiteFeedbackService : ISiteFeedbackService
    {
        private readonly ISiteFeedbackRepository _siteFeedbackRepository;

        public SiteFeedbackService(ISiteFeedbackRepository siteFeedbackRepository)
        {
            _siteFeedbackRepository = siteFeedbackRepository;
        }


        public Task<(bool Success, string Message)> AddSiteFeedback(sitefeedbackForCreation sitefeedbackForCreation)
        {
            return _siteFeedbackRepository.AddSiteFeedback(sitefeedbackForCreation);
        }

        public Task<(bool Success, string Message)> DeleteSiteFeedback(int id)
        {
            return _siteFeedbackRepository.DeleteSiteFeedback(id);
        }

        public Task<List<sitefeedbackForListning>> GetAllSiteFeedback()
        {
            return _siteFeedbackRepository.GetAllSiteFeedback();
        }

        public Task<sitefeedbackDto> GetSitefeedbackById(int id)
        {
            return _siteFeedbackRepository.GetSitefeedbackById(id);
        }

        public Task<(bool Success, string Message)> UpdateSiteFeedback(sitefeedbackForUpdation sitefeedbackForUpdation)
        {
            return _siteFeedbackRepository.UpdateSiteFeedback(sitefeedbackForUpdation);
        }
    }
}
