using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;

namespace Application.ResponseDto
{
    public class LeadsByExcelNameResponseDto
    {
        public IEnumerable<Lead> Leads { get; set; }
        public int TotalLeadsCount { get; set; }
        public int AssignedLeadsCount { get; set; }
        public int NotAssignedLeadsCount { get; set; }
    }
}
