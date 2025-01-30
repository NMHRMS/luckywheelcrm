using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models;

public partial class Lead
{
    public Guid LeadId { get; set; }
    public Guid CompanyId { get; set; }
    public string? LeadSource { get; set; }
    public string? ExcelName { get; set; }
    public string OwnerName { get; set; } = null!;
    public string? FatherName { get; set; }
    public string MobileNo { get; set; } = null!;
    public string? OfficeName { get; set; }
    public string DistrictName { get; set; } = null!;
    public string CurrentAddress { get; set; } = null!;
    public string? RegistrationNo { get; set; }
    public DateTime? RegistrationDate { get; set; }
    public string? VehicleClass { get; set; }
    public string StateName { get; set; } = null!;
    public int? LadenWeight { get; set; }
    public string? ModelName { get; set; }
    public string? DealerName { get; set; }
    public Guid ProductId { get; set; }
    public string LeadType { get; set; } = null!;
    public Guid? AssignedTo { get; set; }
    public DateTime? AssignedDate { get; set; }
    public DateTime? FollowUpDate { get; set; }
    public string? Remark { get; set; }
    public string Status { get; set; } 
    public DateTime CreateDate { get; set; }
    public DateTime? UpdateDate { get; set; }
    
    // Navigation Properties
    //public virtual User? User { get; set; }
    public virtual User AssignedToUser { get; set; }
    public virtual Company Company { get; set; } = null!;
    public virtual Product Product { get; set; } = null!;
    // Collection Properties
    public virtual ICollection<LeadTracking> LeadTrackings { get; set; } 
    public virtual ICollection<CallRecord> CallRecords { get; set; } = new List<CallRecord>();
    public virtual ICollection<LeadReview> LeadsReview { get; set; } = new List<LeadReview>();

}

