using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ResponseDto
{
    public class LeadDetailsResponseDto
    {
        public Guid LeadId { get; set; }
        public Guid CompanyId { get; set; }
        public string OwnerName { get; set; }
        public string MobileNo { get; set; }
        public string Status { get; set; }
        public string ProductName { get; set; }
        public string ModelName { get; set; }
        public List<LeadReviewResponseDto> LeadsReview { get; set; } = new List<LeadReviewResponseDto>();
    }

}
