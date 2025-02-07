using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class UserAssignmentMappingDto
    {
        public Guid AssignerUserId { get; set; }
        public List<Guid> AssigneeUserIds { get; set; }
    }
}
