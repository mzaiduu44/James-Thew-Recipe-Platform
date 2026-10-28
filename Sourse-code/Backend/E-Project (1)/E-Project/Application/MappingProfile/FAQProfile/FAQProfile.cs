using Application.DTOs.FAQ;
using AutoMapper;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.MappingProfile.FAQProfile
{
    public class FAQProfile:Profile
    {
        public FAQProfile()
        {
            CreateMap<faqForCreation, FAQ>();

            CreateMap<faqForUpdation, FAQ>();

            CreateMap<FAQ, faqForListning>();

            CreateMap<FAQ, faqDto>();
        }
    }
}
