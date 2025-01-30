using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ResponseDto
{
    public class LeadTrackingResponseDto
    {
        public Guid TrackID { get; set; }
        public Guid LeadID { get; set; }
        public Guid AssignedTo { get; set; }
        public Guid AssignedBy { get; set; }
        public DateTime AssignedDate { get; set; }
    }
}
