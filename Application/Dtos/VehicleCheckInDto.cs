using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class VehicleCheckInDto
    {
        public Guid BranchId { get; set; }
        public Guid CompanyId { get; set; }
        public string VehicleNo { get; set; }
        public string CheckInReason { get; set; }
        public Guid CheckInBy { get; set; }
        public DateTime? CheckInDate { get; set; }
        //public string Status { get; set; }

    }
}
