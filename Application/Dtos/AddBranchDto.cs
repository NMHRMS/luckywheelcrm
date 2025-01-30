using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class AddBranchDto
    {
        public Guid CompanyId { get; set; }
        public string Name { get; set; }
        public string? Contact { get; set; }
        public string? Address { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
