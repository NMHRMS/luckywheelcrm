using Application.Dtos;
using Application.Interfaces;
using Application.Services;
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
            if (requestDto == null || requestDto.LeadID == Guid.Empty || requestDto.AssignedTo == Guid.Empty)
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

        [HttpPost("revert")]
        public async Task<IActionResult> RevertLeadAssignment([FromBody] LeadRevertDto request)
        {
            try
            {
                var response = await _leadAssignService.RevertLeadAssignmentAsync(request);
                return Ok(new { message = "Lead assignment reverted successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpGet("rejected-leads")]
        public async Task<IActionResult> GetRejectedLeadsForCRM()
        {
            var revertedLeads = await _leadAssignService.GetRevertedLeadsAsync();
            return Ok(revertedLeads);
        }

    }
}
