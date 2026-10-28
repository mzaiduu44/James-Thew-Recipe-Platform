using Application.DTOs.Category;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface.ServiceInterface
{
    public interface ICategoryService
    {
        Task<List<CategoryForListning>> GetAllCategory();
        Task<CategoryDto> GetCategoryByid(int id);
        Task<bool> AddCategory(CategoryForCreation categoryForCreation);
        Task<bool> UpdateCategory(int id, CategoryForUpdation categoryForUpdation);
        Task<bool> DeleteCategory(int id);
    }
}
