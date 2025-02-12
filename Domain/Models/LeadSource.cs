using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class LeadSource
    {
        public Guid SourceId { get; set; }
        public Guid CompanyId { get; set; }
        public string SourceName { get; set; }
        public virtual Company Company { get; set; }
        public virtual ICollection<Lead> Leads { get; set; } = new List<Lead>();
    }
}
