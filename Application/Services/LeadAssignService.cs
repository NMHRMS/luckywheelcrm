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
    public class LeadsAssignService : ILeadAssignService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IJwtTokenService _jwtTokenService;

        public LeadsAssignService(ApplicationDbContext context, IMapper mapper, IJwtTokenService jwtTokenService)
        {
            _context = context;
            _mapper = mapper;
            _jwtTokenService = jwtTokenService;
        }

        public async Task AssignLeadAsync(LeadAssignmentDto requestDto)
        {
            var lead = await _context.Leads.FindAsync(requestDto.LeadID);
            if (lead == null)
            {
                throw new Exception("Lead not found");
            }

            var assignedByUserId = _jwtTokenService.GetUserIdFromToken();

            bool hasPermission = await _context.UserAssignmentMappings
                .AnyAsync(mapping => mapping.AssignerUserId == requestDto.AssignedBy && mapping.AssigneeUserId == requestDto.AssignedTo);

            if (!hasPermission)
            {
                throw new UnauthorizedAccessException("You do not have permission to assign this lead.");
            }

            lead.AssignedTo = requestDto.AssignedTo;
            lead.AssignedDate = requestDto.AssignedDate;
            _context.Leads.Update(lead);

            var leadTracking = _mapper.Map<LeadTracking>(requestDto);
            await _context.LeadsTracking.AddAsync(leadTracking);
            await _context.SaveChangesAsync();
        }
    }
}
