using System.Linq;
using Application.Dtos;
using Application.Interfaces;
using Application.ResponseDto;
using AutoMapper;
using Domain.Models;
using Infrastructure.Data;
using Infrastructure.Utilities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class CallRecordService : ICallRecordService
    {
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly IJwtTokenService _jwtTokenService;

        public CallRecordService(IMapper mapper, ApplicationDbContext context, IWebHostEnvironment environment, IJwtTokenService jwtTokenService)
        {
            _mapper = mapper;
            _context = context;
            _environment = environment;
            _jwtTokenService = jwtTokenService;
        }

        //old
        public async Task<CallRecordResponseDto> ProcessCallRecordAsync(CallRecordDto callRecordDto, IFormFile? recording)
        {
            // Find the active lead associated with the mobile number
            var lead = await _context.Leads
                .FirstOrDefaultAsync(l => l.MobileNo == callRecordDto.MobileNo && l.IsActive == true);

            if (lead == null)
            {
                return null;
            }

            // Get UserId from Token
            var userId = _jwtTokenService.GetUserIdFromToken();

            string? recordingFileName = null;

            // Save the recording file if provided
            if (recording != null && recording.Length > 0)
            {
                var recordingsFolder = Path.Combine(_environment.WebRootPath, "recordings");
                if (!Directory.Exists(recordingsFolder))
                {
                    Directory.CreateDirectory(recordingsFolder);
                }

                var fileExtension = Path.GetExtension(recording.FileName);
                recordingFileName = $"{Guid.NewGuid()}{lead.MobileNo}{fileExtension}";
                var recordingFilePath = Path.Combine(recordingsFolder, recordingFileName);

                using (var stream = new FileStream(recordingFilePath, FileMode.Create))
                {
                    await recording.CopyToAsync(stream);
                }
            }

            // Map CallRecordDto to CallRecord entity
            var callRecord = _mapper.Map<CallRecord>(callRecordDto);
            callRecord.RecordId = Guid.NewGuid();
            callRecord.CompanyId = lead.CompanyId;
            callRecord.LeadId = lead.LeadId;
            callRecord.UserId = userId;
            callRecord.Name = lead.OwnerName;
            callRecord.Recordings = recordingFileName;
            callRecord.Status = lead.Status;
            callRecord.CreateDate = DateTimeHelper.GetIndianTime();
            callRecord.CreatedBy = userId;


            // Save to database
            _context.CallRecords.Add(callRecord);
            await _context.SaveChangesAsync();

            // Map to CallRecordResponseDto
            var responseDto = _mapper.Map<CallRecordResponseDto>(callRecord);
            responseDto.Recordings = recordingFileName != null ? $"recordings/{recordingFileName}" : null;

            var user = await _context.Users.FindAsync(userId);
            responseDto.UserName = user?.FirstName;

            return responseDto;
        }

        //new
        public async Task<CallRecordResponseDto> SyncCallRecordAsync(CallRecordDto callRecordDto, IFormFile? recording)
        {
            // Find the active lead associated with the mobile number
            var lead = await _context.Leads
                .FirstOrDefaultAsync(l => l.MobileNo == callRecordDto.MobileNo && l.IsActive == true);

            if (lead == null)
            {
                return null;
            }

            // Get UserId from Token
            var userId = _jwtTokenService.GetUserIdFromToken();

            string? recordingFileName = callRecordDto.RecordingKey;

            // Save the recording file if provided
            if (recording != null && recording.Length > 0)
            {
                var recordingsFolder = Path.Combine(_environment.WebRootPath, "recordings");
                if (!Directory.Exists(recordingsFolder))
                {
                    Directory.CreateDirectory(recordingsFolder);
                }

                var fileExtension = Path.GetExtension(recording.FileName);
                recordingFileName = $"{Guid.NewGuid()}_{lead.MobileNo}{fileExtension}";
                var recordingFilePath = Path.Combine(recordingsFolder, recordingFileName);

                using (var stream = new FileStream(recordingFilePath, FileMode.Create))
                {
                    await recording.CopyToAsync(stream);
                }
            }

            // Map CallRecordDto to CallRecord entity
            var callRecord = _mapper.Map<CallRecord>(callRecordDto);
            callRecord.RecordId = Guid.NewGuid();
            callRecord.CompanyId = lead.CompanyId;
            callRecord.LeadId = lead.LeadId;
            callRecord.UserId = userId;
            callRecord.Name = lead.OwnerName; 
            callRecord.Recordings = recordingFileName;
            callRecord.Status = lead.Status;
            callRecord.CreateDate = DateTimeHelper.GetIndianTime();
            callRecord.CreatedBy = userId;

            // Save to database
            _context.CallRecords.Add(callRecord);
            await _context.SaveChangesAsync();

            // Map to CallRecordResponseDto
            var responseDto = _mapper.Map<CallRecordResponseDto>(callRecord);
            responseDto.Recordings = recordingFileName != null ? $"recordings/{recordingFileName}" : null;

            var user = await _context.Users.FindAsync(userId);
            responseDto.UserName = user?.FirstName; 

            return responseDto;
        }

        public async Task<DateTime?> GetLatestCallRecordDateAsync()
        {
            // Get UserId from Token
            var userId = _jwtTokenService.GetUserIdFromToken();

            // Find the latest call record for this user
            var latestDate = await _context.CallRecords
                .Where(cr => cr.UserId == userId)
                .OrderByDescending(cr => cr.Date)
                .Select(cr => cr.Date)
                .FirstOrDefaultAsync();

            return latestDate;
        }

        public async Task<List<CallRecordResponseDto>> GetAllCallRecordsAsync()
        {
            var callRecords = await _context.CallRecords
                .Include(c => c.Lead)   
                .Include(c => c.User)
                .OrderByDescending(c => c.CreateDate)
                .ToListAsync();

            var responseList = new List<CallRecordResponseDto>();

            foreach (var record in callRecords)
            {
                var responseDto = _mapper.Map<CallRecordResponseDto>(record);

                // Build the full URL/path for the recording file
                responseDto.Recordings = string.IsNullOrEmpty(record.Recordings)? null : $"recordings/{record.Recordings}";
                // Map UserName
                responseDto.UserName = record.User?.FirstName;

                responseList.Add(responseDto);
            }

            return responseList;
        }

        public async Task<List<CallRecordResponseDto>> GetCallRecordsWithoutRecordingsAsync(Guid userId)
        {
            var callRecords = await _context.CallRecords
                .OrderByDescending(cr => cr.CreateDate)
                .Where(cr => cr.UserId == userId && cr.Recordings == null)
                .ToListAsync();

            return _mapper.Map<List<CallRecordResponseDto>>(callRecords);
        }

        public async Task<List<CallRecordResponseDto>> GetAllUserRecordingsAsync(List<Guid> userIds, DateTime startDate, DateTime endDate, DateTime? date)
        {
            var callRecordsQuery = _context.CallRecords
                .Where(cr => userIds.Contains((Guid)cr.UserId));

            if (date.HasValue)
            {
                callRecordsQuery = callRecordsQuery.Where(cr => cr.Date.Value.Date == date.Value.Date);
            }
            else
            {
                callRecordsQuery = callRecordsQuery.Where(cr => cr.Date.Value.Date >= startDate && cr.Date.Value.Date <= endDate);
            }

            var callRecords = await callRecordsQuery.ToListAsync();
            return _mapper.Map<List<CallRecordResponseDto>>(callRecords);
        }

        //public async Task<UserCallPerformanceReportDto> GetUserCallPerformanceReportAsync(List<Guid> userIds, DateTime startDate, DateTime endDate, DateTime? date)
        //{
        //    var callRecordsQuery = _context.CallRecords
        //        .Where(cr => userIds.Contains((Guid)cr.UserId));


        //    // Apply date filters
        //    if (date.HasValue)
        //    {
        //        callRecordsQuery = callRecordsQuery.Where(cr => cr.Date.Value.Date == date.Value.Date);
        //    }
        //    else
        //    {
        //        callRecordsQuery = callRecordsQuery.Where(cr => cr.Date.Value.Date >= startDate && cr.Date.Value.Date <= endDate);
        //    }

        //    var callRecords = await callRecordsQuery.ToListAsync();

        //    if (!callRecords.Any())
        //    {
        //        return new UserCallPerformanceReportDto
        //        {
        //            TotalCalls = 0,
        //            TotalDuration = "00:00:00",
        //            CallDetails = new List<CallTypeReportDto>()
        //        };
        //    }

        //    // Group by CallType
        //    var groupedCalls = callRecords.GroupBy(cr => cr.CallType)
        //        .Select(group => new CallTypeReportDto
        //        {
        //            CallType = group.Key,
        //            CallCount = group.Count(),
        //            CallDuration = FormatTotalDuration(group.Sum(cr => ConvertToTimeSpan(cr.Duration).Ticks)),
        //            CallRecords = _mapper.Map<List<CallRecordResponseDto>>(group.ToList())
        //        })
        //        .ToList();

        //    // Calculate Total Calls & Total Duration
        //    var totalCalls = callRecords.Count;
        //    var totalDuration = FormatTotalDuration(callRecords.Sum(cr => ConvertToTimeSpan(cr.Duration).Ticks));

        //    return new UserCallPerformanceReportDto
        //    {
        //        TotalCalls = totalCalls,
        //        TotalDuration = totalDuration,
        //        CallDetails = groupedCalls
        //    };
        //}

        public async Task<UserCallPerformanceReportDto> GetUserCallPerformanceReportAsync(List<Guid> userIds, DateTime startDate, DateTime endDate, DateTime? date)
        {
            var callRecordsQuery = _context.CallRecords
                .Include(cr => cr.User)
                .Where(cr => userIds.Contains((Guid)cr.UserId));

            // Apply date filters
            if (date.HasValue)
            {
                callRecordsQuery = callRecordsQuery.Where(cr => cr.Date.Value.Date == date.Value.Date);
            }
            else
            {
                callRecordsQuery = callRecordsQuery.Where(cr => cr.Date.Value.Date >= startDate && cr.Date.Value.Date <= endDate);
            }

            var callRecords = await callRecordsQuery.ToListAsync();

            if (!callRecords.Any())
            {
                return new UserCallPerformanceReportDto
                {
                    TotalCalls = 0,
                    TotalDuration = "00:00:00",
                    CallDetails = new List<CallTypeReportDto>()
                };
            }

            // Group by CallType
            var groupedCalls = callRecords.GroupBy(cr => cr.CallType)
                .Select(group => new CallTypeReportDto
                {
                    CallType = group.Key,
                    CallCount = group.Count(),
                    CallDuration = FormatTotalDuration(group.Sum(cr => ConvertToTimeSpan(cr.Duration).Ticks)),
                    CallRecords = _mapper.Map<List<CallRecordResponseDto>>(group.ToList()) 
                })
                .ToList();

            // Calculate Total Calls & Total Duration
            var totalCalls = callRecords.Count;
            var totalDuration = FormatTotalDuration(callRecords.Sum(cr => ConvertToTimeSpan(cr.Duration).Ticks));

            return new UserCallPerformanceReportDto
            {
                TotalCalls = totalCalls,
                TotalDuration = totalDuration,
                CallDetails = groupedCalls
            };
        }

        public async Task<List<HourlyCallStatsResponseDto>> GetHourlyCallStatisticsAsync(List<Guid> userIds, DateTime startDate, DateTime endDate, DateTime? date, List<string> customTimeSlots)
        {
            var callRecordsQuery = _context.CallRecords
                .Include(cr => cr.User)
                .Where(cr => userIds.Contains((Guid)cr.UserId));

            if (date.HasValue)
            {
                callRecordsQuery = callRecordsQuery.Where(cr => cr.Date.Value.Date == date.Value.Date);
            }
            else
            {
                callRecordsQuery = callRecordsQuery.Where(cr => cr.Date.Value.Date >= startDate && cr.Date.Value.Date <= endDate);
            }

            var callRecords = await callRecordsQuery.ToListAsync();

            // Default time range (10:00 AM - 7:00 PM)
            TimeSpan startTime = TimeSpan.FromHours(10);
            TimeSpan endTime = TimeSpan.FromHours(19);

            List<(TimeSpan Start, TimeSpan End)> parsedSlots = new();

            if (customTimeSlots != null && customTimeSlots.Count == 1)
            {
                var parts = customTimeSlots[0].Split('-').Select(t => t.Trim()).ToArray();
                if (parts.Length == 2 && TimeSpan.TryParse(parts[0], out var start) && TimeSpan.TryParse(parts[1], out var end))
                {
                    if (start < end)
                    {
                        startTime = start;
                        endTime = end;
                    }
                }
            }

            // Generate hourly slots between startTime and endTime
            for (var t = startTime; t < endTime; t = t.Add(TimeSpan.FromHours(1)))
            {
                parsedSlots.Add((t, t.Add(TimeSpan.FromHours(1))));
            }

            var firstSlotStart = parsedSlots.First().Start;
            var lastSlotEnd = parsedSlots.Last().End;

            var totalCalls = callRecords.Count;
            var totalConnectedCalls = callRecords.Count(cr => cr.Duration != null);
            var totalDurationTicks = callRecords.Sum(cr => cr.Duration.HasValue ? cr.Duration.Value.ToTimeSpan().Ticks : 0);
            var totalDuration = FormatTotalDuration(totalDurationTicks);

            var hourlyStats = new List<HourlyCallStatsResponseDto>();

            // Before first slot
            var beforeCalls = callRecords.Where(cr => cr.Date.HasValue && cr.Date.Value.TimeOfDay < firstSlotStart).ToList();
            hourlyStats.Add(CreateHourlyStats($"Before {ConvertTo12HourFormat(firstSlotStart)}", beforeCalls, totalCalls, totalConnectedCalls, totalDurationTicks));

            // Main slots
            foreach (var slot in parsedSlots)
            {
                string startTimeStr = ConvertTo12HourFormat(slot.Start);
                string endTimeStr = ConvertTo12HourFormat(slot.End);

                var slotCalls = callRecords.Where(cr => cr.Date.HasValue && cr.Date.Value.TimeOfDay >= slot.Start && cr.Date.Value.TimeOfDay < slot.End).ToList();
                hourlyStats.Add(CreateHourlyStats($"{startTimeStr} - {endTimeStr}", slotCalls, totalCalls, totalConnectedCalls, totalDurationTicks));
            }

            // After last slot
            var afterCalls = callRecords.Where(cr => cr.Date.HasValue && cr.Date.Value.TimeOfDay >= lastSlotEnd).ToList();
            hourlyStats.Add(CreateHourlyStats($"After {ConvertTo12HourFormat(lastSlotEnd)}", afterCalls, totalCalls, totalConnectedCalls, totalDurationTicks));

            // Add total row
            hourlyStats.Add(new HourlyCallStatsResponseDto
            {
                TimeSlot = "Total",
                TotalCalls = totalCalls,
                TotalConnectedCalls = totalConnectedCalls,
                TotalDuration = totalDuration
            });

            // Calculate daily average
            var totalDays = (date.HasValue ? 1 : (endDate - startDate).Days + 1);
            if (totalDays > 0)
            {
                hourlyStats.Add(new HourlyCallStatsResponseDto
                {
                    TimeSlot = "Daily Average",
                    TotalCalls = totalCalls / totalDays,
                    TotalConnectedCalls = totalConnectedCalls / totalDays,
                    TotalDuration = FormatTotalDuration(totalDurationTicks / totalDays)
                });
            }

            return hourlyStats;
        }

        // Convert TimeSpan to 12-hour format (AM/PM)
        private string ConvertTo12HourFormat(TimeSpan time)
        {
            return DateTime.Today.Add(time).ToString("hh:mm tt");
        }

        private HourlyCallStatsResponseDto CreateHourlyStats(string timeSlot, List<CallRecord> calls, int totalCalls, int totalConnectedCalls, long totalDurationTicks)
        {
            var slotConnectedCalls = calls.Count(cr => cr.Duration != null);
            var slotDurationTicks = calls.Sum(cr => cr.Duration.HasValue ? cr.Duration.Value.ToTimeSpan().Ticks : 0);
            var slotDuration = FormatTotalDuration(slotDurationTicks);

            return new HourlyCallStatsResponseDto
            {
                TimeSlot = timeSlot,
                TotalCalls = calls.Count,
                TotalConnectedCalls = slotConnectedCalls,
                TotalDuration = slotDuration,
                TotalCallsPercentage = totalCalls > 0 ? Math.Round((calls.Count * 100.0) / totalCalls, 2) : 0,
                ConnectedCallsPercentage = totalConnectedCalls > 0 ? Math.Round((slotConnectedCalls * 100.0) / totalConnectedCalls, 2) : 0,
                TotalDurationPercentage = totalDurationTicks > 0 ? Math.Round((slotDurationTicks * 100.0) / totalDurationTicks, 2) : 0
            };
        }

        private TimeSpan ConvertToTimeSpan(TimeOnly? time)
        {
            return time.HasValue ? new TimeSpan(time.Value.Hour, time.Value.Minute, time.Value.Second) : TimeSpan.Zero;
        }

        private string FormatTotalDuration(long totalTicks)
        {
            TimeSpan duration = TimeSpan.FromTicks(totalTicks);
            return $"{duration.Hours:D2}:{duration.Minutes:D2}:{duration.Seconds:D2}";
        }

        public async Task<CallRecordResponseDto?> GetCallRecordByIdAsync(Guid id)
        {
            var callRecord = await _context.CallRecords.FindAsync(id);
            return callRecord == null ? null : _mapper.Map<CallRecordResponseDto>(callRecord);
        }

        public async Task<List<CallRecordResponseDto>> GetCallRecordsByLeadIdAsync(Guid leadId)
        {
            var callRecords = await _context.CallRecords
                .Where(cr => cr.LeadId == leadId)
                .Include(cr => cr.User) 
                .ToListAsync();

            return _mapper.Map<List<CallRecordResponseDto>>(callRecords);
        }

        public async Task<bool> DeleteCallRecordAsync(Guid id)
        {
            var callRecord = await _context.CallRecords.FindAsync(id);
            if (callRecord == null) return false;

            _context.CallRecords.Remove(callRecord);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
//public async Task<CallRecordResponseDto> AddCallRecordAsync(CallRecordDto callRecordDto, IFormFile? recordings)
//{
//    var userId = _jwtTokenService.GetUserIdFromToken();
//    var callRecord = _mapper.Map<CallRecord>(callRecordDto);
//    callRecord.RecordId = Guid.NewGuid();
//    callRecord.CreatedBy = userId;

//    // Handle File Upload
//    if (recordings != null)
//    {
//        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "recordings");
//        Directory.CreateDirectory(uploadsFolder); // Ensure directory exists

//        var fileName = $"{Guid.NewGuid()}_{recordings.FileName}";
//        var filePath = Path.Combine(uploadsFolder, fileName);

//        using (var stream = new FileStream(filePath, FileMode.Create))
//        {
//            await recordings.CopyToAsync(stream);
//        }

//        // Save relative path to DB (for easy API access)
//        callRecord.Recordings = $"/recordings/{fileName}";
//    }

//    _context.CallRecords.Add(callRecord);
//    await _context.SaveChangesAsync();

//    return _mapper.Map<CallRecordResponseDto>(callRecord);
//}

//public async Task<CallRecordResponseDto?> UpdateCallRecordAsync(Guid id, CallRecordDto callRecordDto)
//{
//    var existingCallRecord = await _context.CallRecords.FindAsync(id);
//    if (existingCallRecord == null) return null;

//    _mapper.Map(callRecordDto, existingCallRecord);
//    _context.CallRecords.Update(existingCallRecord);
//    await _context.SaveChangesAsync();
//    return _mapper.Map<CallRecordResponseDto>(existingCallRecord);
//}


