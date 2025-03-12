using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models;
public class Branch
{
    public Guid BranchId {  get; set; }
    public Guid CompanyId { get; set; }
    public string Name { get; set; } = null!;
    public string? Contact { get; set; } 
    public string? Address { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreateDate { get; set; } 
    public Guid? CreatedBy{ get; set; } 
    public DateTime? UpdateDate { get; set; }
    public Guid? UpdatedBy { get; set; }
    public virtual Company Company { get; set; } = null!;

    public virtual User? CreatedByUser { get; set; }
    public virtual User? UpdatedByUser { get; set; }
    public virtual ICollection<User> Users { get; set; } = new List<User>();
    public virtual ICollection<VehicleInOutRecord> VehicleCheckInCheckOut { get; set; } = new List<VehicleInOutRecord>();

}

