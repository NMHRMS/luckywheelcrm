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



    //public class LeadAssignService : ILeadAssignService
    //{
    //    private readonly ApplicationDbContext _context;
    //private readonly IMapper _mapper;


    //    public LeadAssignService(ApplicationDbContext context, IMapper mapper)
    //    {
    //        _context = context;
    //        _mapper = mapper;
    //    }

    //    // Assign lead to a user and track in LeadTracking table
    //    public async Task<bool> AssignLeadAsync(LeadAssignmentDto assignmentDto)
    //    {
    //        var lead = await _context.Leads.FindAsync(assignmentDto.LeadID);
    //        if (lead == null)
    //        {
    //            return false;
    //        }

    //        // Update the lead assignment
    //        lead.AssignedTo = assignmentDto.AssignedTo;

    //        // Track the assignment in LeadTracking
    //        var tracking = new LeadTracking
    //        {
    //            LeadID = assignmentDto.LeadID,
    //            AssignedTo = assignmentDto.AssignedTo,
    //            AssignedBy = assignmentDto.AssignedBy,
    //            AssignedDate = DateTime.UtcNow
    //        };

    //        _context.LeadsTracking.Add(tracking);
    //        await _context.SaveChangesAsync();

    //        return true;
    //    }

    //    // Retrieve lead assignment history
    //    public async Task<List<LeadTrackingDto>> GetLeadHistoryAsync(int leadId)
    //    {
    //        var trackingRecords = await _context.LeadsTracking
    //            .Where(t => t.LeadID == leadId)
    //            .Include(t => t.AssignedToUser)
    //            .Include(t => t.AssignedByUser)
    //            .ToListAsync();

    //        return _mapper.Map<List<LeadTrackingDto>>(trackingRecords);
    //    }

    //    // Get leads assigned to a specific user
    //    public async Task<List<LeadDto>> GetUserAssignedLeadsAsync(int userId)
    //    {
    //        var leads = await _context.Leads
    //            .Where(l => l.AssignedTo == userId)
    //            .ToListAsync();

    //        return _mapper.Map<List<LeadDto>>(leads);
    //    }
    //}

}
