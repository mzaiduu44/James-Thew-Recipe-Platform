using Application.DTOs.Role;
using Application.Interface.RepositoryInterface;
using AutoMapper;
using Domain.DatabaseConfiq;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repository
{
    public class RoleRepository : IRoleRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public RoleRepository(
            ApplicationDbContext context,
            IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }


        public async Task<bool> AddRole(RoleForCreation roleForCreation)
        {
            if (roleForCreation == null)
                throw new ArgumentNullException(nameof(roleForCreation));

            var role = _mapper.Map<Role>(roleForCreation);

            if (role == null)
                throw new Exception("Unable to create role.");

            await _context.Roles.AddAsync(role);

            return await _context.SaveChangesAsync() > 0;
        }


        public async Task<bool> DeleteRole(int id)
        {
            var role = await _context.Roles
                .FirstOrDefaultAsync(x => x.Id == id);

            if (role == null)
                throw new Exception("Role not found.");

            _context.Roles.Remove(role);

            return await _context.SaveChangesAsync() > 0;
        }


        public async Task<List<RoleForListning>> GetAllRole()
        {
            var roles = await _context.Roles
                .AsNoTracking()
                .ToListAsync();

            return _mapper.Map<List<RoleForListning>>(roles);
        }


        public async Task<RoleDto> GetRoleById(int id)
        {
            var role = await _context.Roles
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);

            if (role == null)
                throw new Exception("Role not found.");

            return _mapper.Map<RoleDto>(role);
        }


        public async Task<bool> UpdateRole(
            RoleForUpdation roleForUpdation)
        {
            if (roleForUpdation == null)
                throw new ArgumentNullException(
                    nameof(roleForUpdation));

            var role = await _context.Roles
                .FirstOrDefaultAsync(x => x.Id == roleForUpdation.Id);

            if (role == null)
                throw new Exception("Role not found.");

            _mapper.Map(roleForUpdation, role);

            return await _context.SaveChangesAsync() > 0;
        }
    }
}