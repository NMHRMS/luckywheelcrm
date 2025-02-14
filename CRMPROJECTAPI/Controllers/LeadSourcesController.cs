using Application.Dtos;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CRMPROJECTAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeadSourcesController : ControllerBase
    {
        private readonly ILeadSourceService _leadSourceService;

        public LeadSourcesController(ILeadSourceService leadSourceService)
        {
            _leadSourceService = leadSourceService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllLeadSourcees()
        {
            var leadsourcees = await _leadSourceService.GetAllLeadSourcesAsync();
            return Ok(leadsourcees);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetLeadSourceById(Guid id)
        {
            var leadsource = await _leadSourceService.GetLeadSourceByIdAsync(id);
            if (leadsource == null) return NotFound();
            return Ok(leadsource);
        }

        [HttpPost]
        public async Task<IActionResult> CreateLeadSource([FromBody] AddLeadSourceDto leadSourceDto)
        {
            var leadSource = await _leadSourceService.AddLeadSourceAsync(leadSourceDto);
            if (leadSource == null)
                return BadRequest("Error creating lead source.");

            return Ok(leadSource);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLeadSource(Guid id, [FromBody] AddLeadSourceDto leadSourceDto)
        {
            var updatedLeadSource = await _leadSourceService.UpdateLeadSourceAsync(id, leadSourceDto);
            if (updatedLeadSource == null) return NotFound();
            return Ok(updatedLeadSource);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLeadSource(Guid id)
        {
            await _leadSourceService.DeleteLeadSourceAsync(id);
            return NoContent();
        }
    }
}
