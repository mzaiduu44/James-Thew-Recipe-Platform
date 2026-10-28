using Application.DTOs.Role;
using Application.Interface.RepositoryInterface;
using Application.Interface.ServiceInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Service
{
    public class RoleService : IRoleService
    {
        private readonly IRoleRepository _roleRepository;

        public RoleService(IRoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }
        public Task<bool> AddRole(RoleForCreation roleForCreation)
        {
            return _roleRepository.AddRole(roleForCreation);
        }

        public Task<bool> DeleteRole(int id)
        {
            return _roleRepository.DeleteRole(id);
        }

        public Task<List<RoleForListning>> GetAllRole()
        {
            return _roleRepository.GetAllRole();
        }
        

        public Task<RoleDto> GetRoleById(int id)
        {
            return _roleRepository.GetRoleById(id);
        }

        public Task<bool> UpdateRole(RoleForUpdation roleForUpdation)
        {
            return _roleRepository.UpdateRole(roleForUpdation);
        }
    }
}
