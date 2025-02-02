using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ResponseDto
{
    public class LeadListResponseDto
    {
        public string ExcelName {  get; set; }
        public int TotalCount { get; set; }
        public int AssignedCount { get; set; }
        public int NotAssignedCount { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
