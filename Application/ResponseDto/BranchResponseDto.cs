using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ResponseDto
{
    public class BranchResponseDto
    {
        public Guid BranchId { get; set; }
        public Guid CompanyId { get; set; }
        public string Name { get; set; }
        public string? Contact { get; set; }
        public string? Address { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
