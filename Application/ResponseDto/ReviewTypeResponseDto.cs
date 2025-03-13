using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ResponseDto
{
    public class ReviewTypeResponseDto
    {
        public Guid ReviewId { get; set; }
        public Guid CompanyId { get; set; }
        public string ReviewType { get; set; }
    }
}
