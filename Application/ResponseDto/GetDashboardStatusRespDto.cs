using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;

namespace Application.ResponseDto
{
    public class GetDashboardStatusRespDto
    {
        public IEnumerable<Lead> Leads { get; set; }
        public int AssignedLeadsCount { get; set; }
        public int PositiveLeadsCount { get; set; }
        public int NegativeLeadsCount { get; set; }
        public int ClosedLeadsCount { get; set; }
    }
}
