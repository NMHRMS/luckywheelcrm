using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.ResponseDto;

namespace Application.Dtos
{
    public class ClosedLeadDto
    {
        public Guid LeadId { get; set; }
        public LeadResponseDto LeadDetails { get; set; }  // Added Lead Details
        public List<LeadTrackingResponseDto> LeadTrackingRecords { get; set; }
    }
}
