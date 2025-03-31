using Application.Dtos;
using Application.ResponseDto;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface ILeadService
    {

        Task<(bool Success, string Message, int DeletedLeadsCount)> DeleteLeadsByExcelNameAsync(string excelName);
        Task<LeadReportResponseDto> GetLeadReportAsync(DateTime startDate, DateTime endDate);
        Task<List<UserLeadReportResponseDto>> GetUserLeadReportAsync(List<Guid> userIds, DateTime startDate, DateTime endDate, DateTime? date = null);
        Task<LeadsSegregatedResponseDto> GetLatestUploadedLeadsAsync();
        Task<DelegatedLeadsResponseDto> GetDelegatedLeadsAsync(DateTime? date, DateTime? startDate, DateTime? endDate);
        Task<LeadsSegregatedResponseDto> GetAllLeadsAsync();
        Task<LeadResponseDto?> GetLeadByIdAsync(Guid id);
        Task<LeadResponseDto> AddLeadAsync(LeadDto leadDto);
        Task<LeadResponseDto?> UpdateLeadAsync(Guid id, LeadDto leadDto);
        Task<LeadResponseDto?> UpdateLeadCallsAsync(Guid id, LeadCallUpdateDto updateDto);
        Task<bool> CheckIfFileExists(string fileName);
        Task UploadLeadsFromExcelAsync(IFormFile file, string fileName);
        Task<IEnumerable<LeadResponseDto>> GetAssignedLeadsAsync(Guid userId);
        Task<IEnumerable<LeadResponseDto>> GetLeadsByAssignmentAsync(bool assigned);
        Task<IEnumerable<LeadResponseDto>> SearchLeadsAsync(string? name, string? state, string? district, string? modelName);
        Task<IEnumerable<LeadResponseDto>> GetTodaysAssignedLeadsAsync(Guid userId);
        Task<DashboardLeadResponseDto> GetDashboardLeads();
        Task<UserLeadsStatusResponseDto> GetDashboardLeads(Guid userId);
        Task<bool> DeleteLeadAsync(Guid id);
        Task<LeadsByExcelNameResponseDto> GetLeadsByExcelName(string excelName);
        Task<List<LeadListResponseDto>> GetLeadsDataList();
        Task<GetDashboardStatusRespDto> GetDashboardListByUserId(Guid userId, DateTime date);
        Task<IEnumerable<LeadResponseDto>> GetTodaysFollowUpLeadsAsync(Guid userId);
        Task<IEnumerable<LeadResponseDto>> GetLeadsByFollowUpDateAsync(DateTime followUpDate);
        Task<IEnumerable<LeadResponseDto>> GetAssignedLeadsByFollowUpDateAsync(Guid userId, DateTime followUpDate);
        Task<IEnumerable<LeadResponseDto>> GetAssignedLeadsByAssignedDateRangeAsync(Guid userId, DateTime startDate, DateTime endDate);
        Task<IEnumerable<LeadResponseDto>> GetAssignedLeadsByFollowUpDateRangeAsync(Guid userId, DateTime startDate, DateTime endDate);
        Task<IEnumerable<LeadResponseDto>> GetLeadsByTimeFrameAsync(Guid userId, string timeframe);
    }
}
