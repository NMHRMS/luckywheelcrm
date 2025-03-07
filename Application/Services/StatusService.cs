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
    public class StatusService : IStatusService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public StatusService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<StatusResponseDto>> GetAllStatusesAsync()
        {
            var statuses = await _context.Statuses.ToListAsync();
            return _mapper.Map<IEnumerable<StatusResponseDto>>(statuses);
        }

        public async Task<StatusResponseDto?> GetStatusByIdAsync(Guid id)
        {
            var status = await _context.Statuses.FindAsync(id);
            return status == null ? null : _mapper.Map<StatusResponseDto>(status);
        }

        public async Task<StatusResponseDto> AddStatusAsync(StatusDto statusDto)
        {

            var status = _mapper.Map<Status>(statusDto);
            status.StatusId = Guid.NewGuid();
            _context.Statuses.Add(status);
            await _context.SaveChangesAsync();
            return _mapper.Map<StatusResponseDto>(status);
        }

        public async Task<StatusResponseDto?> UpdateStatusAsync(Guid id, StatusDto statusDto)
        {
            var existingStatus = await _context.Statuses.FindAsync(id);
            if (existingStatus == null) return null;

            _mapper.Map(statusDto, existingStatus);
            _context.Statuses.Update(existingStatus);
            await _context.SaveChangesAsync();
            return _mapper.Map<StatusResponseDto>(existingStatus);
        }
        public async Task<bool> DeleteStatusAsync(Guid id)
        {
            var status = await _context.Statuses.FindAsync(id);
            if (status == null) return false;

            _context.Statuses.Remove(status);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
