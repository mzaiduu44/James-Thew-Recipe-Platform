using Application.DTOs.User;
using Application.Interface.RepositoryInterface;
using Application.Interface.ServiceInterface;
using Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        IConfiguration _configuration;
        public UserService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public Task<bool> AddUser(UserForCreation userForCreation)
        {
            return _userRepository.AddUser(userForCreation);
        }

        public Task<bool> DeleteUser(int id)
        {
            return _userRepository.DeleteUser(id);
        }

        public string GenerateToken(User user)
        {
            var jwt = _configuration.GetSection("Jwt");

            var claims = new[]
            {
                //new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim("UserId", user.Id.ToString()),
                new Claim("ProfileImage", user.ProfileImage ?? ""),
                //new Claim("UserId",user.Id.ToString()),
                // new Claim("ProfileImage", user.ProfileImage),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.RoleName)

            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwt["Key"]!));

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwt["Issuer"],
                audience: jwt["Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(
                    Convert.ToDouble(jwt["ExpiryInMinutes"])),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public Task<List<UserForListning>> GetAllUser()
        {
            return _userRepository.GetAllUser();
        }

        public Task<UserDto> GetUserById(int id)
        {
            return _userRepository.GetUserById(id);
        }

        public User GetUserEmailAndPassword(LoginsRequest loginsRequest)
        {
            return _userRepository.GetUserEmailAndPassword(loginsRequest);
        }

        public bool IsEmailAlreadyExist(string email)
        {
            return _userRepository.IsEmailAlreadyExist(email);
        }

        public Task<bool> UpdateUser(UserForUpdation userForUpdation)
        {
            return _userRepository.UpdateUser(userForUpdation);
        }

        public Task<int> MigratePlaintextPasswordsAsync()
        {
            return _userRepository.MigratePlaintextPasswordsAsync();
        }
    }
}
