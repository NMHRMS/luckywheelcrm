using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.ResponseDto;

namespace Application.Interfaces
{
    public interface IBranchService
    {
        Task<IEnumerable<BranchResponseDto>> GetAllBranchesAsync();
        Task<BranchResponseDto?> GetBranchByIdAsync(Guid id);
        Task<BranchResponseDto> AddBranchAsync(AddBranchDto branchDto);
        Task<BranchResponseDto> UpdateBranchAsync(Guid id, AddBranchDto branchDto);
        Task<bool> DeleteBranchAsync(Guid id);
    }
}
