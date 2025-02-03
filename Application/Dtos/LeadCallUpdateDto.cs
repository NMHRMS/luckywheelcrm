using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class LeadCallUpdateDto
    {
        public string Status { get; set; }
        public DateTime? FollowUpDate { get; set; }
        public string? Remark { get; set; }
        public string? LeadType { get; set; }
        public Guid AssignedTo { get; set; }
    }
}
