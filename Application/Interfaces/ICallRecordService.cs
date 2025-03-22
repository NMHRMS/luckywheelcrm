using Application.Dtos;
using Application.ResponseDto;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface ICallRecordService
    {

        Task<List<CallRecordResponseDto>> SyncCallRecords(List<CallRecordDto> callRecords, IFormFile file);
        Task<List<CallRecordResponseDto>> GetAllCallRecords();

        //Task<IEnumerable<CallRecordResponseDto>> GetAllCallRecordsAsync();
        //Task<CallRecordResponseDto?> GetCallRecordByIdAsync(Guid id);
        //Task<CallRecordResponseDto> UpdateCallRecordAsync(Guid id, CallRecordDto callRecordDto);
        //Task<bool> DeleteCallRecordAsync(Guid id);
    }
}