using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Interfaces;
using Application.ResponseDto;
using AutoMapper;
using Domain.Models;
using Infrastructure.Data;
using Infrastructure.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;


namespace Application.Services
{
    public class CallRecordService : ICallRecordService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly ILeadService _leadService;

        public CallRecordService(ApplicationDbContext context, IMapper mapper, IJwtTokenService jwtTokenService)
        {
            _context = context;
            _mapper = mapper;
            _jwtTokenService = jwtTokenService;
        }
        public async Task<List<CallRecordResponseDto>> SyncCallRecords(List<CallRecordDto> callRecords, IFormFile file)
        {
            var userId = _jwtTokenService.GetUserIdFromToken();
            var companyId = _jwtTokenService.GetCompanyIdFromToken();

            if (userId == null || companyId == null)
                throw new UnauthorizedAccessException("Invalid user session");

            var mobileNumbers = callRecords.Select(cr => cr.MobileNo).Distinct().ToList();

            // Fetch assigned and active leads for the user
            var assignedLeads = await _context.Leads
                .Where(l => l.CompanyId == companyId && l.AssignedTo == userId && l.IsActive && mobileNumbers.Contains(l.MobileNo))
                .ToListAsync();

            var responseList = new List<CallRecordResponseDto>();

            foreach (var record in callRecords)
            {
                var lead = assignedLeads.FirstOrDefault(l => l.MobileNo == record.MobileNo);
                if (lead == null)
                    continue; 

                var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
                var filePath = Path.Combine("wwwroot", "recordings", userId.ToString(), lead.LeadId.ToString(), fileName);

                // Ensure directory exists
                Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Create CallRecord model
                var callRecord = new CallRecord
                {
                    RecordId = Guid.NewGuid(),
                    CompanyId = companyId,
                    UserId = userId,
                    LeadId = lead.LeadId,
                    Name = record.Name,
                    MobileNo = record.MobileNo,
                    CallType = record.CallType,
                    Date = DateTimeHelper.GetIndianTime(),
                    Duration = record.Duration,
                    Status = record.Status,
                    Recordings = filePath
                };

                _context.CallRecords.Add(callRecord);
                await _context.SaveChangesAsync();

                // Prepare response DTO
                var responseDto = _mapper.Map<CallRecordResponseDto>(callRecord);
                responseDto.UserName = _context.Users.Where(u => u.UserId == userId).Select(u => u.FirstName).FirstOrDefault();

                responseList.Add(responseDto);
            }

            return responseList;
        }

        public async Task<List<CallRecordResponseDto>> GetAllCallRecords()
        {
            var userId = _jwtTokenService.GetUserIdFromToken();
            var companyId = _jwtTokenService.GetCompanyIdFromToken();

            if (userId == null || companyId == null)
                throw new UnauthorizedAccessException("Invalid user session");

            var callRecords = await _context.CallRecords
                .Where(cr => cr.CompanyId == companyId && cr.UserId == userId)
                .OrderByDescending(cr => cr.Date)
                .ToListAsync();

            return _mapper.Map<List<CallRecordResponseDto>>(callRecords);
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

    }
}

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
///
        //public async Task<bool> SyncCallRecordingsAsync(List<IFormFile> recordings, Guid userId)
        //{
        //    if (recordings == null || !recordings.Any()) return false;

        //    foreach (var file in recordings)
        //    {
        //        var mobileNo = ExtractMobileNumber(file.FileName);
        //        if (string.IsNullOrEmpty(mobileNo)) continue;

        //        var activeLead = await GetActiveLeadForMobileNo(mobileNo);
        //        if (activeLead == null) continue;

        //        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "recordings");
        //        Directory.CreateDirectory(uploadsFolder);

        //        var filePath = Path.Combine(uploadsFolder, file.FileName);
        //        using (var stream = new FileStream(filePath, FileMode.Create))
        //        {
        //            await file.CopyToAsync(stream);
        //        }

        //        var newRecord = new CallRecord
        //        {
        //            RecordId = Guid.NewGuid(),
        //            CompanyId = activeLead.CompanyId,
        //            UserId = activeLead.AssignedTo,
        //            LeadId = activeLead.LeadId,
        //            MobileNo = mobileNo,
        //            CallType = "incoming",
        //            Recordings = file.FileName,
        //            Date = DateTime.UtcNow,
        //            IsSynced = true
        //        };

        //        _context.CallRecords.Add(newRecord);
        //    }

        //    await _context.SaveChangesAsync();
        //    return true;
        //}

        //public async Task SyncCallRecordingsFromFolder(string folderPath)
        //{
        //    var allowedExtensions = new[] { ".mp3", ".wav", ".m4a", ".ogg", ".aac" };
        //    var files = Directory.GetFiles(folderPath)
        //                         .Where(file => allowedExtensions.Contains(Path.GetExtension(file).ToLower()))
        //                         .ToList();

        //    foreach (var file in files)
        //    {
        //        var fileName = Path.GetFileName(file);
        //        var mobileNo = ExtractMobileNumber(fileName);
        //        if (string.IsNullOrEmpty(mobileNo)) continue;

        //        var activeLead = await GetActiveLeadForMobileNo(mobileNo);
        //        if (activeLead == null) continue;

        //        var exists = await _context.CallRecords.AnyAsync(r => r.Recordings == fileName);
        //        if (exists) continue; // Avoid duplicate uploads

        //        var newRecord = new CallRecord
        //        {
        //            RecordId = Guid.NewGuid(),
        //            CompanyId = activeLead.CompanyId,
        //            UserId = activeLead.AssignedTo,
        //            LeadId = activeLead.LeadId,
        //            MobileNo = mobileNo,
        //            CallType = "incoming",
        //            Recordings = fileName,
        //            Date = DateTime.UtcNow,
        //            IsSynced = true
        //        };

        //        _context.CallRecords.Add(newRecord);
        //    }

        //    await _context.SaveChangesAsync();
        //}

        //public async Task<List<CallRecordDto>> GetCallRecordingsAsync(Guid userId)
        //{
        //    var activeLeads = await _context.Leads
        //        .Where(l => l.AssignedTo == userId && l.IsActive)
        //        .Select(l => l.LeadId)
        //        .ToListAsync();

        //    var recordings = await _context.CallRecords
        //        .Where(r => activeLeads.Contains((Guid)r.LeadId))
        //        .ToListAsync();

        //    return _mapper.Map<List<CallRecordDto>>(recordings);
        //}

        //private async Task<Lead?> GetActiveLeadForMobileNo(string mobileNo)
        //{
        //    return await _context.Leads
        //        .Where(l => l.MobileNo == mobileNo && l.AssignedTo != null)
        //        .OrderByDescending(l => l.AssignedDate)
        //        .FirstOrDefaultAsync();
        //}

        //private string ExtractMobileNumber(string fileName)
        //{
        //    return fileName.Split('_').FirstOrDefault(); // Example: 9999999999_20240318.mp3
        //}
