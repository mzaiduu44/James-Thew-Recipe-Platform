using Application.DTOs.Contest;
using Application.Interface.RepositoryInterface;
using Application.Interface.ServiceInterface;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Service
{
    public class ContestService : IContestService
    {
        private readonly IContestRepository _contestRepository;

        public ContestService(IContestRepository contestRepository)
        {
            _contestRepository = contestRepository;
        }

 

        public Task<bool> AddContest(ContestForCreation contestForCreation)
        {
            return _contestRepository.AddContest(contestForCreation);
        }

        public Task<bool> DeletContest(int id)
        {
            return _contestRepository.DeletContest(id);
        }

        public Task<List<ContestForListning>> GetAllContest()
        {
            return _contestRepository.GetAllContest();
        }

        public Task<ContestDto> GetContestById(int id)
        {
            return _contestRepository.GetContestById(id);
        }

        public Task<bool> UpdateContest(ContestForUpdation contestForUpdation)
        {
            return _contestRepository.UpdateContest(contestForUpdation);
        }
    }
}
