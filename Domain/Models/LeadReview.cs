using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models;

public partial class LeadReview
{
    public Guid LeadId { get; set; }

    public Guid CompanyId { get; set; }
    
    public Guid LeadReviewId { get; set; }

    public string? Review {  get; set; }

    public Guid? ReviewBy { get; set; }

    public DateTime? ReviewDate { get; set; }

    public DateTime FollowUpDate { get; set; } 

    public DateTime CreateDate { get; set; }

    public DateTime? UpdateDate { get; set; }

    public virtual Company Company { get; set; }

    public virtual Lead Lead { get; set; }

    public virtual User ReviewByUser { get; set; }
    
}
