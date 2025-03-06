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
        public virtual Company Company { get; set; } 
    }
}
