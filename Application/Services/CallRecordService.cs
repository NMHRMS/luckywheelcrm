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
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class CallRecordService : ICallRecordService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IJwtTokenService _jwtTokenService;
        public CallRecordService(ApplicationDbContext context, IMapper mapper, IJwtTokenService jwtTokenService)
        {
            _context = context;
            _mapper = mapper;
            _jwtTokenService = jwtTokenService;
        }
        public async Task<IEnumerable<CallRecordResponseDto>> GetAllCallRecordsAsync()
        {
            var callRecords = await _context.CallRecords.ToListAsync();
            return _mapper.Map<IEnumerable<CallRecordResponseDto>>(callRecords);
        }
        public async Task<CallRecordResponseDto?> GetCallRecordByIdAsync(Guid id)
        {
            var callRecord = await _context.CallRecords.FindAsync(id);
            return callRecord == null ? null : _mapper.Map<CallRecordResponseDto>(callRecord);
        }
        public async Task<CallRecordResponseDto> AddCallRecordAsync(CallRecordDto callRecordDto)
        {
            var userId = _jwtTokenService.GetUserIdFromToken();
            var callRecord = _mapper.Map<CallRecord>(callRecordDto);
            callRecord.RecordId = Guid.NewGuid();
            callRecord.CreatedBy = userId;
            _context.CallRecords.Add(callRecord);
            await _context.SaveChangesAsync();
            return _mapper.Map<CallRecordResponseDto>(callRecord);
        }
        public async Task<CallRecordResponseDto?> UpdateCallRecordAsync(Guid id, CallRecordDto callRecordDto)
        {
            var existingCallRecord = await _context.CallRecords.FindAsync(id);
            if (existingCallRecord == null) return null;

            _mapper.Map(callRecordDto, existingCallRecord);
            _context.CallRecords.Update(existingCallRecord);
            await _context.SaveChangesAsync();
            return _mapper.Map<CallRecordResponseDto>(existingCallRecord);
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
