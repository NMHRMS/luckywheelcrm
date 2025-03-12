using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class ReviewsType
    {
        public Guid ReviewId { get; set; }
        public Guid CompanyId { get; set; }
        public string? ReviewType { get; set; }
        public DateTime CreateDate { get; set; }
        public Guid? CreatedBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public Guid? UpdatedBy { get; set; }
        public virtual Company Company { get; set; }
        public virtual User? CreatedByUser { get; set; }
        public virtual User? UpdatedByUser { get; set; }

    }
}
