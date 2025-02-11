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
    public string FirstName { get; set; }
    public string? LastName { get; set; }
    public string EmailId { get; set; }
    public string Password { get; set; }
    public string ContactNumber { get; set; }
    public Guid? BranchId { get; set; }
    public Guid RoleId { get; set; }
    public Guid? CategoryId { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreateDate { get; set; }
    public DateTime? UpdateDate { get; set; }

    // Navigation Properties
    public virtual Company Company { get; set; }
    public virtual Branch? Branch { get; set; }
    public virtual Role Role { get; set; }
    public virtual Category Category { get; set; }

    //Colection Properties
    public virtual ICollection<Lead> Leads { get; set; } = new List<Lead>();
    public virtual ICollection<LeadTracking> AssignedToLeadTrackings { get; set; }
    public virtual ICollection<LeadTracking> AssignedByLeadTrackings { get; set; }
    public virtual ICollection<CallRecord> CallRecords { get; set; } = new List<CallRecord>();
    public virtual ICollection<VehicleInOutRecord> VehicleCheckInCheckOut { get; set; } = new List<VehicleInOutRecord>();
 
    // Many-to-Many Relationship
    public List<User> AssignedUsers { get; set; } = new();
    public List<User> AssigneeUsers { get; set; } = new();
}
