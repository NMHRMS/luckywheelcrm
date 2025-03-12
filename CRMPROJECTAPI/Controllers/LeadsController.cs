using Application.Dtos;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace CRMPROJECTAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class LeadsController : ControllerBase
    {
        private readonly ILeadService _leadService;

        public LeadsController(ILeadService leadService)
        {
            _leadService = leadService;
        }
        [HttpGet("report")]
        public async Task<IActionResult> GetLeadReport([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            DateTime start = startDate ?? DateTime.UtcNow.AddDays(-7); // Default: last 7 days
            DateTime end = endDate ?? DateTime.UtcNow;

            var report = await _leadService.GetLeadReportAsync(start, end);
            return Ok(report);
        }

        [HttpGet("user-report")]
        public async Task<IActionResult> GetUserLeadReport([FromQuery] Guid userId, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] DateTime? date)
        {
            if (userId == Guid.Empty)
                return BadRequest("UserId is required.");   

            DateTime start = startDate ?? DateTime.UtcNow.AddDays(-7); // Default: last 7 days
            DateTime end = endDate ?? DateTime.UtcNow;

            var report = await _leadService.GetUserLeadReportAsync(userId, start, end, date);
            return Ok(report);
        }

        [HttpGet("delegated-leads")]
        public async Task<IActionResult> GetDelegatedLeads([FromQuery] DateTime? date, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var response = await _leadService.GetDelegatedLeadsAsync(date,startDate, endDate);
            return Ok(response);
        }

        [HttpGet("latest-leads")]
        public async Task<IActionResult> GetLatestUploadedLeads()
        {
            var leads = await _leadService.GetLatestUploadedLeadsAsync();
            return Ok(leads);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllLeads()
        {
            var leads = await _leadService.GetAllLeadsAsync();
            return Ok(leads);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetLeadById(Guid id)
        {
            var lead = await _leadService.GetLeadByIdAsync(id);
            if (lead == null)
                return NotFound();
            return Ok(lead); 
        }

        [HttpPost]
        public async Task<IActionResult> AddLead([FromBody] LeadDto leadDto)
        {
            var addedLead = await _leadService.AddLeadAsync(leadDto);

            if (addedLead == null)
                return BadRequest("Error creating lead");

            return Ok(addedLead);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLead(Guid id, [FromBody] LeadDto leadDto)
        {
            if (leadDto == null)
                return BadRequest("Invalid lead data");

            var updatedLead = await _leadService.UpdateLeadAsync(id, leadDto);
            if (updatedLead == null)
                return NotFound();
            return Ok(updatedLead);
        }

        [HttpPut("update-call/{id}")]
        public async Task<IActionResult> UpdateLeadOnCalls(Guid id, [FromBody] LeadCallUpdateDto leadCallUpdate)
        {
            if(leadCallUpdate == null)
                return BadRequest("Invalid lead data");

            var updatedLead = await _leadService.UpdateLeadCallsAsync(id, leadCallUpdate);
            if(updatedLead == null)
                return NotFound("Lead not found.");
            return Ok(updatedLead);
        }

        [HttpPost("upload-excel")]
        public async Task<IActionResult> UploadLeads(IFormFile file, string fileName)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "Invalid file", latestLeads = (object)null });

            bool fileExists = await _leadService.CheckIfFileExists(fileName);
            if (fileExists)
            {
                return BadRequest(new { message = "A file with this name already exists. Please rename it before uploading.", latestLeads = (object)null });
            }

            try
            {
                await _leadService.UploadLeadsFromExcelAsync(file, fileName);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error uploading leads: {ex.Message}", latestLeads = (object)null });
            }

            var latestLeads = await _leadService.GetLatestUploadedLeadsAsync();

            return Ok(new
            {
                message = "Leads uploaded successfully.",
                latestLeads
            });
        }

        [HttpGet("assigned/{userId}")]
        public async Task<IActionResult> GetAssignedLeads(Guid userId)
        {
            var assignedLeads = await _leadService.GetAssignedLeadsAsync(userId);
            return Ok(assignedLeads);
        }

        [HttpGet("assigned_by_followUpDate/{userId}")]
        public async Task<IActionResult> GetAssignedLeadsByFollowUpDate(Guid userId)
        {
            var assignedLeads = await _leadService.GetTodaysFollowUpLeadsAsync(userId);
            return Ok(assignedLeads);
        }

        [HttpGet("filter")]
        public async Task<IActionResult> GetLeadsByAssignment([FromQuery] bool assigned)
        {
            var leads = await _leadService.GetLeadsByAssignmentAsync(assigned);
            return Ok(leads);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchLeads(
        [FromQuery] string? name,
        [FromQuery] string? state,
        [FromQuery] string? district,
        [FromQuery] string? modelName)
        {
            var leads = await _leadService.SearchLeadsAsync(name, state, district, modelName);
            return Ok(leads);
        }

        [HttpGet("todays-assigned")]
        public async Task<IActionResult> GetTodaysAssignedLeads([FromQuery] Guid userId)
        {
            var leads = await _leadService.GetTodaysAssignedLeadsAsync(userId);
            return Ok(leads);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLead(Guid id)
        {
            var result = await _leadService.DeleteLeadAsync(id);
            if (!result)
                return NotFound();
            return NoContent();
        }

        [HttpGet("dashboard_leads")]
        public async Task<IActionResult> GetDashboardLeads()
        {
            var leads = await _leadService.GetDashboardLeads();
            return Ok(leads);
        }

        [HttpGet("dashboard_leads_user")]
        public async Task<IActionResult> GetDashboardLeads(Guid userId)
        {
            var leads = await _leadService.GetDashboardLeads(userId);
            return Ok(leads);
        }

        [HttpGet("get_leads_by_excelname")]
        public async Task<IActionResult> GetLeadsByExcelName(string excelName)
        {
            var leads = await _leadService.GetLeadsByExcelName(excelName);
            return Ok(leads);
        }

        [HttpGet("get_leads_dataList")]
        public async Task<IActionResult> GetLeadsDataList()
        {
            var leads = await _leadService.GetLeadsDataList();
            return Ok(leads);
        }

        [HttpGet("get_dashboardlist_by_userId")]
        public async Task<IActionResult> GetDashboardListByUserId(Guid userId, DateTime date)
        {
            var leads = await _leadService.GetDashboardListByUserId(userId, date);
            return Ok(leads);
        }

        [HttpGet("by_followUpDate")]
        public async Task<IActionResult> GetLeadsByFollowUpDate([FromQuery] DateTime followUpDate)
        {
            var leads = await _leadService.GetLeadsByFollowUpDateAsync(followUpDate);

            if (!leads.Any())
                return NotFound("No leads found for the selected follow-up date.");

            return Ok(leads);
        }

        [HttpGet("leads_by_followUpDate")]
        public async Task<IActionResult> GetAssignedLeadsByFollowUpDate(Guid userId, DateTime followUpDate)
        {
            var leads = await _leadService.GetAssignedLeadsByFollowUpDateAsync(userId, followUpDate);
            return Ok(leads);
        }

        [HttpGet("assigned-leads-by-assigned-daterange")]
        public async Task<IActionResult> GetAssignedLeadsByAssignedDateRange(Guid userId, DateTime startDate, DateTime endDate)
        {
            var leads = await _leadService.GetAssignedLeadsByAssignedDateRangeAsync(userId, startDate, endDate);
            return Ok(leads);
        }

        [HttpGet("assigned-leads-by-followup-daterange")]
        public async Task<IActionResult> GetAssignedLeadsByFollowUpDateRange(Guid userId, DateTime startDate, DateTime endDate)
        {
            var leads = await _leadService.GetAssignedLeadsByFollowUpDateRangeAsync(userId, startDate, endDate);
            return Ok(leads);
        }

        [HttpGet("leads-by-timeframe")]
        public async Task<IActionResult> GetLeadsByTimeFrame(Guid userId, string timeframe)
        {
            var leads = await _leadService.GetLeadsByTimeFrameAsync(userId, timeframe);
            return Ok(leads);
        }

    }
}
