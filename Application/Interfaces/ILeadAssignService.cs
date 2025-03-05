using Application.Dtos;
using Application.ResponseDto;

namespace Application.Interfaces
{
    public interface ILeadAssignService
    {
        Task AssignLeadAsync(LeadAssignmentDto requestDto);
        Task<IEnumerable<LeadTrackingResponseDto>> GetLeadHistoryAsync(Guid leadId);
        Task<LeadResponseDto> RevertLeadAssignmentAsync(LeadRevertDto requestDto);
        Task<IEnumerable<LeadResponseDto>> GetRevertedLeadsAsync();
        Task<ClosedLeadResponseDto> GetClosedLeadsAsync();
        Task<List<WorkedUsersResponseDto>> GetUsersWhoWorkedOnClosedLead(Guid leadId);
        Task<ClosedLeadResponseDto> GetClosedLeadsByUserAsync(Guid userId);
        Task<ClosedLeadResponseDto> GetClosedLeadsByDateAsync(Guid userId, DateTime date);
        Task<ClosedLeadResponseDto> GetClosedLeadsByDateRangeAsync(Guid userId, DateTime startDate, DateTime endDate);
    }

}
