using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class AddProductDto
    {
        public Guid CompanyId { get; set; }
        public string ProductName { get; set; }
    }
}
