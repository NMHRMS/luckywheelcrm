using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Application.ResponseDto
{
    public class CallRecordResponseDto
    {
        public Guid RecordId { get; set; }
        public Guid? CompanyId { get; set; }
        public Guid? UserId { get; set; }
        public string? UserName { get; set; }
        public string? Name { get; set; }
        public string? MobileNo { get; set; }
        public string? CallType { get; set; }
        public string? Recordings { get; set; }
        public DateTime? Date { get; set; }
        public TimeOnly? Duration { get; set; }
        public string? Status { get; set; }
    }
}
