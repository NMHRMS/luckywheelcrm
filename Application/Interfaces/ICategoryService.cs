using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.ResponseDto;

namespace Application.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryResponseDto>> GetAllCategoriesAsync();
        Task<CategoryResponseDto?> GetCategoryByIdAsync(Guid id);
        Task<CategoryResponseDto> AddCategoryAsync(CategoryDto CategoryDto);
        Task<CategoryResponseDto> UpdateCategoryAsync(Guid id, CategoryDto CategoryDto);
        Task<bool> DeleteCategoryAsync(Guid id);
    }
}
