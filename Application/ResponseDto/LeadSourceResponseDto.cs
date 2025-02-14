using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ResponseDto
{
    public class LeadSourceResponseDto
    {
        public Guid SourceId { get; set; }
        public Guid CompanyId { get; set; }
        public string SourceName { get; set; }
    }
}
