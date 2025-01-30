using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models;

public partial class Role
{
    public Guid CompanyId { get; set; }
    public Guid RoleId { get; set; }
    public string RoleName { get; set; } = null!;
    public DateTime CreateDate { get; set; }
    public DateTime? UpdateDate { get; set; }
    public virtual Company Company { get; set; } = null!;
    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
