﻿using System;
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
    public class LeadSourceService : ILeadSourceService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IJwtTokenService _jwtTokenService;

        public LeadSourceService (ApplicationDbContext context, IMapper mapper, IJwtTokenService jwtTokenService)
        {
            _context = context;
            _mapper = mapper;
            _jwtTokenService = jwtTokenService;
        }
        public async Task<IEnumerable<LeadSourceResponseDto>> GetAllLeadSourcesAsync()
        {
            var leadSource = await _context.LeadSources.ToListAsync();
            return _mapper.Map<IEnumerable<LeadSourceResponseDto>>(leadSource);
        }
        public async Task<LeadSourceResponseDto?> GetLeadSourceByIdAsync(Guid id)
        {
            var leadSource = await _context.LeadSources.FindAsync(id);
            return leadSource == null ? null : _mapper.Map<LeadSourceResponseDto>(leadSource);
        }

        public async Task<LeadSourceResponseDto> AddLeadSourceAsync(AddLeadSourceDto leadSourceDto)
        {
            var userId = _jwtTokenService.GetUserIdFromToken();
            var leadsource = _mapper.Map<LeadSource>(leadSourceDto);
            leadsource.SourceId = Guid.NewGuid();
            leadsource.CreatedBy = userId;
            _context.LeadSources.Add(leadsource);
            await _context.SaveChangesAsync();
            return _mapper.Map<LeadSourceResponseDto>(leadsource);
        }


        public async Task<LeadSourceResponseDto?> UpdateLeadSourceAsync(Guid id, AddLeadSourceDto leadSourceDto)
        {
            var userId = _jwtTokenService.GetUserIdFromToken();
            var existingLeadSource = await _context.LeadSources.FindAsync(id);
            if (existingLeadSource == null) return null;

            _mapper.Map(leadSourceDto, existingLeadSource);
            existingLeadSource.UpdatedBy = userId;
            _context.LeadSources.Update(existingLeadSource);
            await _context.SaveChangesAsync();
            return _mapper.Map<LeadSourceResponseDto>(existingLeadSource);
        }

        public async Task<bool> DeleteLeadSourceAsync(Guid id)
        {
            var leadSource = await _context.LeadSources.FindAsync(id);
            if (leadSource == null) return false;

            _context.LeadSources.Remove(leadSource);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
