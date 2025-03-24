using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Application.Dtos
{
    public class CallRecordSyncRequest
    {
        public List<CallRecordDto> CallRecords { get; set; } = new();
        public List<IFormFile> Files { get; set; } = new();
    }

}
