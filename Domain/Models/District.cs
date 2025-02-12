using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class District
    {
        public Guid DistrictId { get; set; }
        public Guid StateId { get; set; }
        public string DistrictName { get; set; }
        public virtual State State { get; set; }

        public virtual ICollection<Lead> Leads { get; set; } = new List<Lead>();

    }
}
