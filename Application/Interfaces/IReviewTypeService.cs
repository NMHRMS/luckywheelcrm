using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.ResponseDto;

namespace Application.Interfaces
{
    public interface IReviewTypeService
    {
        Task<IEnumerable<ReviewTypeResponseDto>> GetAllReviewTypesAsync();
        Task<ReviewTypeResponseDto?> GetReviewTypeByIdAsync(Guid id);
        Task<ReviewTypeResponseDto> AddReviewTypeAsync(ReviewTypeDto reviewTypeDto);
        Task<ReviewTypeResponseDto?> UpdateReviewTypeAsync(Guid id, ReviewTypeDto reviewTypeDto);
        Task<bool> DeleteReviewTypeAsync(Guid id);
    }
}
