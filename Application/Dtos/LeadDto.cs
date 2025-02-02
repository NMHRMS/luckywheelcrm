    using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;

namespace Application.Dtos
{
    public class LeadDto
    {
        public Guid CompanyId { get; set; }
        public string? LeadSource { get; set; }
        public string OwnerName { get; set; }
        public string MobileNo { get; set; }
        public string DistrictName { get; set; }
        public string CurrentAddress { get; set; }
        public string StateName { get; set; }
        public string? ModelName { get; set; }
        public string? DealerName { get; set; }
        public Guid ProductId { get; set; }
        public string LeadType { get; set; }
        public string Status { get; set; }
        public DateTime? FollowUpDate { get; set; }
        public Guid? AssignedTo { get; set; }
    }
}