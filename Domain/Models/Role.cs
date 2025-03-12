namespace Domain.Models;

public partial class Role
{
    public Guid CompanyId { get; set; }
    public Guid RoleId { get; set; }
    public string RoleName { get; set; }
    public DateTime CreateDate { get; set; }
    public Guid? CreatedBy { get; set; }
    public DateTime? UpdateDate { get; set; }
    public Guid? UpdatedBy { get; set; }

    public virtual Company Company { get; set; }
    public virtual User? CreatedByUser { get; set; }
    public virtual User? UpdatedByUser { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
