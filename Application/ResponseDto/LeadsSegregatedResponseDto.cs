using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ResponseDto
{
    public class LeadsSegregatedResponseDto
    {
        public IEnumerable<LeadResponseDto> NewLeads { get; set; } = new List<LeadResponseDto>();
        public IEnumerable<LeadResponseDto> DuplicateLeads { get; set; } = new List<LeadResponseDto>();
    }

}
