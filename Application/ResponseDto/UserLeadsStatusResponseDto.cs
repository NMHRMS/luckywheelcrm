using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;

namespace Application.Dtos
{
    public class UserLeadsStatusResponseDto
    {
        public IEnumerable<Lead> Leads { get; set; }
        public int TotalAssignedCount { get; set; }
        public int InterestedCount { get; set; }
        public int NotInterestedCount { get; set; }

        public int NotCalledCount { get; set; }
        public int ConnectedCount { get; set; }
        public int NotConnectedCount { get; set; }
        public int PendingCount { get; set; }
        public int ClosedCount { get; set; }

    }
}
