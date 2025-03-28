using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Application.Dtos
{
    public class CallRecordDto
    {
        public string? MobileNo { get; set; }
        public string? CallType { get; set; } // incoming outgoing missedcall
        public DateTime? Date { get; set; }
        public TimeOnly? Duration { get; set; }
        public string? RecordingKey { get; set; }
    }
}
