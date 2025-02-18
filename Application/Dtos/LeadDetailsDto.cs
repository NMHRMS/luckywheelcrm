using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.ResponseDto;

namespace Application.Dtos
{
    public class LeadDetailsDto
    {
        public Guid LeadId { get; set; }
        public string LeadStatus { get; set; }
        public List<LeadTrackingResponseDto> TrackingHistory { get; set; }
    }
}
