using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ResponseDto
{
    public class CompanyResponseDto
    {
        public Guid CompanyId { get; set; }
        public string Name { get; set; }
        public string CompanyContact { get; set; }
        public string? Address { get; set; }
        public string OwnerName { get; set; }
        public string? MobileNo { get; set; }
        public string EmailId { get; set; }
    }
}
