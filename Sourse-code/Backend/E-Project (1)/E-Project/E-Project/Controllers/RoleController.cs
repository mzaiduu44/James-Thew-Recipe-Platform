using Application.DTOs.Role;
using Application.Interface.ServiceInterface;
using Infrastructure.Service;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace E_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RoleController (IRoleService roleService)
        {
            _roleService = roleService;
        }

        // GET: api/<RoleController>
        [HttpGet]
        public Task<List<RoleForListning>> Get()
        {
            return _roleService.GetAllRole();
        }

        // GET api/<RoleController>/5
        [HttpGet("{id}")]
        public Task<RoleDto> Get(int id)
        {
            return _roleService.GetRoleById(id);
        }

        // POST api/<RoleController>
        [HttpPost]
        public Task<bool> Post(RoleForCreation roleForCreation)
        {
            return _roleService.AddRole(roleForCreation);
        }

        // PUT api/<RoleController>/5
        [HttpPut("{id}")]
        public Task<bool> Put(RoleForUpdation roleForUpdation)
        {
            return _roleService.UpdateRole(roleForUpdation);
        }

        // DELETE api/<RoleController>/5
        [HttpDelete("{id}")]
        public Task<bool> Delete(int id)
        {
            return _roleService.DeleteRole(id);
        }
    }
}
