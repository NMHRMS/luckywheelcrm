using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ResponseDto
{
    public class ProductResponseDto
    {
        public Guid ProductId { get; set; }
        public Guid CompanyId { get; set; }
        public string ProductName { get; set; }
    }
}
