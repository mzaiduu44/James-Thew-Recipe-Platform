using Application.DTOs.Role;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface.RepositoryInterface
{
    public interface IRoleRepository
    {
        Task<List<RoleForListning>> GetAllRole();
        Task<RoleDto> GetRoleById(int id);
        Task<bool> AddRole(RoleForCreation roleForCreation);
        Task<bool> UpdateRole(RoleForUpdation roleForUpdation);
        Task<bool> DeleteRole(int id);
    }
}
