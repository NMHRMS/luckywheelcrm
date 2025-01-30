using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ResponseDto
{
    public class LeadResponseDto
    {
        public Guid LeadId { get; set; }
        public Guid CompanyId { get; set; }
        public string? LeadSource { get; set; }
        public string? ExcelName { get; set; }
        public string OwnerName { get; set; }
        public string? FatherName { get; set; }
        public string MobileNo { get; set; }
        public string? OfficeName { get; set; }
        public string DistrictName { get; set; }
        public string CurrentAddress { get; set; }
        public string? RegistrationNo { get; set; }
        public DateTime? RegistrationDate { get; set; }
        public string? VehicleClass { get; set; }
        public string StateName { get; set; }
        public int? LadenWeight { get; set; }
        public string? ModelName { get; set; }
        public string? DealerName { get; set; }
        public Guid ProductId { get; set; }
        public string LeadType { get; set; }
        public Guid? AssignedTo { get; set; }
        public DateTime? AssignedDate { get; set; }
        public DateTime? FollowUpDate { get; set; }
        public string? Remark { get; set; }
        public string Status { get; set; }
    }
}
