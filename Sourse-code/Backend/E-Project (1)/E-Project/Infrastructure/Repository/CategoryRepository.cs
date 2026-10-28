using Application.DTOs.Category;
using Application.Interface.RepositoryInterface;
using AutoMapper;
using Domain.DatabaseConfiq;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public CategoryRepository(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<bool> AddCategory(CategoryForCreation categoryForCreation)
        {
            if (categoryForCreation == null || string.IsNullOrWhiteSpace(categoryForCreation.CategoryName))
            {
                throw new Exception("Category name cannot be empty.");
            }

            var categoryExists = await _context.Categories.AnyAsync(x =>
                x.CategoryName.ToLower() == categoryForCreation.CategoryName.Trim().ToLower());

            if (categoryExists)
            {
                throw new Exception("Category already exists.");
            }

            var category = _mapper.Map<Category>(categoryForCreation);

            category.CategoryName = categoryForCreation.CategoryName.Trim();

            await _context.Categories.AddAsync(category);

            try
            {
                return await _context.SaveChangesAsync() > 0;
            }
            catch (Exception)
            {
                if (_context.Entry(category).Properties.Any(p => p.Metadata.Name == "ProfileImage"))
                {
                    category.ProfileImage = null;
                }
                return await _context.SaveChangesAsync() > 0;
            }
        }

        public async Task<bool> DeleteCategory(int id)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(x => x.Id == id);

            if (category == null)
            {
                throw new Exception("Category not found.");
            }

            var recipesExist = await _context.Recipes.AnyAsync(x => x.CategoryId == id);

            if (recipesExist)
            {
                throw new Exception("This category cannot be deleted because recipes are associated with it.");
            }

            _context.Categories.Remove(category);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<List<CategoryForListning>> GetAllCategory()
        {
            var cate = await _context.Categories.AsNoTracking().ToListAsync();
            return _mapper.Map<List<CategoryForListning>>(cate);
        }

        public async Task<CategoryDto> GetCategoryByid(int id)
        {
            var categ = await _context.Categories.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);

            if (categ == null)
            {
                return null;
            }

            return _mapper.Map<CategoryDto>(categ);
        }

        public async Task<bool> UpdateCategory(int id, CategoryForUpdation categoryForUpdation)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(x => x.Id == id);

            if (category == null)
            {
                throw new Exception("Category not found.");
            }

            var categoryExists = await _context.Categories.AnyAsync(x => x.Id != id &&
                x.CategoryName.ToLower() == categoryForUpdation.CategoryName.Trim().ToLower());

            if (categoryExists)
            {
                throw new Exception("Another category with this name already exists.");
            }

            category.CategoryName = categoryForUpdation.CategoryName.Trim();

            try
            {
                category.ProfileImage = categoryForUpdation.ProfileImage;
                return await _context.SaveChangesAsync() > 0;
            }
            catch (Exception)
            {
                return await _context.SaveChangesAsync() > 0;
            }
        }
    }
}
