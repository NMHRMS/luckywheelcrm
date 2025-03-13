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
        public DateTime CreateDate { get; set; }
        public Guid? CreatedBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public Guid? UpdatedBy { get; set; }

        public virtual User? CreatedByUser { get; set; }
        public virtual User? UpdatedByUser { get; set; }
        public virtual Company Company { get; set; }
        public virtual ICollection<Lead> Leads { get; set; } = new List<Lead>();
    }
}
