using Application.Dtos;
using Application.Interfaces;
using Application.ResponseDto;
using AutoMapper;
using Domain.Models;
using Infrastructure.Data;
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
            .FirstOrDefaultAsync(u => u.UserId == requestDto.AssignedBy);

        bool hasPermission = assignerUser?.AssignedUsers
            .Any(u => u.UserId == requestDto.AssignedTo) ?? false;

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

    public async Task<IEnumerable<LeadTrackingResponseDto>> GetLeadHistoryAsync(Guid leadId)
    {
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
        }
 
        for (int i = 0; i < responseDtos.Count(); i++)
        {
            var currentRecord = responseDtos.ElementAt(i);
            DateTime assignedDate = currentRecord.AssignedDate;
            DateTime nextAssignedDate = (i > 0) ? responseDtos.ElementAt(i - 1).AssignedDate : DateTime.UtcNow;

            TimeSpan duration = nextAssignedDate - assignedDate;

            currentRecord.LeadDuration = $"{(int)duration.TotalMinutes} minutes"; 
            currentRecord.LeadDurationFormatted = $"{(int)duration.TotalDays} days {duration.Hours} hours";
        }
        return responseDtos;
    }
}

