using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ResponseDto
{
    public class UserAssignmentMappingResponseDto
    {
        public Guid AssignerUserId { get; set; }
        public List<Guid> AssigneeUserIds { get; set; }
    }
}
