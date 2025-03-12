using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ResponseDto
{
    public class DelegatedLeadsResponseDto
    {
        public int TotalDelegatedLeadsCount { get; set; }
        public List<LeadResponseDto> DelegatedLeads { get; set; } = new List<LeadResponseDto>();
    }

}
