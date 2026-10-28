using Application.DTOs.Contest;
using Application.DTOs.ContestSubmission;
using AutoMapper;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.MappingProfile.ContestSubmissionProfile
{
    public class ContestSubmissionProfile:Profile
    {
        public ContestSubmissionProfile()
        {
            CreateMap<ContestSubmissionForCreation, ContestSubmission>();

            CreateMap<ContestSubmission, ContestSubmissionForListning>();

            CreateMap<ContestSubmission, ContestSubmissionDto>();
        }
    }
}
