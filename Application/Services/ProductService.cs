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
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Application.Services
{
    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IJwtTokenService _jwtTokenService;
        public ProductService(ApplicationDbContext context, IMapper mapper, IJwtTokenService jwtTokenService)
        {
            _context = context;
            _mapper = mapper;
            _jwtTokenService = jwtTokenService;
        }
        public async Task<IEnumerable<ProductResponseDto>> GetAllProductsAsync()
        {
            var products = await _context.Products.ToListAsync();
            return _mapper.Map<IEnumerable<ProductResponseDto>>(products);
        }
        public async Task<ProductResponseDto?> GetProductByIdAsync(Guid id)
        {
            var product = await _context.Products.FindAsync(id);
            return product == null ? null : _mapper.Map<ProductResponseDto>(product);
        }
        public async Task<ProductResponseDto> AddProductAsync(AddProductDto productDto)
        {
            var userId = _jwtTokenService.GetUserIdFromToken();
            var product = _mapper.Map<Product>(productDto);
            product.ProductId = Guid.NewGuid();   
            product.CreatedBy = userId;
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return _mapper.Map<ProductResponseDto>(product);
        }
        public async Task<ProductResponseDto?> UpdateProductAsync(Guid id, AddProductDto productDto)
        {
            var userId = _jwtTokenService.GetUserIdFromToken();
            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null) return null;

            _mapper.Map(productDto, existingProduct);
            existingProduct.UpdatedBy = userId;
            _context.Products.Update(existingProduct);
            await _context.SaveChangesAsync();
            return _mapper.Map<ProductResponseDto>(existingProduct);
        }
        public async Task<bool> DeleteProductAsync(Guid id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
