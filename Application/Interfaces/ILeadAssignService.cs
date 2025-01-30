using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.ResponseDto;

namespace Application.Interfaces
{
    public interface ILeadAssignService
    {
        Task AssignLeadAsync(LeadAssignmentDto requestDto);
    }

}

        //Task<bool> AssignLeadAsync(LeadAssignmentDto assignmentDto);
        //Task<List<LeadTrackingDto>> GetLeadHistoryAsync(int leadId);
        //Task<List<LeadDto>> GetUserAssignedLeadsAsync(int userId);