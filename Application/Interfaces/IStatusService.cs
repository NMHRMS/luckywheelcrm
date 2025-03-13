using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.ResponseDto;

namespace Application.Interfaces
{
    public interface IStatusService
    {
        Task<IEnumerable<StatusResponseDto>> GetAllStatusesAsync();
        Task<StatusResponseDto?> GetStatusByIdAsync(Guid id);
        Task<StatusResponseDto> AddStatusAsync(StatusDto statusDto);
        Task<StatusResponseDto?> UpdateStatusAsync(Guid id, StatusDto statusDto);
        Task<bool> DeleteStatusAsync(Guid id);
    }
}
