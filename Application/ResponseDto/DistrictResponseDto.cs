using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;

namespace Application.ResponseDto
{
    public class DistrictResponseDto
    {
        public Guid DistrictId { get; set; }
        public Guid StateId { get; set; }
        public string DistrictName { get; set; }
    }
}
