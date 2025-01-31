using Application.Dtos;
using Application.Interfaces;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CRMPROJECTAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class LeadAssignController : ControllerBase
    {
        private readonly ILeadAssignService _leadAssignService;

        public LeadAssignController(ILeadAssignService leadAssignService)
        {
            _leadAssignService = leadAssignService;
        }

        [HttpPost("assign")]
        public async Task<IActionResult> AssignLead([FromBody] LeadAssignmentDto requestDto)
        {
            if (requestDto == null || requestDto.LeadID == Guid.Empty || requestDto.AssignedTo == Guid.Empty || requestDto.AssignedBy == Guid.Empty)
                return BadRequest("Invalid data");

            // Assume logged-in user ID is retrieved dynamically, e.g., from JWT token claims

            // Set the correct assignedBy value in the request DTO

            await _leadAssignService.AssignLeadAsync(requestDto);

            return Ok(new { message = "Lead assigned successfully" });
        }

      
    }
}
