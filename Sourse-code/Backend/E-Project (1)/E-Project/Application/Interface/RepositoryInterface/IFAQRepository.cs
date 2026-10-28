using Application.DTOs.FAQ;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface.RepositoryInterface
{
    public interface IFAQRepository
    {
        Task<List<faqForListning>> GetAllFAQ();
        Task<faqDto> GetFAQById(int id);
        Task<bool> AddFAQ(faqForCreation faqForCreation);
        Task<bool> UpdateFAQ(faqForUpdation faqForUpdation);
        Task<bool> DeleteFAQ(int id);
    }
}
