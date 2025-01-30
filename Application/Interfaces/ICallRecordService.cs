using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.ResponseDto;

namespace Application.Interfaces
{
    public interface ICallRecordService
    {
        Task<IEnumerable<CallRecordResponseDto>> GetAllCallRecordsAsync();
        Task<CallRecordResponseDto?> GetCallRecordByIdAsync(Guid id);
        Task<CallRecordResponseDto> AddCallRecordAsync(CallRecordDto callRecordDto);
        Task<CallRecordResponseDto> UpdateCallRecordAsync(Guid id, CallRecordDto callRecordDto);
        Task<bool> DeleteCallRecordAsync(Guid id);
    }
}
