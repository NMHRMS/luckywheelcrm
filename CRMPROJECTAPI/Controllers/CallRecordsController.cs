using Application.Dtos;
using Application.Interfaces;
using Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CRMPROJECTAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CallRecordsController : ControllerBase
    {
        private readonly ICallRecordService _callRecordService;

        public CallRecordsController(ICallRecordService callRecordService)
        {
            _callRecordService = callRecordService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCallRecords()
        {
            var callRecords = await _callRecordService.GetAllCallRecordsAsync();
            return Ok(callRecords);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCallRecordById(Guid id)
        {
            var callRecord = await _callRecordService.GetCallRecordByIdAsync(id);
            if (callRecord == null) return NotFound();
            return Ok(callRecord);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCallRecord([FromBody] CallRecordDto callRecordDto)
        {
            var callRecord = await _callRecordService.AddCallRecordAsync(callRecordDto);

            if (callRecord == null) return BadRequest("Error adding call record");
            return Ok(callRecord);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCallRecord(Guid id, [FromBody] CallRecordDto callRecordDto)
        {
            var updatedCallRecord = await _callRecordService.UpdateCallRecordAsync(id, callRecordDto);
            if (updatedCallRecord == null) return NotFound();
            return Ok(updatedCallRecord);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCallRecord(Guid id)
        {
            await _callRecordService.DeleteCallRecordAsync(id);
            return NoContent();
        }
    }
}