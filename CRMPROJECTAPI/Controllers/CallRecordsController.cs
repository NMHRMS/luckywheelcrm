using System.Text.RegularExpressions;
using Application.Dtos;
using Application.Interfaces;
using Application.ResponseDto;
using Application.Services;
using Infrastructure.Utilities;
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

        [HttpPost("sync")] //old
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

                  //  Try to find a recording that matches the mobile number
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

                    // Try to find a recording that matches the RecordingKey exactly
                    if (!string.IsNullOrEmpty(callRecord.RecordingKey) && recordings != null)
                    {
                        matchedRecording = recordings.FirstOrDefault(r => r.FileName.Equals(callRecord.RecordingKey, StringComparison.OrdinalIgnoreCase));
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


        [HttpPost("syncRecords")] //new 
        public async Task<IActionResult> SyncAllCallRecords([FromForm] string callRecordsJson, [FromForm] List<IFormFile> recordings)
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

                    // Try to find a recording that matches the RecordingKey exactly
                    if (!string.IsNullOrEmpty(callRecord.RecordingKey) && recordings != null)
                    {
                        matchedRecording = recordings.FirstOrDefault(r => r.FileName.Equals(callRecord.RecordingKey, StringComparison.OrdinalIgnoreCase));
                    }

                    try
                    {
                        var responseDto = await _callRecordService.SyncCallRecordAsync(callRecord, matchedRecording);
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


        //Function to extract mobile number from file name (not in new)
        private string? ExtractMobileNumber(string fileName)
        {
            // Match numbers with or without country code (+91)
            var match = Regex.Match(fileName, @"(\+91)?\d{10}");

            if (match.Success)
            {
                string number = match.Value;

                // Remove country code if present (+91)
                if (number.StartsWith("+91"))
                {
                    number = number.Substring(3); // Extract last 10 digits
                }

                return number;
            }

            return null;
        }


        [HttpGet("GetAllCallRecords")]
        public async Task<IActionResult> GetAllCallRecords()
        {
            var records = await _callRecordService.GetAllCallRecordsAsync();
            return Ok(records);
        }

        [HttpGet("user/recordings")]
        public async Task<IActionResult> GetAllUserRecordings([FromQuery] List<Guid> userIds, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] DateTime? date)
        {
            if (userIds == null || userIds.Count == 0)
                return BadRequest("At least one userId must be provided.");

            // Get Indian Standard Time (IST)
            DateTime indianTime = DateTimeHelper.GetIndianTime();

            // If no startDate is provided, default to the beginning of the week
            startDate ??= indianTime.Date.AddDays(-7);
            endDate ??= indianTime.Date;

            var callRecords = await _callRecordService.GetAllUserRecordingsAsync(userIds, startDate.Value, endDate.Value, date);

            if (callRecords == null || callRecords.Count == 0)
                return NotFound("No call recordings found for the given criteria.");

            return Ok(callRecords);
        }


        [HttpGet("GetUserCallPerformanceReport")]
        public async Task<IActionResult> GetUserCallPerformanceReport([FromQuery] List<Guid> userIds, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] DateTime? date)
        {
            if (userIds == null || userIds.Count == 0)
                return BadRequest("At least one userId must be provided.");

            DateTime indianTime = DateTimeHelper.GetIndianTime();

            startDate ??= indianTime.Date.AddDays(-7);
            endDate ??= indianTime.Date;


            var report = await _callRecordService.GetUserCallPerformanceReportAsync(userIds, startDate.Value, endDate.Value, date);

            return Ok(report);
        }


        [HttpGet("GetHourlyCallStatistics")]
        public async Task<IActionResult> GetHourlyCallStatistics([FromQuery] List<Guid> userIds, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] DateTime? date, [FromQuery] List<string>? customSlots)
        {
            var currentTime = DateTimeHelper.GetIndianTime();

            if (!startDate.HasValue)
                startDate = currentTime.Date;
            if (!endDate.HasValue)
                endDate = currentTime.Date;

            List<(TimeSpan Start, TimeSpan End)> customTimeSlots = null;
            if (customSlots != null && customSlots.Any())
            {
                customTimeSlots = customSlots
                    .Select(slot =>
                    {
                        var parts = slot.Split('-');
                        return (TimeSpan.Parse(parts[0].Trim()), TimeSpan.Parse(parts[1].Trim()));
                    }).ToList();
            }

            var result = await _callRecordService.GetHourlyCallStatisticsAsync(userIds, startDate.Value, endDate.Value, date, customTimeSlots);
            return Ok(result);
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
