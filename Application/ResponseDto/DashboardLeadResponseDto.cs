using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;

namespace Application.ResponseDto
{
    public class DashboardLeadResponseDto
    {
        public IEnumerable<LeadResponseDto> leads { get; set; }
        public int totalLeadsCount { get; set; }
    }
}
