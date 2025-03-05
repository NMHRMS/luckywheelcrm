using System.Linq.Expressions;
using Application.Dtos;
using Application.Interfaces;
using Application.ResponseDto;
using AutoMapper;
using Azure.Core;
using Domain.Models;
using Infrastructure.Data;
using Infrastructure.Utilities;
using Microsoft.EntityFrameworkCore;

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

        var assignerUser = await _context.Users
            .Include(u => u.AssignedUsers)
            .FirstOrDefaultAsync(u => u.UserId == assignedByUserId);

        bool hasPermission = assignerUser?.AssignedUsers
            .Any(u => u.UserId == requestDto.AssignedTo) ?? false;

        if (!hasPermission)
        {
            throw new UnauthorizedAccessException("You do not have permission to assign this lead.");
        }

        string currentLeadStatus = lead.Status;

        lead.AssignedTo = requestDto.AssignedTo;
        lead.AssignedDate = DateTimeHelper.GetIndianTime();

        lead.LastRevertedBy = null;
        lead.Remark = null;

        _context.Leads.Update(lead);

        var leadTracking = _mapper.Map<LeadTracking>(requestDto);
        leadTracking.AssignedBy = (Guid)assignedByUserId;
        leadTracking.LeadStatus = currentLeadStatus;

        await _context.LeadsTracking.AddAsync(leadTracking);

        await _context.SaveChangesAsync();
    }

    public async Task<LeadResponseDto> RevertLeadAssignmentAsync(LeadRevertDto requestDto)
    {
        var lastRevertedBy = _jwtTokenService.GetUserIdFromToken();

        var lead = await _context.Leads
            .Include(l => l.LeadSource)
            .Include(l => l.District)
            .Include(l => l.State)
            .Include(l => l.Category)
            .Include(l => l.Product)
            .Include(l => l.AssignedToUser)
            .Include(l => l.RevertedByUser)
            .FirstOrDefaultAsync(l => l.LeadId == requestDto.LeadId);

        if (lead == null || lead.AssignedTo == null)
        {
            throw new Exception("Lead not found or not assigned.");
        }


        // Fetch latest tracking record
        var trackingRecord = await _context.LeadsTracking
            .Where(lt => lt.LeadId == requestDto.LeadId && lt.AssignedTo == lastRevertedBy)
            .OrderByDescending(lt => lt.AssignedDate)
            .FirstOrDefaultAsync();

        if (trackingRecord != null)
        {
            // Store rejection details in Leads table
            lead.LastRevertedBy = lastRevertedBy;
            lead.Remark = requestDto.Remark;

            // Remove tracking record
            _context.LeadsTracking.Remove(trackingRecord);
        }

        // Reset AssignedTo and AssignedDate in Leads table
        lead.AssignedTo = null;
        lead.AssignedDate = null;
        _context.Leads.Update(lead);

        await _context.SaveChangesAsync();

        // Return updated lead using AutoMapper
        return _mapper.Map<LeadResponseDto>(lead);
    }

    public async Task<IEnumerable<LeadResponseDto>> GetRevertedLeadsAsync()
    {
        var leadList = await _context.Leads
              .Include(l => l.District)
              .Include(l => l.State)
              .Include(l => l.LeadSource)
              .Include(l => l.Category)
              .Include(l => l.Product)
              .Include(l => l.AssignedToUser)
              .Include(l => l.RevertedByUser)
              .ToListAsync();

        var revertedLeads = await _context.Leads
            .Where(l => l.AssignedTo == null && l.LastRevertedBy != null)
            .OrderByDescending(l => l.AssignedDate)
            .ToListAsync();

        return _mapper.Map<IEnumerable<LeadResponseDto>>(revertedLeads);
    }

    public async Task<List<WorkedUsersResponseDto>> GetUsersWhoWorkedOnClosedLead(Guid leadId)
    {
        var assignedUsers = await _context.LeadsTracking
            .Where(lt => lt.LeadId == leadId)
            .Select(lt => lt.AssignedTo)
            .Distinct()
            .ToListAsync();

        var users = await _context.Users
            .Where(u => assignedUsers.Contains(u.UserId))
            .Select(u => new WorkedUsersResponseDto
            {
                UserId = u.UserId,
                FullName = (u.FirstName ?? "")
            })
            .ToListAsync();

        return users;
    }

    public async Task<ClosedLeadResponseDto> GetClosedLeadsAsync()
    {
        var closedLeads = await _context.Leads
            .Where(l => l.Status == "Closed")
            .Select(l => l.LeadId)
            .Distinct()
            .ToListAsync();

        var leadTrackingRecords = await _context.LeadsTracking
            .Where(lt => closedLeads.Contains(lt.LeadId))
            .OrderByDescending(lt => lt.AssignedDate)
            .ToListAsync();

        return await MapLeadTrackingRecords(leadTrackingRecords);
    }

    public async Task<ClosedLeadResponseDto> GetClosedLeadsByUserAsync(Guid userId)
    {
        // Get all closed leads
        var closedLeads = await _context.LeadsTracking
            .Where(lt => lt.LeadStatus == "Closed")
            .Select(lt => lt.LeadId)
            .Distinct()
            .ToListAsync();

        // Get leads where this user has worked
        var userWorkedOnLeads = await _context.LeadsTracking
            .Where(lt => closedLeads.Contains(lt.LeadId) && lt.AssignedTo == userId)
            .Select(lt => lt.LeadId)
            .Distinct()
            .ToListAsync();

        if (!userWorkedOnLeads.Any())
        {
            return new ClosedLeadResponseDto
            {
                TotalClosedLeads = 0,
                Leads = new List<ClosedLeadDto>()
            };
        }

        // Get lead tracking details for those leads
        var leadTrackingRecords = await _context.LeadsTracking
            .Where(lt => userWorkedOnLeads.Contains(lt.LeadId))
            .OrderByDescending(lt => lt.AssignedDate)
            .ToListAsync();

        return await MapLeadTrackingRecords(leadTrackingRecords);
    }

    public async Task<ClosedLeadResponseDto> GetClosedLeadsByDateAsync(Guid userId, DateTime date)
    {
        var closedLeads = await _context.LeadsTracking
            .Where(lt => lt.AssignedTo == userId && lt.ClosedDate.HasValue && lt.ClosedDate.Value.Date == date.Date)
            .Select(lt => lt.LeadId)
            .Distinct()
            .ToListAsync();

        var leadTrackingRecords = await _context.LeadsTracking
            .Where(lt => closedLeads.Contains(lt.LeadId))
            .OrderByDescending(lt => lt.AssignedDate)
            .ToListAsync();

        return await MapLeadTrackingRecords(leadTrackingRecords);
    }

    public async Task<ClosedLeadResponseDto> GetClosedLeadsByDateRangeAsync(Guid userId, DateTime startDate, DateTime endDate)
    {
        var closedLeads = await _context.LeadsTracking
            .Where(lt => lt.AssignedTo == userId && lt.ClosedDate.HasValue && lt.ClosedDate.Value.Date >= startDate.Date && lt.ClosedDate.Value.Date <= endDate.Date)
            .Select(lt => lt.LeadId)
            .Distinct()
            .ToListAsync();

        var leadTrackingRecords = await _context.LeadsTracking
            .Where(lt => closedLeads.Contains(lt.LeadId))
            .OrderByDescending(lt => lt.AssignedDate)
            .ToListAsync();

        return await MapLeadTrackingRecords(leadTrackingRecords);
    }

    private async Task<ClosedLeadResponseDto> MapLeadTrackingRecords(List<LeadTracking> leadTrackingRecords)
    {
        var responseDtos = _mapper.Map<List<LeadTrackingResponseDto>>(leadTrackingRecords);

        var leadIds = responseDtos.Select(dto => dto.LeadId).Distinct().ToList();

        // Fetch Leads and map to LeadResponseDto
        var leads = await _context.Leads
            .Where(l => leadIds.Contains(l.LeadId))
            .ToListAsync();

        var leadResponseDtos = _mapper.Map<List<LeadResponseDto>>(leads)
            .ToDictionary(l => l.LeadId, l => l);

        var groupedLeadTrackings = responseDtos
            .GroupBy(dto => dto.LeadId)
            .Select(group =>
            {
                var leadTrackings = group.OrderByDescending(g => g.AssignedDate).ToList();
                var leadId = group.Key;

                for (int i = 0; i < leadTrackings.Count; i++)
                {
                    var currentRecord = leadTrackings[i];
                    DateTime assignedDate = currentRecord.AssignedDate;
                    DateTime nextAssignedDate = (i > 0) ? leadTrackings[i - 1].AssignedDate : DateTimeHelper.GetIndianTime();

                    TimeSpan duration = nextAssignedDate - assignedDate;

                    currentRecord.LeadDuration = $"{(int)duration.TotalMinutes} minutes";
                    currentRecord.LeadDurationFormatted = $"{(int)duration.TotalDays} days {duration.Hours} hours";
                }

                return new ClosedLeadDto
                {
                    LeadId = leadId,
                    LeadDetails = leadResponseDtos.ContainsKey(leadId) ? leadResponseDtos[leadId] : null,
                    LeadTrackingRecords = leadTrackings
                };
            })
            .ToList();

        return new ClosedLeadResponseDto
        {
            TotalClosedLeads = groupedLeadTrackings.Count,
            Leads = groupedLeadTrackings
        };
    }

    public async Task<IEnumerable<LeadTrackingResponseDto>> GetLeadHistoryAsync(Guid leadId)
    {
        var leadStatus = await _context.Leads
            .Where(l => l.LeadId == leadId)
            .FirstOrDefaultAsync();

        var leadTrackingRecords = await _context.LeadsTracking
            .Where(lt => lt.LeadId == leadId)
            .OrderByDescending(lt => lt.AssignedDate)
            .ToListAsync();

        var responseDtos = _mapper.Map<IEnumerable<LeadTrackingResponseDto>>(leadTrackingRecords);

        var userIds = leadTrackingRecords
            .SelectMany(lt => new[] { lt.AssignedTo, lt.AssignedBy })
            .Distinct()
            .ToList();

        var userNames = await _context.Users
            .Where(u => userIds.Contains(u.UserId))
            .Select(u => new { u.UserId, FullName = u.FirstName + " " + (u.LastName ?? "") })
            .ToDictionaryAsync(u => u.UserId, u => u.FullName);

        foreach (var dto in responseDtos)
        {
            dto.AssignedToName = userNames.ContainsKey(dto.AssignedTo) ? userNames[dto.AssignedTo] : "";
            dto.AssignedByName = userNames.ContainsKey(dto.AssignedBy) ? userNames[dto.AssignedBy] : "";
            //dto.LeadStatus = leadStatus;
        }

        for (int i = 0; i < responseDtos.Count(); i++)
        {
            var currentRecord = responseDtos.ElementAt(i);
            DateTime assignedDate = currentRecord.AssignedDate;
            DateTime nextAssignedDate = (i > 0) ? responseDtos.ElementAt(i - 1).AssignedDate : DateTimeHelper.GetIndianTime();

            TimeSpan duration = nextAssignedDate - assignedDate;

            currentRecord.LeadDuration = $"{(int)duration.TotalMinutes} minutes";
            currentRecord.LeadDurationFormatted = $"{(int)duration.TotalDays} days {duration.Hours} hours";
        }
        return responseDtos;
    }
}