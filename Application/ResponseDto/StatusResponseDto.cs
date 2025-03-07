using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ResponseDto
{
    public class StatusResponseDto
    {
        public Guid StatusId { get; set; }
        public Guid CompanyId { get; set; }
        public string StatusType { get; set; }
    }
}
