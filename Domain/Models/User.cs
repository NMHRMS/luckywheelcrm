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
    //public string? FireBaseId { get; set; }
    public DateTime CreateDate { get; set; }
    public Guid? CreatedBy { get; set; }
    public DateTime? UpdateDate { get; set; }
    public Guid? UpdatedBy { get; set; }

    // Navigation Properties
    public virtual Company Company { get; set; }
    public virtual Branch? Branch { get; set; }
    public virtual Role Role { get; set; }
    public virtual Category Category { get; set; }
    public virtual User? CreatedByUser { get; set; }
    public virtual User? UpdatedByUser { get; set; }


    //Colection Properties
    public virtual ICollection<Lead> Leads { get; set; } = new List<Lead>();
    public virtual ICollection<Role> Roles { get; set; } = new List<Role>();
    public virtual ICollection<Company> Companies { get; set; } = new List<Company>();
    public virtual ICollection<Category> Categories { get; set; } = new List<Category>();
    public virtual ICollection<District> Districts { get; set; } = new List<District>();
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    public virtual ICollection<State> States { get; set; } = new List<State>();
    public virtual ICollection<Status> Statuses { get; set; } = new List<Status>();
    public virtual ICollection<Branch> Branches { get; set; } = new List<Branch>();
    public virtual ICollection<LeadReview> LeadsReview { get; set; } = new List<LeadReview>();
    public virtual ICollection<ReviewsType> ReviewsType { get; set; } = new List<ReviewsType>();
    public virtual ICollection<LeadSource> LeadsSource { get; set; } = new List<LeadSource>();
    public virtual ICollection<LeadTracking> AssignedToLeadTrackings { get; set; }
    public virtual ICollection<LeadTracking> AssignedByLeadTrackings { get; set; }
    public virtual ICollection<CallRecord> CallRecords { get; set; } = new List<CallRecord>();
    public virtual ICollection<VehicleInOutRecord> VehicleCheckInCheckOut { get; set; } = new List<VehicleInOutRecord>();
    public virtual ICollection<User> CreatedUsers { get; set; } = new List<User>();
    public virtual ICollection<User> UpdatedUsers { get; set; } = new List<User>();

    // Many-to-Many Relationship
    public List<User> AssignedUsers { get; set; } = new();
    public List<User> AssigneeUsers { get; set; } = new();
}
