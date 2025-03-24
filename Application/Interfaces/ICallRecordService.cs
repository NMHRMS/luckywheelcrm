using Application.Dtos;
using Application.ResponseDto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Application.Interfaces
{
    public interface ICallRecordService
    {
        Task<CallRecordResponseDto> ProcessCallRecordAsync(CallRecordDto callRecordDto, IFormFile recording);
        Task<List<CallRecordResponseDto>> GetAllCallRecordsAsync();

        //Task<IEnumerable<CallRecordResponseDto>> GetAllCallRecordsAsync();
        //Task<CallRecordResponseDto?> GetCallRecordByIdAsync(Guid id);
        //Task<CallRecordResponseDto> UpdateCallRecordAsync(Guid id, CallRecordDto callRecordDto);
        //Task<bool> DeleteCallRecordAsync(Guid id);
    }
}