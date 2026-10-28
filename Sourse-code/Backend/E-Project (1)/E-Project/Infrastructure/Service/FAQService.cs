using Application.DTOs.FAQ;
using Application.Interface.RepositoryInterface;
using Application.Interface.ServiceInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Service
{
    public class FAQService : IFAQService
    {
        private readonly IFAQRepository _fAQRepository;

        public FAQService(IFAQRepository fAQRepository)
        {
            _fAQRepository = fAQRepository;
        }


        public Task<bool> AddFAQ(faqForCreation faqForCreation)
        {
            return _fAQRepository.AddFAQ(faqForCreation);
        }

        public Task<bool> DeleteFAQ(int id)
        {
            return _fAQRepository.DeleteFAQ(id);
        }

        public Task<List<faqForListning>> GetAllFAQ()
        {
            return _fAQRepository.GetAllFAQ();
        }

        public Task<faqDto> GetFAQById(int id)
        {
            return _fAQRepository.GetFAQById(id);
        }

        public Task<bool> UpdateFAQ(faqForUpdation faqForUpdation)
        {
            return _fAQRepository.UpdateFAQ(faqForUpdation);
        }
    }
}
