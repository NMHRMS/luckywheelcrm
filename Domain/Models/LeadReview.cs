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

    public DateOnly? ReviewDate { get; set; }

    public DateOnly FollowUpDate { get; set; } 

    public DateTime CreateDate { get; set; }

    public DateTime? UpdateDate { get; set; }

    public virtual Company Company { get; set; } = null!;

    public virtual Lead Lead { get; set; } = null!;
    
}
