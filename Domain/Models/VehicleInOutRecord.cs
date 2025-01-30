using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models;
public class VehicleInOutRecord
{
    public Guid Id { get; set; } 

    public Guid BranchId { get; set; } 

    public Guid CompanyId { get; set; } 
    
    public string VehicleNo { get; set; }

    public string CheckInImage { get; set; } // Stores the binary data for the Check-in image

    public string CheckInReason { get; set; }

    public Guid CheckInBy { get; set; } 
    
    public DateTime CheckInDate { get; set; } 

    public string? CheckOutImage { get; set; } // Stores the binary data for the Check-out image (nullable)

    public string? CheckOutRemark { get; set; }

    public Guid? CheckOutBy { get; set; } 

    public DateTime? CheckOutDate { get; set; }

    public string Status { get; set; }

    public Branch Branch { get; set; } 

    public Company Company { get; set; }

    public User? CheckInUser { get; set; }

    public User? CheckOutUser { get; set; }

}
