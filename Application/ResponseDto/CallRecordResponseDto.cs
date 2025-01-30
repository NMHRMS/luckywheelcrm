using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ResponseDto
{
    public class CallRecordResponseDto
    {
        public Guid RecordId { get; set; }
        public Guid CompanyId { get; set; }
        public Guid LeadId { get; set; }
        public Guid UserId { get; set; }
        public byte[]? Recordings { get; set; } //audio files
        public DateTime? Date { get; set; }
        public TimeOnly? Duration { get; set; }
    }
}
