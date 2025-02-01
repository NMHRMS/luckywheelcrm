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

        public LeadsAssignService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task AssignLeadAsync(LeadAssignmentDto requestDto)
        {
            var lead = await _context.Leads.FindAsync(requestDto.LeadID);
            if (lead == null)
            {
                throw new Exception("Lead not found");
            }

            // Update the lead's assigned user
            lead.AssignedTo = requestDto.AssignedTo;
            lead.AssignedDate = requestDto.AssignedDate;
            _context.Leads.Update(lead);

            // Create a tracking entry
            var leadTracking = new LeadTracking
            {
                LeadID = requestDto.LeadID,
                AssignedTo = requestDto.AssignedTo,
                AssignedBy = requestDto.AssignedBy, 
                AssignedDate = DateTime.UtcNow
            };

            await _context.LeadsTracking.AddAsync(leadTracking);
            await _context.SaveChangesAsync();
        }

        
    }

}
