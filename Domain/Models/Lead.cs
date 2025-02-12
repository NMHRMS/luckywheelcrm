namespace Domain.Models;

public partial class Lead
{
    public Guid LeadId { get; set; }
    public Guid? CompanyId { get; set; }
    public Guid? LeadSourceId { get; set; }
    public string? ExcelName { get; set; }
    public string OwnerName { get; set; }
    public string? FatherName { get; set; }
    public string MobileNo { get; set; }
    public Guid? DistrictId { get; set; }
    public Guid? StateId { get; set; }
    public string CurrentAddress { get; set; }
    public string? RegistrationNo { get; set; }
    public DateTime? RegistrationDate { get; set; }
    public int? ChasisNo { get; set; }
    public string? CurrentVehicle { get; set; }
    public Guid? CategoryId { get; set; }
    public Guid? ProductId { get; set; }
    public string? ModelName { get; set; }
    public string? LeadType { get; set; }
    public Guid? AssignedTo { get; set; }
    public DateTime? AssignedDate { get; set; }
    public DateTime? FollowUpDate { get; set; }
    public string? Remark { get; set; }
    public string? Status { get; set; }
    public DateTime CreateDate { get; set; }
    public DateTime? UpdateDate { get; set; }

    //Navigation properties
    public virtual User? AssignedToUser { get; set; }
    public virtual District? District { get; set; }
    public virtual State? State { get; set; }
    public virtual Company? Company { get; set; }
    public virtual Product? Product { get; set; }
    public virtual Category? Category { get; set; }
    public virtual LeadSource? LeadSource { get; set; }

    //Collection Properties
    public virtual ICollection<LeadTracking> LeadTrackings { get; set; } = new List<LeadTracking>();
    public virtual ICollection<CallRecord> CallRecords { get; set; } = new List<CallRecord>();
    public virtual ICollection<LeadReview> LeadsReview { get; set; } = new List<LeadReview>();
}