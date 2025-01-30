using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.ResponseDto;

namespace Application.Interfaces
{
    public interface ILeadReviewService
    {
        Task<IEnumerable<LeadReviewResponseDto>> GetAllLeadsReviewAsync();
        Task<LeadReviewResponseDto?> GetLeadReviewByIdAsync(Guid id);
        Task<LeadReviewResponseDto> AddLeadReviewAsync(LeadReviewDto leadReviewDto);
        Task<LeadReviewResponseDto> UpdateLeadReviewAsync(Guid id, LeadReviewDto leadReviewDto);
        Task<bool> DeleteLeadReviewAsync(Guid id);
    }
}
