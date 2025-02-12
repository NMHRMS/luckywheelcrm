using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ResponseDto
{
    public class LeadsSegregatedResponseDto
    {
        public IEnumerable<LeadResponseDto> NewLeads { get; set; }
        public int NewLeadsCount { get; set; }

        public IEnumerable<LeadResponseDto> DuplicateLeads { get; set; }
        public int DuplicateLeadsCount { get; set; }

        public IEnumerable<LeadResponseDto> BlockedLeads { get; set; }
        public int BlockedLeadsCount { get; set; }
    }


}
