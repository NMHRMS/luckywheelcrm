using Application.Dtos;
using Application.Interfaces;
using Application.ResponseDto;
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

        [HttpGet("reverted-leads")]
        public async Task<IActionResult> GetRevertedLeads()
        {
            var revertedLeads = await _leadAssignService.GetRevertedLeadsAsync();
            return Ok(revertedLeads);
        }

        [HttpGet("closed")]
        public async Task<ActionResult<ClosedLeadResponseDto>> GetClosedLeads()
        {
            return Ok(await _leadAssignService.GetClosedLeadsAsync());
        }

        [HttpGet("closed-lead/users/{leadId}")]
        public async Task<IActionResult> GetUsersWhoWorkedOnClosedLead(Guid leadId)
        {
            var users = await _leadAssignService.GetUsersWhoWorkedOnClosedLead(leadId);

            if (users == null || !users.Any())
            {
                return NotFound("No users found for this closed lead.");
            }

            return Ok(users);
        }

        [HttpGet("closed/user")]
        public async Task<ActionResult<ClosedLeadResponseDto>> GetClosedLeadsByUser(Guid userId)
        {
            return Ok(await _leadAssignService.GetClosedLeadsByUserAsync(userId));
        }

        [HttpPost("closed/date")]
        public async Task<ActionResult<ClosedLeadResponseDto>> GetClosedLeadsByDate(Guid userId, DateTime date)
        {
            return Ok(await _leadAssignService.GetClosedLeadsByDateAsync(userId, date));
        }

        [HttpPost("closed/daterange")]
        public async Task<ActionResult<ClosedLeadResponseDto>> GetClosedLeadsBetweenDates(Guid userId, DateTime startDate, DateTime endDate)
        {
            return Ok(await _leadAssignService.GetClosedLeadsByDateRangeAsync(userId, startDate, endDate));
        }
    }
}
