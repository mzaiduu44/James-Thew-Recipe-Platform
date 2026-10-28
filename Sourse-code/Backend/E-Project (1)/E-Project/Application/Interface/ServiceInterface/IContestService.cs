using Application.DTOs.Contest;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface.ServiceInterface
{
    public interface IContestService
    {
        Task<List<ContestForListning>> GetAllContest();
        Task<ContestDto> GetContestById(int id);
        Task<bool> AddContest(ContestForCreation contestForCreation);
        Task<bool> UpdateContest(ContestForUpdation contestForUpdation);
        Task<bool> DeletContest(int id);
    }
}

