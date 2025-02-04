using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class LeadAssignmentDto
    {
        public Guid LeadID { get; set; }
        public Guid AssignedTo { get; set; }  
        public Guid AssignedBy { get; set; }  
        public DateTime AssignedDate { get; set; }    
    }
}