using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class VehicleCheckOutDto
    {
        public string VehicleNo { get; set; }
        public string? CheckOutRemark { get; set; }
        public Guid? CheckOutBy { get; set; }
        public DateTime? CheckOutDate { get; set; }
    }
}
