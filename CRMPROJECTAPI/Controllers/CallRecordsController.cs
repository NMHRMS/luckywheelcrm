using Application.Dtos;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRMPROJECTAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CallRecordsController : ControllerBase
    {
        private readonly ICallRecordService _callRecordService;

        public CallRecordsController(ICallRecordService callRecordService)
        {
            _callRecordService = callRecordService;
        }


        [HttpPost("sync")]
        public async Task<IActionResult> SyncCallRecords([FromForm] List<CallRecordDto> callRecords, [FromForm] IFormFile file)
        {
            var response = await _callRecordService.SyncCallRecords(callRecords, file);
            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCallRecords()
        {
            var response = await _callRecordService.GetAllCallRecords();
            return Ok(response);
        }

        //[HttpGet]
        //public async Task<IActionResult> GetAllCallRecords()
        //{
        //    var callRecords = await _callRecordService.GetAllCallRecordsAsync();
        //    return Ok(callRecords);
        //}

        //[HttpGet("{id}")]
        //public async Task<IActionResult> GetCallRecordById(Guid id)
        //{
        //    var callRecord = await _callRecordService.GetCallRecordByIdAsync(id);
        //    if (callRecord == null) return NotFound();
        //    return Ok(callRecord);
        //}

        //[HttpPut("{id}")]
        //public async Task<IActionResult> UpdateCallRecord(Guid id, [FromBody] CallRecordDto callRecordDto)
        //{
        //    var updatedCallRecord = await _callRecordService.UpdateCallRecordAsync(id, callRecordDto);
        //    if (updatedCallRecord == null) return NotFound();
        //    return Ok(updatedCallRecord);
        //}

        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteCallRecord(Guid id)
        //{
        //    await _callRecordService.DeleteCallRecordAsync(id);
        //    return NoContent();
        //}
    }
}
        //[HttpPost("add-call-record")]
        //public async Task<IActionResult> CreateCallRecord([FromForm] CallRecordDto callRecordDto, IFormFile? recordings)
        //{
        //    var result = await _callRecordService.AddCallRecordAsync(callRecordDto, recordings);

        //    if (result == null) return BadRequest("Error adding call record");

        //    return Ok(result);
        //}
