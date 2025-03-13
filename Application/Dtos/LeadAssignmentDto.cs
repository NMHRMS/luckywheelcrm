namespace Application.Dtos
{
    public class LeadAssignmentDto
    {
        public Guid LeadID { get; set; }
        public Guid AssignedTo { get; set; }  
        public DateTime AssignedDate { get; set; }    
    }
}