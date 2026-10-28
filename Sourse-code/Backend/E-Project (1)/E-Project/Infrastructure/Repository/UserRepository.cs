using Application.DTOs.User;
using Application.Interface.RepositoryInterface;
using AutoMapper;
using Domain.DatabaseConfiq;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public UserRepository(
            ApplicationDbContext context,
            IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<bool> AddUser(
            UserForCreation userForCreation)
        {
            if (userForCreation == null)
            {
                throw new ArgumentNullException(
                    nameof(userForCreation));
            }

       
            if (string.IsNullOrWhiteSpace(userForCreation.Email))
            {
                throw new Exception("Email is required.");
            }

            if (string.IsNullOrWhiteSpace(userForCreation.Name))
            {
                throw new Exception("Name is required.");
            }

            var emailExists = await _context.Users
                .AnyAsync(x =>
                    x.Email.ToLower() ==
                    userForCreation.Email.Trim().ToLower());

            if (emailExists)
            {
                throw new Exception(
                    "This email is already registered.");
            }

            var role = await _context.Roles
                .FirstOrDefaultAsync(r =>
                    r.RoleName.ToLower() == "user");

            if (role == null)
            {
                throw new Exception(
                    "User role not found. Please create the User role first.");
            }


            var user = _mapper.Map<User>(userForCreation);

            if (user == null)
            {
                throw new Exception(
                    "Unable to create user.");
            }

            user.Name = userForCreation.Name.Trim();
            user.Email = userForCreation.Email.Trim();

            user.Password = BCrypt.Net.BCrypt.HashPassword(userForCreation.Password);


            user.RoleId = role.Id;

            await _context.Users.AddAsync(user);

            return await _context.SaveChangesAsync() > 0;
        }


        public async Task<bool> DeleteUser(int id)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Id == id);

            if (user == null)
            {
                throw new Exception(
                    "User not found.");
            }

            _context.Users.Remove(user);

            return await _context.SaveChangesAsync() > 0;
        }


        public async Task<List<UserForListning>> GetAllUser()
        {
            var users = await _context.Users
                .Include(x => x.Role)
                .AsNoTracking()
                .ToListAsync();

            return _mapper.Map<List<UserForListning>>(users);
        }

        public async Task<UserDto> GetUserById(int id)
        {
            var user = await _context.Users
                .Include(x => x.Role)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);

            if (user == null)
            {
                throw new Exception(
                    "User not found.");
            }

            return _mapper.Map<UserDto>(user);
        }

        public User GetUserEmailAndPassword(
            LoginsRequest loginsRequest)
        {
            if (loginsRequest == null)
            {
                return null;
            }

            if (string.IsNullOrWhiteSpace(loginsRequest.Email) ||
                string.IsNullOrWhiteSpace(loginsRequest.Password))
            {
                return null;
            }

            var cleanEmail = loginsRequest.Email.Trim().ToLower();

            var user = _context.Users
                .Include(x => x.Role)
                .FirstOrDefault(x => x.Email.ToLower() == cleanEmail);

            if (user == null || string.IsNullOrWhiteSpace(user.Password))
            {
                return null;
            }

            bool isPasswordValid = false;
            bool needsRehash = false;

            try
            {
                isPasswordValid = BCrypt.Net.BCrypt.Verify(loginsRequest.Password, user.Password);
            }
            catch (Exception)
            {

                isPasswordValid = false;
            }

            if (!isPasswordValid && user.Password == loginsRequest.Password)
            {
                isPasswordValid = true;
                needsRehash = true;
            }

            if (!isPasswordValid)
            {
                return null;
            }

            if (needsRehash)
            {
                try
                {
                    user.Password = BCrypt.Net.BCrypt.HashPassword(loginsRequest.Password);
                    _context.SaveChanges();
                }
                catch
                {
                    // Rehash save failure should not block user from logging in
                }
            }

            return user;
        }
        public bool IsEmailAlreadyExist(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return false;
            }

            var cleanEmail = email.Trim();

            return _context.Users.Any(x =>
                x.Email.ToLower() ==
                cleanEmail.ToLower());
        }


        public async Task<bool> UpdateUser(
            UserForUpdation userForUpdation)
        {
            if (userForUpdation == null)
            {
                throw new ArgumentNullException(
                    nameof(userForUpdation));
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(
                    x => x.Id == userForUpdation.Id);

            if (user == null)
            {
                throw new Exception(
                    "User not found.");
            }

            if (string.IsNullOrWhiteSpace(
                userForUpdation.Name))
            {
                throw new Exception(
                    "Name is required.");
            }


            if (string.IsNullOrWhiteSpace(
                userForUpdation.Email))
            {
                throw new Exception(
                    "Email is required.");
            }

            var email = userForUpdation.Email.Trim();


            var emailExists = await _context.Users
                .AnyAsync(x =>
                    x.Email.ToLower() == email.ToLower() &&
                    x.Id != userForUpdation.Id);

            if (emailExists)
            {
                throw new Exception(
                    "This email is already registered.");
            }

            user.Name =
                userForUpdation.Name.Trim();

            user.Email = email;


            if (!string.IsNullOrWhiteSpace(
                userForUpdation.Password))
            {
                user.Password =
                    BCrypt.Net.BCrypt.HashPassword(userForUpdation.Password);
            }

            if (!string.IsNullOrWhiteSpace(
                userForUpdation.ProfileImage))
            {
                user.ProfileImage =
                    userForUpdation.ProfileImage;
            }

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<int> MigratePlaintextPasswordsAsync()
        {
            var users = await _context.Users.ToListAsync();
            int migratedCount = 0;

            foreach (var user in users)
            {
                if (!string.IsNullOrWhiteSpace(user.Password) &&
                    !user.Password.StartsWith("$2a$") &&
                    !user.Password.StartsWith("$2b$") &&
                    !user.Password.StartsWith("$2y$"))
                {
                    user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
                    migratedCount++;
                }
            }

            if (migratedCount > 0)
            {
                await _context.SaveChangesAsync();
            }

            return migratedCount;
        }
    }
}