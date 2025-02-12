using Application.Dtos;
using Application.ResponseDto;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface ILeadService
    {
        Task<LeadsSegregatedResponseDto> GetAllLeadsAsync();
        Task<LeadResponseDto?> GetLeadByIdAsync(Guid id);
        Task<LeadResponseDto> AddLeadAsync(LeadDto leadDto);
        Task<LeadResponseDto?> UpdateLeadAsync(Guid id, LeadDto leadDto);
        Task<LeadResponseDto?> UpdateLeadCallsAsync(Guid id, LeadCallUpdateDto updateDto);
        Task UploadLeadsFromExcelAsync(IFormFile file);
        Task<IEnumerable<LeadResponseDto>> GetAssignedLeadsAsync(Guid userId);
        Task<IEnumerable<LeadResponseDto>> GetLeadsByAssignmentAsync(bool assigned);
        Task<IEnumerable<LeadResponseDto>> SearchLeadsAsync(string? name, string? state, string? district, string? modelName);
        Task<IEnumerable<LeadResponseDto>> GetTodaysAssignedLeadsAsync(Guid userId);
        Task<DashboardLeadResponseDto> GetDashboardLeads();
        Task<bool> DeleteLeadAsync(Guid id);
        Task<LeadsByExcelNameResponseDto> GetLeadsByExcelName(string excelName);
        Task<List<LeadListResponseDto>> GetLeadsDataList();
        Task<GetDashboardStatusRespDto> GetDashboardListByUserId(Guid userId, DateTime date);
        Task<IEnumerable<LeadResponseDto>> GetTodaysFollowUpLeadsAsync(Guid userId);
    }
}
