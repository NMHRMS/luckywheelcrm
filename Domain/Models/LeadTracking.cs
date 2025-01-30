using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class LeadTracking
    {
        public Guid TrackID { get; set; }
        public Guid LeadID { get; set; }  
        public Guid AssignedTo { get; set; } 
        public Guid AssignedBy { get; set; } 
        public DateTime AssignedDate { get; set; } 

        // Navigation Properties
        public virtual Lead Lead { get; set; }
        public virtual User AssignedToUser { get; set; }
        public virtual User AssignedByUser { get; set; } 
    }

}
