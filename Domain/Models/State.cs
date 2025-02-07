using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class State
    {
        public Guid StateId { get; set; }
        public string StateName { get; set; }
        public virtual ICollection<District> Districts { get; set; } = new List<District>();
    }
}
