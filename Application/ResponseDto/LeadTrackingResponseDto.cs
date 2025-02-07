using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ResponseDto
{
    public class LeadTrackingResponseDto
    {
        public Guid TrackId { get; set; }
        public Guid LeadId { get; set; }
        public Guid AssignedTo { get; set; }
        public string AssignedToName { get; set; }
        public Guid AssignedBy { get; set; }
        public string AssignedByName { get; set; }
        public DateTime AssignedDate { get; set; }
        public string LeadDuration { get; set; } // Duration in minutes
        public string LeadDurationFormatted { get; set; } // Duration in "X days Y hours" format
    }
}
