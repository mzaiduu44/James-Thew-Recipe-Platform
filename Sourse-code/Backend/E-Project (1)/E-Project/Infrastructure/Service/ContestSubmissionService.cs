using Application.DTOs.ContestSubmission;
using Application.Interface.RepositoryInterface;
using Application.Interface.ServiceInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Service
{
    public class ContestSubmissionService : IContestSubmissionService
    {
        private readonly IContestSubmissionRepository _contestSubmissionRepository;

        public ContestSubmissionService(IContestSubmissionRepository contestSubmissionRepository)
        {
            _contestSubmissionRepository = contestSubmissionRepository;
        }


        public Task<bool> AddContestSubmission(ContestSubmissionForCreation contestSubmissionForCreation)
        {
            return _contestSubmissionRepository.AddContestSubmission(contestSubmissionForCreation);
        }

        public Task<bool> DeleteContestSubmission(int id)
        {
            return _contestSubmissionRepository.DeleteContestSubmission(id);
        }

        public Task<List<ContestSubmissionForListning>> GetAllContestSubmission()
        {
            return _contestSubmissionRepository.GetAllContestSubmission();
        }

        public Task<ContestSubmissionDto> GetContestSubmissionById(int id)
        {
            return _contestSubmissionRepository.GetContestSubmissionById(id);
        }

        public Task<bool> SetWinner(int submissionId)
        {
            return _contestSubmissionRepository.SetWinner(submissionId);
        }
    }
}
