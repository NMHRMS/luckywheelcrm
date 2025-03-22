using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Domain.Models;

public partial class CallRecord
{
    public Guid RecordId { get; set; }
    public Guid? CompanyId { get; set; }
    public Guid? LeadId { get; set; }
    public Guid? UserId { get; set; }
    public string? Name { get; set; }
    public string? MobileNo { get; set; }
    public string? CallType { get; set; }
    public string? Recordings { get; set; }
    public DateTime? Date { get; set; }
    public TimeOnly? Duration { get; set; }
    public string? Status { get; set; }
    public bool IsSynced { get; set; } = false;
    public Guid? CreatedBy { get; set; }
    public DateTime CreateDate { get; set; }

    // Navigation properties
    public virtual Company Company { get; set; }
    public virtual Lead? Lead { get; set; }
    public virtual User? User { get; set; }
    public virtual User? CreatedByUser { get; set; }
}
