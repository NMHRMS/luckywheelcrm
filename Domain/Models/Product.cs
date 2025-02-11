using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models;

public partial class Product
{
    public Guid ProductId { get; set; }
    public Guid CompanyId { get; set; }
    public Guid CategoryId { get; set; }        
    public string ProductName { get; set; }
    public DateTime CreateDate { get; set; }
    public DateTime? UpdateDate { get; set; }
    public virtual Company Company { get; set; } 
    public virtual Category Category { get; set; }
    public virtual ICollection<Lead> Leads { get; set; } = new List<Lead>();

}

