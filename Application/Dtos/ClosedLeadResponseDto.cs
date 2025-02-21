using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.ResponseDto;

namespace Application.Dtos
{
    public class ClosedLeadResponseDto
    {
        public Guid LeadId { get; set; }
        public List<LeadTrackingResponseDto> LeadTrackingRecords { get; set; }
    }
}
