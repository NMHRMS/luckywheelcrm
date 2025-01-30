using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models;

public partial class CallRecord
{
    public Guid CompanyId { get; set; }

    public Guid RecordId { get; set; }

    public Guid LeadId { get; set; }
    
    public Guid UserId { get; set; }   
    
    public byte[]? Recordings { get; set; } //audio files
    
    public DateTime? Date { get; set; }
    
    public TimeOnly? Duration { get; set; }
    
    public DateTime CreateDate { get; set; }
    
    //Navigation property
    public virtual Company Company { get; set; } = null!;
    public virtual Lead Lead { get; set; } = null!;
    public virtual User User { get; set; } = null!;

}
