using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ResponseDto
{
    public class CategoryResponseDto
    {
        public Guid CategoryId { get; set; }
        public Guid CompanyId { get; set; }
        public string CategoryName { get; set; }
    }
}
