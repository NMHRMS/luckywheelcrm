using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class LeadRevertDto
    {
        public Guid LeadId { get; set; }
        public string Remark { get; set; }
    }
}
