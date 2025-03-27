using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ResponseDto
{
    public class CallTypeReportDto
    {
        public string CallType { get; set; }
        public int CallCount { get; set; }
        public string CallDuration { get; set; }
        public List<CallRecordResponseDto> CallRecords { get; set; }
    }
}
