using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ResponseDto
{
    public class VehicleCheckOutResponseDto
    {
        public Guid Id { get; set; }
        public string VehicleNo { get; set; }
        public string? CheckOutImage { get; set; }
        public string? CheckOutRemark { get; set; }
        public Guid? CheckOutBy { get; set; }
        public DateTime? CheckOutDate { get; set; }
        public string Status { get; set; }
    }
}
