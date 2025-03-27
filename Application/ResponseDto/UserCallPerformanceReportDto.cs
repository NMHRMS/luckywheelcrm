using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ResponseDto
{
    public class UserCallPerformanceReportDto
    {
        public int TotalCalls { get; set; }
        public string TotalDuration { get; set; } // Formatted as "HH:mm:ss"
        public List<CallTypeReportDto> CallDetails { get; set; }
    }

}
