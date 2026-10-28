using Application.DTOs.Tips;
using Application.Interface.RepositoryInterface;
using Application.Interface.ServiceInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Service
{
    public class TipService : ITipService
    {
        private readonly ITipRepository _tipRepository;

        public TipService(ITipRepository tipRepository)
        {
            _tipRepository = tipRepository;
        }

        public Task<(bool Success, string Message)> AddTip(TipForCreation tipForCreation)
        {
            return _tipRepository.AddTip(tipForCreation);
        }

        public Task<(bool Success, string Message)> DeletTip(int id)
        {
            return _tipRepository.DeletTip(id);
        }

        public Task<List<TipForListning>> GetAllTip()
        {
            return _tipRepository.GetAllTip();
        }

        // TODO(security): Paywall bypass vulnerability. Full tip content is returned without verifying
        // subscriber status for Premium tips.
        public Task<TipDto> GetTipById(int id)
        {
            return _tipRepository.GetTipById(id);
        }

        public Task<(bool Success, string Message)> UpdateTip(TipForUpdation tipForUpdation)
        {
            return _tipRepository.UpdateTip(tipForUpdation);
        }
    }
}
