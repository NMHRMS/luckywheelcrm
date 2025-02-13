namespace Application.Dtos
{
    public class LeadDto
    {
        public Guid? CompanyId { get; set; }
        public string? LeadSource { get; set; }
        public string OwnerName { get; set; }
        public string MobileNo { get; set; }
        public Guid? StateId { get; set; }
        public Guid? DistrictId { get; set; }
        public string CurrentAddress { get; set; }
        public string? RegistrationNo { get; set; }
        public DateTime? RegistrationDate { get; set; }
        public int? ChasisNo { get; set; }
        public string? CurrentVehicle { get; set; }
        public Guid? CategoryId { get; set; }
        public Guid? ProductId { get; set; }
        public string? ModelName { get; set; }
        public string? LeadType { get; set; }
        public string Status { get; set; }
        public DateTime? FollowUpDate { get; set; }
        public Guid? AssignedTo { get; set; }
    }
}