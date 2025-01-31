using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;

namespace Application.Dtos
{
    public class DashboardLeadResponseDto
    {
        public IEnumerable<Lead> leads { get; set; }
        public int totalLeadsCount { get; set; }
    }
}
