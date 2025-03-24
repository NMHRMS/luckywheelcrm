using Application.Dtos;
using Application.Interfaces;
using Application.ResponseDto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

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
        public async Task<IActionResult> SyncCallRecords(
         [FromForm] string callRecordsJson,
         [FromForm] List<IFormFile> recordings)
        {
            try
            {
                // Deserialize callRecordsJson to List<CallRecordDto>
                var callRecords = JsonConvert.DeserializeObject<List<CallRecordDto>>(callRecordsJson);

                if (callRecords == null || !callRecords.Any())
                {
                    return BadRequest("Call records are missing or improperly formatted.");
                }

                var responseDtos = new List<CallRecordResponseDto>();

                for (int i = 0; i < callRecords.Count; i++)
                {
                    // Handle recording if available, else null
                    IFormFile? recording = (recordings.Count > i) ? recordings[i] : null;

                    var responseDto = await _callRecordService.ProcessCallRecordAsync(callRecords[i], recording);
                    responseDtos.Add(responseDto);
                }

                return Ok(responseDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error syncing call records: {ex.Message}");
            }
        }
        [HttpGet("GetAllCallRecords")]
        public async Task<IActionResult> GetAllCallRecords()
        {
            var records = await _callRecordService.GetAllCallRecordsAsync();
            return Ok(records);
        }

        //[HttpPost("sync")]
        //public async Task<IActionResult> SyncCallRecords([FromForm] CallRecordSyncRequest request)
        //{
        //    if (request.CallRecords == null || !request.CallRecords.Any())
        //    {
        //        return BadRequest("At least one call record must be provided.");
        //    }

        //    if (request.Files == null || !request.Files.Any())
        //    {
        //        return BadRequest("At least one recording file must be uploaded.");
        //    }

        //    var response = await _callRecordService.SyncCallRecords(request);
        //    return Ok(response);
        //}
        //[HttpPost("sync")]
        //public async Task<IActionResult> SyncCallRecords([FromForm] string callRecords, [FromForm] List<IFormFile> files)
        //{
        //    var responseList = await _callRecordService.SyncCallRecords(callRecords, files);
        //    return Ok(responseList);
        //}

        //[HttpGet]
        //public async Task<IActionResult> GetAllCallRecords()
        //{
        //    var records = await _callRecordService.GetAllCallRecords();
        //    return Ok(records);
        //}

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
