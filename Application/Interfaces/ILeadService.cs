using Application.Dtos;
using Application.ResponseDto;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface ILeadService
    {
        Task<IEnumerable<LeadResponseDto>> GetAllLeadsAsync();
        Task<LeadResponseDto?> GetLeadByIdAsync(Guid id);
        Task<LeadResponseDto> AddLeadAsync(LeadDto leadDto);
        Task<LeadResponseDto?> UpdateLeadAsync(Guid id, LeadDto leadDto);
        Task UploadLeadsFromExcelAsync(IFormFile file);
        Task<IEnumerable<LeadResponseDto>> GetAssignedLeadsAsync(Guid userId);
        Task<IEnumerable<LeadResponseDto>> GetLeadsByAssignmentAsync(bool assigned);
        Task<IEnumerable<LeadResponseDto>> SearchLeadsAsync(string? name, string? state, string? district, string? modelName, string? dealerName);
        Task<IEnumerable<LeadResponseDto>> GetTodaysAssignedLeadsAsync(Guid userId);
        Task<bool> DeleteLeadAsync(Guid id);
        Task<DashboardLeadResponseDto> GetDashboardLeads();
    }
}
