using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class UserAssignmentMapping
    {
        public Guid Id { get; set; }
        public Guid AssignerUserId { get; set; }
        public Guid AssigneeUserId { get; set; }

        // Navigation properties
        public User Assigner { get; set; }
        public User Assignee { get; set; }
    }

}
