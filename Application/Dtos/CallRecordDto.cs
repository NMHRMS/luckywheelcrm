﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Application.Dtos
{
    public class CallRecordDto
    {
        public Guid? CompanyId { get; set; }
        public Guid? UserId { get; set; }
        public Guid? LeadId { get; set; }
        public string? Name { get; set; }
        public string? MobileNo { get; set; }
        public string? CallType { get; set; } // incoming outgoing missedcall
        public DateTime? Date { get; set; }
        public TimeOnly? Duration { get; set; }
        public string? Status { get; set; } 
    }
}
