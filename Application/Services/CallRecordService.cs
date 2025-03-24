using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Interfaces;
using Application.ResponseDto;
using Application.Services;
using AutoMapper;
using Domain.Models;
using Infrastructure.Data;
using Infrastructure.Utilities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

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

        public async Task<CallRecordResponseDto> ProcessCallRecordAsync(CallRecordDto callRecordDto, IFormFile? recording)
        {
            // Find the active lead associated with the mobile number
            var lead = await _context.Leads
                .FirstOrDefaultAsync(l => l.MobileNo == callRecordDto.MobileNo && l.IsActive);

            if (lead == null)
            {
                throw new Exception("No active lead found for the provided mobile number.");
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
                recordingFileName = $"{Guid.NewGuid()}{fileExtension}";
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

        public async Task<List<CallRecordResponseDto>> GetAllCallRecordsAsync()
        {
            var callRecords = await _context.CallRecords
                .Include(c => c.Lead)   
                .Include(c => c.User)   
                .ToListAsync();

            var responseList = new List<CallRecordResponseDto>();

            foreach (var record in callRecords)
            {
                var responseDto = _mapper.Map<CallRecordResponseDto>(record);

                // Build the full URL/path for the recording file
                responseDto.Recordings = $"recordings/{record.Recordings}";

                // Map UserName
                responseDto.UserName = record.User?.FirstName;

                responseList.Add(responseDto);
            }

            return responseList;
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
//public async Task<bool> DeleteCallRecordAsync(Guid id)
//{
//    var callRecord = await _context.CallRecords.FindAsync(id);
//    if (callRecord == null) return false;

//    _context.CallRecords.Remove(callRecord);
//    await _context.SaveChangesAsync();
//    return true;
//}
//public async Task<IEnumerable<CallRecordResponseDto>> GetAllCallRecordsAsync()
//{
//    var callRecords = await _context.CallRecords.ToListAsync();
//    return _mapper.Map<IEnumerable<CallRecordResponseDto>>(callRecords);
//}
//public async Task<CallRecordResponseDto?> GetCallRecordByIdAsync(Guid id)
//{
//    var callRecord = await _context.CallRecords.FindAsync(id);
//    return callRecord == null ? null : _mapper.Map<CallRecordResponseDto>(callRecord);
//}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//public async Task<List<CallRecordResponseDto>> SyncCallRecords([FromForm] string callRecords, [FromForm] List<IFormFile> files)
//{
//    var userId = _jwtTokenService.GetUserIdFromToken();
//    var companyId = _jwtTokenService.GetCompanyIdFromToken();

//    if (userId == null || companyId == null)
//        throw new UnauthorizedAccessException("Invalid user session");

//    // 🔥 Deserialize the callRecords JSON string into a list of CallRecordDto
//    var callRecordsList = JsonSerializer.Deserialize<List<CallRecordDto>>(callRecords);

//    if (callRecordsList == null || !callRecordsList.Any())
//        throw new ArgumentException("At least one call record must be provided.");

//    if (files == null || files.Count != callRecordsList.Count)
//        throw new ArgumentException("Number of audio files must match the number of call records.");

//    var mobileNumbers = callRecordsList.Select(cr => cr.MobileNo).Distinct().ToList();

//    // Fetch assigned leads
//    var assignedLeads = await _context.Leads
//        .Where(l => l.CompanyId == companyId && l.AssignedTo == userId && l.IsActive && mobileNumbers.Contains(l.MobileNo))
//        .ToListAsync();

//    var responseList = new List<CallRecordResponseDto>();

//    for (int i = 0; i < callRecordsList.Count; i++)
//    {
//        var record = callRecordsList[i];
//        var lead = assignedLeads.FirstOrDefault(l => l.MobileNo == record.MobileNo);
//        if (lead == null)
//            continue;

//        var file = files[i]; // 🔥 Match recording file with the call record

//        var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
//        var filePath = Path.Combine("wwwroot", "recordings", userId.ToString(), lead.LeadId.ToString(), fileName);

//        Directory.CreateDirectory(Path.GetDirectoryName(filePath));

//        using (var stream = new FileStream(filePath, FileMode.Create))
//        {
//            await file.CopyToAsync(stream);
//        }

//        // 🔥 Save call record
//        var callRecord = new CallRecord
//        {
//            RecordId = Guid.NewGuid(),
//            CompanyId = companyId,
//            UserId = userId,
//            LeadId = lead.LeadId,
//            Name = record.Name,
//            MobileNo = record.MobileNo,
//            CallType = record.CallType,
//            Date = DateTimeHelper.GetIndianTime(),
//            Duration = record.Duration,
//            Status = record.Status,
//            Recordings = filePath
//        };

//        _context.CallRecords.Add(callRecord);
//        await _context.SaveChangesAsync();

//        var responseDto = _mapper.Map<CallRecordResponseDto>(callRecord);
//        responseDto.UserName = _context.Users.Where(u => u.UserId == userId).Select(u => u.FirstName).FirstOrDefault();

//        responseList.Add(responseDto);
//    }

//    return responseList;
//}
//public async Task<List<CallRecordResponseDto>> GetAllCallRecords()
//{
//    var userId = _jwtTokenService.GetUserIdFromToken();
//    var companyId = _jwtTokenService.GetCompanyIdFromToken();

//    if (userId == null || companyId == null)
//        throw new UnauthorizedAccessException("Invalid user session");

//    var callRecords = await _context.CallRecords
//        .Where(cr => cr.CompanyId == companyId)
//        .Include(cr => cr.Lead) // Include lead data
//        .OrderByDescending(cr => cr.Date)
//        .ToListAsync();

//    var response = _mapper.Map<List<CallRecordResponseDto>>(callRecords);

//    // Fetch user names separately
//    foreach (var record in response)
//    {
//        record.UserName = _context.Users.Where(u => u.UserId == record.UserId).Select(u => u.FirstName).FirstOrDefault();
//    }

//    return response;
//}
