using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.ResponseDto;

namespace Application.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<ProductResponseDto>> GetAllProductsAsync();
        Task<ProductResponseDto?> GetProductByIdAsync(Guid id);
        Task<ProductResponseDto> AddProductAsync(AddProductDto productDto);
        Task<ProductResponseDto?> UpdateProductAsync(Guid id, AddProductDto productDto);
        Task<bool> DeleteProductAsync(Guid id);
    }
}
