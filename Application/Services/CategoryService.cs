using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Interfaces;
using Application.ResponseDto;
using AutoMapper;
using Domain.Models;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IJwtTokenService _jwtTokenService;

        public CategoryService(ApplicationDbContext context, IMapper mapper, IJwtTokenService jwtTokenService)
        {
            _context = context;
            _mapper = mapper;
            _jwtTokenService = jwtTokenService;
        }

        public async Task<IEnumerable<CategoryResponseDto>> GetAllCategoriesAsync()
        {
            var categories = await _context.Categories.ToListAsync();
            return _mapper.Map<IEnumerable<CategoryResponseDto>>(categories);
        }

        public async Task<CategoryResponseDto?> GetCategoryByIdAsync(Guid id)
        {
            var category = await _context.Categories.FindAsync(id);
            return category == null ? null : _mapper.Map<CategoryResponseDto>(category);
        }


        public async Task<CategoryResponseDto> AddCategoryAsync(CategoryDto categoryDto)
        {
            var userId = _jwtTokenService.GetUserIdFromToken();
            var category = _mapper.Map<Category>(categoryDto);
            category.CategoryId = Guid.NewGuid();
            category.CreatedBy = userId;
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return _mapper.Map<CategoryResponseDto>(category);
        }
        public async Task<CategoryResponseDto> UpdateCategoryAsync(Guid id, CategoryDto categoryDto)
        {
            var userId = _jwtTokenService.GetUserIdFromToken();
            var existingCategory = await _context.Categories.FindAsync(id);
            if (existingCategory == null) return null;

            _mapper.Map(categoryDto, existingCategory);
            existingCategory.UpdatedBy = userId;
            _context.Categories.Update(existingCategory);
            await _context.SaveChangesAsync();
            return _mapper.Map<CategoryResponseDto>(existingCategory);
        }

        public async Task<bool> DeleteCategoryAsync(Guid id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return false;

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
