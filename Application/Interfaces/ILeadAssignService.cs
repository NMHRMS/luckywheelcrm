using Application.Dtos;

namespace Application.Interfaces
{
    public interface ILeadAssignService
    {
        Task AssignLeadAsync(LeadAssignmentDto requestDto);
    }

}
