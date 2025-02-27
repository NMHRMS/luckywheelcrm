using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;

namespace Application.ResponseDto
{
    public class ClosedLeadResponseDto
    {
        public int TotalClosedLeads { get; set; }
        public List<ClosedLeadDto> Leads { get; set; }
    }
}
