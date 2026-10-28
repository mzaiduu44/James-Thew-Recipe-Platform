using Application.DTOs.FAQ;
using Application.Interface.RepositoryInterface;
using AutoMapper;
using Domain.DatabaseConfiq;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class FAQRepository : IFAQRepository
    {
        private readonly ApplicationDbContext _context;
        IMapper _mapper;

        public FAQRepository (ApplicationDbContext context,IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }


        public async Task<bool> AddFAQ(faqForCreation faqForCreation)
        {
            if (string.IsNullOrWhiteSpace(faqForCreation.Question))
            {
                throw new Exception("Question is required.");
            }

            if (string.IsNullOrWhiteSpace(faqForCreation.Answer))
            {
                throw new Exception("Answer is required.");
            }

            var faq = _mapper.Map<FAQ>(faqForCreation);

            await _context.FAQs.AddAsync(faq);

            return await _context.SaveChangesAsync() > 0;
        }


        public async Task<bool> DeleteFAQ(int id)
        {
            var faq = await _context.FAQs
                .FirstOrDefaultAsync(x => x.Id == id);

            if (faq == null)
            {
                throw new Exception("FAQ not found.");
            }

            _context.FAQs.Remove(faq);

            return await _context.SaveChangesAsync() > 0;
        }
        

        public async Task<List<faqForListning>> GetAllFAQ()
        {
            var faqs = await _context.FAQs
                .AsNoTracking()
                .ToListAsync();

            return _mapper.Map<List<faqForListning>>(faqs);
        }

        public async Task<faqDto> GetFAQById(int id)
        {
            var faq = await _context.FAQs
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);

            if (faq == null)
            {
                return null;
            }

            return _mapper.Map<faqDto>(faq);
        }

        public async Task<bool> UpdateFAQ(faqForUpdation faqForUpdation)
        {
            if (string.IsNullOrWhiteSpace(faqForUpdation.Question))
            {
                throw new Exception("Question is required.");
            }

            if (string.IsNullOrWhiteSpace(faqForUpdation.Answer))
            {
                throw new Exception("Answer is required.");
            }

            var faq = await _context.FAQs
                .FirstOrDefaultAsync(x => x.Id == faqForUpdation.Id);

            if (faq == null)
            {
                throw new Exception("FAQ not found.");
            }

            faq.Question = faqForUpdation.Question;
            faq.Answer = faqForUpdation.Answer;

            return await _context.SaveChangesAsync() > 0;
        }
    }
    
}
