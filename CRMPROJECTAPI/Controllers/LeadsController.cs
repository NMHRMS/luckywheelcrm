using Application.Dtos;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Application.Services;
using Microsoft.AspNetCore.Authorization;

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

        [HttpPost("upload-excel")]
        public async Task<IActionResult> UploadLeads(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Invalid file");

            try
            {
                await _leadService.UploadLeadsFromExcelAsync(file);
                return Ok("Leads uploaded successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error uploading leads: {ex.Message}");
            }
        }

        [HttpGet("assigned/{userId}")]
        public async Task<IActionResult> GetAssignedLeads(Guid userId)
        {
            var assignedLeads = await _leadService.GetAssignedLeadsAsync(userId);
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
        [FromQuery] string? modelName,
        [FromQuery] string? dealerName)
        {
            var leads = await _leadService.SearchLeadsAsync(name, state, district, modelName, dealerName);
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
    }
}



















//using Application.Interfaces;
//using Domain.Models;
//using Microsoft.AspNetCore.Mvc;

//namespace CRMPROJECTAPI.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class LeadController : ControllerBase
//    {
//        private readonly ILeadService _leadService;

//        public LeadController(ILeadService leadService)
//        {
//            _leadService = leadService;
//        }

//        // GET: api/Lead
//        [HttpGet]
//        public async Task<IActionResult> GetAllLeads()
//        {
//            var leads = await _leadService.GetAllLeadsAsync();
//            return Ok(leads);
//        }

//        // GET: api/Lead/{id}
//        [HttpGet("{id}")]
//        public async Task<IActionResult> GetLeadById(int id)
//        {
//            var lead = await _leadService.GetLeadByIdAsync(id);
//            if (lead == null)
//                return NotFound();
//            return Ok(lead);
//        }

//        // POST: api/Lead
//        [HttpPost]
//        public async Task<IActionResult> AddLead([FromBody] Lead lead)
//        {
//            if (lead == null)
//                return BadRequest("Lead is null");

//            var result = await _leadService.AddLeadAsync(lead);
//            return CreatedAtAction(nameof(GetLeadById), new { id = result.Id }, result);
//        }

//        // PUT: api/Lead/{id}
//        [HttpPut("{id}")]
//        public async Task<IActionResult> UpdateLead(int id, [FromBody] Lead lead)
//        {
//            if (lead == null || id != lead.Id)
//                return BadRequest("Invalid request");

//            var updatedLead = await _leadService.UpdateLeadAsync(lead);
//            if (updatedLead == null)
//                return NotFound();
//            return Ok(updatedLead);
//        }

//        // DELETE: api/Lead/{id}
//        [HttpDelete("{id}")]
//        public async Task<IActionResult> DeleteLead(int id)
//        {
//            var result = await _leadService.DeleteLeadAsync(id);
//            if (!result)
//                return NotFound();
//            return NoContent();
//        }
//    }
//}
