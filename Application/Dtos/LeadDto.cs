namespace Application.Dtos
{
    public class LeadDto
    {
        public Guid? CompanyId { get; set; }
        public string? LeadSourceName { get; set; }
        public string OwnerName { get; set; }
        public string MobileNo { get; set; }
        public string? StateName { get; set; }
        public string? DistrictName { get; set; }
        public string? CurrentAddress { get; set; }
        public string? RegistrationNo { get; set; }
        public DateTime? RegistrationDate { get; set; }
        public string? ChasisNo { get; set; }
        public string? CurrentVehicle { get; set; }
        public string? CategoryName { get; set; }
        public string? ProductName { get; set; }
        public string? ModelName { get; set; }
        public string? LeadType { get; set; }
        public string Status { get; set; }
        public bool? IsActive { get; set; } = true;
        public DateTime? FollowUpDate { get; set; }
        public string? AssignedToName { get; set; }
    }
}