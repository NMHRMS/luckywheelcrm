using Application.Dtos;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
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

            try
            {
                await _leadAssignService.AssignLeadAsync(requestDto);
                return Ok(new { message = "Lead assigned successfully" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("lead-history/{leadId}")]
        public async Task<IActionResult> GetLeadHistory(Guid leadId)
        {
            var history = await _leadAssignService.GetLeadHistoryAsync(leadId);
            if (history == null || !history.Any())
            {
                return NotFound("No tracking history found for this lead.");
            }
            return Ok(history);
        }
    }
}
