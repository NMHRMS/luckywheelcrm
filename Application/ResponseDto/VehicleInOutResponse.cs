using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;

namespace Application.ResponseDto
{
    public class VehicleInOutResponse
    {
        public IEnumerable<VehicleInOutRecord> Records { get; set; }
        public int Count { get; set; }
    }
}
