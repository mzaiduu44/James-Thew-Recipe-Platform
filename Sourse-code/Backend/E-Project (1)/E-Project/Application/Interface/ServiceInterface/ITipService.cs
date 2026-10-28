using Application.DTOs.Tips;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface.ServiceInterface
{
    public interface ITipService
    {
        Task<List<TipForListning>> GetAllTip();
        Task<TipDto> GetTipById(int id);
        Task<(bool Success, string Message)> AddTip(TipForCreation tipForCreation);
        Task<(bool Success, string Message)> UpdateTip(TipForUpdation tipForUpdation);
        Task<(bool Success, string Message)> DeletTip(int id);
    }
}
