using System.Text.RegularExpressions;
using Application.Dtos;
using Application.Interfaces;
using Application.ResponseDto;
using Application.Services;
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
        public async Task<IActionResult> SyncCallRecords([FromForm] string callRecordsJson,[FromForm] List<IFormFile> recordings)
        {
            try
            {
                var callRecords = JsonConvert.DeserializeObject<List<CallRecordDto>>(callRecordsJson);
                if (callRecords == null || !callRecords.Any())
                {
                    return BadRequest("Call records are missing or improperly formatted.");
                }

                var responseDtos = new List<CallRecordResponseDto>();

                foreach (var callRecord in callRecords)
                {
                    IFormFile? matchedRecording = null;

                    // Try to find a recording that matches the mobile number
                    if (recordings != null)
                    {
                        foreach (var recording in recordings)
                        {
                            var fileName = Path.GetFileNameWithoutExtension(recording.FileName);

                            // Extract mobile number from filename (assuming it contains mobile number)
                            var extractedMobileNo = ExtractMobileNumber(fileName);

                            if (extractedMobileNo == callRecord.MobileNo)
                            {
                                matchedRecording = recording;
                                break; // Stop checking once a match is found
                            }
                        }
                    }

                    try
                    {
                        var responseDto = await _callRecordService.ProcessCallRecordAsync(callRecord, matchedRecording);
                        if (responseDto != null)
                        {
                            responseDtos.Add(responseDto);
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Skipping record for {callRecord.MobileNo}: {ex.Message}");
                    }
                }

                return Ok(responseDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error syncing call records: {ex.Message}");
            }
        }

        // Function to extract mobile number from file name
        private string? ExtractMobileNumber(string fileName)
        {
            var match = Regex.Match(fileName, @"\d{10}"); // Looks for a 10-digit number
            return match.Success ? match.Value : null;
        }
        

        [HttpGet("GetAllCallRecords")]
        public async Task<IActionResult> GetAllCallRecords()
        {
            var records = await _callRecordService.GetAllCallRecordsAsync();
            return Ok(records);
        }

        [HttpGet("user/{userId}/recordings")]
        public async Task<IActionResult> GetAllUserRecordings(Guid userId)
        {
            var recordings = await _callRecordService.GetAllUserRecordingsAsync(userId);
            return Ok(recordings);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCallRecord(Guid id)
        {
            await _callRecordService.DeleteCallRecordAsync(id);
            return NoContent();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCallRecordById(Guid id)
        {
            var callRecord = await _callRecordService.GetCallRecordByIdAsync(id);
            if (callRecord == null) return NotFound();
            return Ok(callRecord);
        }

        //[HttpPut("{id}")]
        //public async Task<IActionResult> UpdateCallRecord(Guid id, [FromBody] CallRecordDto callRecordDto)
        //{
        //    var updatedCallRecord = await _callRecordService.UpdateCallRecordAsync(id, callRecordDto);
        //    if (updatedCallRecord == null) return NotFound();
        //    return Ok(updatedCallRecord);
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
