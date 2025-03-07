using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Status
    {
        public Guid StatusId { get; set; }
        public Guid CompanyId { get; set; }
        public string StatusType { get; set; }
        public virtual Company Company { get; set; }
    }
}
