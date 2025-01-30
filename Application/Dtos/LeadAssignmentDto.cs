using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class LeadAssignmentDto
    {
        public Guid LeadID { get; set; }
        public Guid AssignedTo { get; set; }  // New assignee ID
        public Guid AssignedBy { get; set; }  // Current user ID
        public DateTime AssignedDate { get; set; }    
    }

}
/*
 
 To dynamically capture the currently logged-in user's ID for AssignedBy, you should retrieve it from the authentication token (JWT claims) or the current user context in your application.

Steps to Get Logged-in User Dynamically
1. Using JWT Token Claims (Recommended Approach)
If your application uses JWT authentication, you can extract the logged-in user ID from the claims within the controller.

Modify LeadTrackingController.cs to retrieve user ID:

csharp
Copy
Edit
[HttpPost("assign")]
public async Task<IActionResult> AssignLead([FromBody] LeadAssignmentRequestDto requestDto)
{
    if (requestDto == null || requestDto.LeadID == 0 || requestDto.AssignedTo == 0)
        return BadRequest("Invalid data");

    // Extract logged-in user ID from JWT token claims
    var assignedBy = GetLoggedInUserId();
    if (assignedBy == null)
    {
        return Unauthorized("User is not authenticated.");
    }

    // Set the correct assignedBy value
    requestDto.AssignedBy = assignedBy.Value;

    await _leadTrackingService.AssignLeadAsync(requestDto);

    return Ok(new { message = "Lead assigned successfully" });
}

// Helper method to get the logged-in user's ID from JWT token
private int? GetLoggedInUserId()
{
    var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId"); // Ensure this matches your token claim name
    if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
    {
        return userId;
    }
    return null;
}
Explanation:

User.Claims: Retrieves all claims from the current authenticated user.
UserId: Ensure this matches the claim name set during token generation.
Returns the user ID or an unauthorized error if authentication fails.
2. Using HttpContext Accessor (Alternate Approach)
If JWT isn't used but session-based authentication is, you can retrieve the logged-in user via IHttpContextAccessor service.

Steps:

Register IHttpContextAccessor in Program.cs:
csharp
Copy
Edit
builder.Services.AddHttpContextAccessor();
Modify the service to retrieve the user dynamically:
csharp
Copy
Edit
public class LeadTrackingService
{
    private readonly ApplicationDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public LeadTrackingService(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task AssignLeadAsync(LeadAssignmentRequestDto requestDto)
    {
        var userId = _httpContextAccessor.HttpContext.User.Claims
                      .FirstOrDefault(c => c.Type == "UserId")?.Value;

        if (userId == null)
            throw new UnauthorizedAccessException("User is not authenticated.");

        requestDto.AssignedBy = int.Parse(userId);

        var lead = await _context.Leads.FindAsync(requestDto.LeadID);
        if (lead == null)
        {
            throw new Exception("Lead not found");
        }

        lead.AssignedTo = requestDto.AssignedTo;
        _context.Leads.Update(lead);

        var leadTracking = new LeadTracking
        {
            LeadID = requestDto.LeadID,
            AssignedTo = requestDto.AssignedTo,
            AssignedBy = requestDto.AssignedBy,
            AssignedDate = DateTime.UtcNow
        };

        await _context.LeadTrackings.AddAsync(leadTracking);
        await _context.SaveChangesAsync();
    }
}
Explanation:

IHttpContextAccessor is used to access the current HTTP request context and retrieve claims.
 */