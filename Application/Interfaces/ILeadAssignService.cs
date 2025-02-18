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
    }

}
