using Application.DTOs.Category;
using Application.Interface.RepositoryInterface;
using Application.Interface.ServiceInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Service
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repository;

        public CategoryService(ICategoryRepository repository)
        {
            _repository = repository;
        }

        public Task<bool> AddCategory(CategoryForCreation categoryForCreation)
        {
            return _repository.AddCategory(categoryForCreation);
        }

        public Task<bool> DeleteCategory(int id)
        {
            return _repository.DeleteCategory(id);
        }

        public Task<List<CategoryForListning>> GetAllCategory()
        {
            return _repository.GetAllCategory();
        }

        public Task<CategoryDto> GetCategoryByid(int id)
        {
            return _repository.GetCategoryByid(id);
        }

        public Task<bool> UpdateCategory(int id, CategoryForUpdation categoryForUpdation)
        {
            return _repository.UpdateCategory(id, categoryForUpdation);
        }
    }
}
