using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ResponseDto
{
    public class UserLeadReportResponseDto
    {
        public int TotalAssignedLeadsCount { get; set; }
        public int AssignedLeadsCount { get; set; }  
        public int DelegatedLeadsCount { get; set; }
        public int NotCalledCount { get; set; }
        public int NotConnectedCount { get; set; }
        public int ConnectedCount { get; set; }
        public int PendingCount { get; set; }
        public int PositiveCount { get; set; }
        public int NegativeCount { get; set; }
        public int ClosedCount { get; set; }
        public List<LeadResponseDto> AssignedLeads { get; set; }
        public List<LeadResponseDto> DelegatedLeads { get; set; }
    }

}
