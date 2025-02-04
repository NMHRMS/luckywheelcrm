using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class LeadReviewDto
    {
        public Guid CompanyId { get; set; }
        public Guid LeadId { get; set; }
        public string? Review { get; set; }
        public DateTime? ReviewDate { get; set; }
        public DateTime? FollowUpDate { get; set; }
    }
}
