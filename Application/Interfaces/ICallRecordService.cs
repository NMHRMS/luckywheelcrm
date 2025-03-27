using Application.Dtos;
using Application.ResponseDto;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface ICallRecordService
    {
        Task<CallRecordResponseDto> ProcessCallRecordAsync(CallRecordDto callRecordDto, IFormFile recording);
        Task<List<CallRecordResponseDto>> GetAllCallRecordsAsync();
        Task<List<CallRecordResponseDto>> GetAllUserRecordingsAsync(List<Guid> userIds, DateTime startDate, DateTime endDate, DateTime? date);
        Task<UserCallPerformanceReportDto> GetUserCallPerformanceReportAsync(List<Guid> userIds, DateTime startDate, DateTime endDate, DateTime? date);
        Task<List<HourlyCallStatsResponseDto>> GetHourlyCallStatisticsAsync(List<Guid> userIds, DateTime startDate, DateTime endDate, DateTime? date, List<(TimeSpan Start, TimeSpan End)> customTimeSlots);
        Task<bool> DeleteCallRecordAsync(Guid id);
        Task<CallRecordResponseDto?> GetCallRecordByIdAsync(Guid id);
        //Task<CallRecordResponseDto> UpdateCallRecordAsync(Guid id, CallRecordDto callRecordDto);
    }
}