using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ResponseDto
{
    public class RoleResponseDto
    {
        public Guid RoleId { get; set; }
        public Guid CompanyId { get; set; }
        public string RoleName { get; set; }
    }
}
