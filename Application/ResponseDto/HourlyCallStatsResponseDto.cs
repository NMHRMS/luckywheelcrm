using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ResponseDto
{
    public class HourlyCallStatsResponseDto
    {
        public string TimeSlot { get; set; }
        public int TotalCalls { get; set; }
        public int TotalConnectedCalls { get; set; }
        public string TotalDuration { get; set; }
        public double TotalCallsPercentage { get; set; }
        public double ConnectedCallsPercentage { get; set; }
        public double TotalDurationPercentage { get; set; }
    }

}
