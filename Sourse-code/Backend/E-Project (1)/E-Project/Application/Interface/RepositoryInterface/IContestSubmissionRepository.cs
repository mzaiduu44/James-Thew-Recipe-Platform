using Application.DTOs.ContestSubmission;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface.RepositoryInterface
{
    public interface IContestSubmissionRepository
    {
        Task<List<ContestSubmissionForListning>> GetAllContestSubmission();

        Task<ContestSubmissionDto> GetContestSubmissionById(int id);

        Task<bool> AddContestSubmission(ContestSubmissionForCreation contestSubmissionForCreation);

        //Task<bool> UpdateContestSubmission(ContestSubmissionForUpdation contestSubmissionForUpdation);

        Task<bool> DeleteContestSubmission(int id);

        Task<bool> SetWinner(int submissionId);
    }
}
