using Application.DTOs.Role;
using Application.DTOs.User;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface.RepositoryInterface
{
    public interface IUserRepository
    {
        Task<List<UserForListning>> GetAllUser();
        Task<UserDto> GetUserById(int id);
        Task<bool> AddUser(UserForCreation userForCreation);
        Task<bool> UpdateUser(UserForUpdation userForUpdation);
        Task<bool> DeleteUser(int id);

        bool IsEmailAlreadyExist(string email);
        User GetUserEmailAndPassword(LoginsRequest loginsRequest);

        // One-time admin utility for migrating legacy plaintext passwords to BCrypt hashes
        Task<int> MigratePlaintextPasswordsAsync();
    }
}
