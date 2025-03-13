using Application.Dtos;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CRMPROJECTAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatuesController : ControllerBase
    {
        private readonly IStatusService _statusService;

        public StatuesController(IStatusService statusService)
        {
            _statusService = statusService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllStatus()
        {
            var result = await _statusService.GetAllStatusesAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStatusById(Guid id)
        {
            var result = await _statusService.GetStatusByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateStatus(StatusDto statusDto)
        {
            var status = await _statusService.AddStatusAsync(statusDto);

            if (status == null) return BadRequest();
            return Ok(status);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStatus(Guid id, StatusDto statusDto)
        {
            var updatedStatus = await _statusService.UpdateStatusAsync(id, statusDto);
            if (updatedStatus == null) return NotFound();
            return Ok(updatedStatus);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _statusService.DeleteStatusAsync(id);
            return NoContent();
        }
    }
}
