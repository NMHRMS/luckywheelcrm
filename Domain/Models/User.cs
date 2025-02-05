using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models;

public partial class User
{
    public Guid CompanyId { get; set; }
    public Guid UserId { get; set; }
    public string FirstName { get; set; } = null!;
    public string? LastName { get; set; }
    public string EmailId { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string ContactNumber { get; set; } = null!;
    public Guid? BranchId { get; set; } 
    public Guid RoleId { get; set; }
    public DateTime CreateDate { get; set; }
    public DateTime? UpdateDate { get; set; }
    public virtual Company Company { get; set; } = null!;
    public virtual Branch? Branch { get; set; } 
    public virtual Role Role { get; set; } = null!;

    // Navigation Properties
    public virtual ICollection<Lead> Leads { get; set; } = new List<Lead>();
    public virtual ICollection<LeadTracking> AssignedToLeadTrackings { get; set; }
    public virtual ICollection<LeadTracking> AssignedByLeadTrackings { get; set; }
    public virtual ICollection<CallRecord> CallRecords { get; set; } = new List<CallRecord>();
    public virtual ICollection<VehicleInOutRecord> VehicleCheckInCheckOut  { get; set; } = new List<VehicleInOutRecord>();
    public virtual ICollection<UserAssignmentMapping> AssignedUsers { get; set; }  
    public virtual ICollection<UserAssignmentMapping> AssigneeUsers { get; set; } 

}
