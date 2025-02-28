using Application.Dtos;
using Application.Interfaces;
using Application.ResponseDto;
using Application.Services;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

public class UserAssignmentMappingService : IUserAssignmentMappingService
{
    private readonly ApplicationDbContext _context;
    private readonly IJwtTokenService _jwtTokenService;

    public UserAssignmentMappingService(ApplicationDbContext context, IJwtTokenService jwtTokenService)
    {
        _context = context;
        _jwtTokenService = jwtTokenService;
    }

    public async Task SetUserAssignmentMappingAsync(UserAssignmentMappingDto mappingDto)
    {
        var assigner = await _context.Users
            .Include(u => u.AssignedUsers)
            .FirstOrDefaultAsync(u => u.UserId == mappingDto.AssignerUserId);

        if (assigner == null)
        {
            throw new Exception("Assigner not found.");
        }

        var newAssignees = await _context.Users
            .Where(u => mappingDto.AssigneeUserIds.Contains(u.UserId) && !assigner.AssignedUsers.Contains(u))
            .ToListAsync();

        if (newAssignees.Any())
        {
            assigner.AssignedUsers.AddRange(newAssignees);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<UserAssignmentMappingResponseDto>> GetUserAssignmentMappingsAsync()
    {
        return await _context.Users
            .Where(u => u.AssignedUsers.Any())
            .Select(u => new UserAssignmentMappingResponseDto
            {
                AssignerUserId = u.UserId,
                AssigneeUserIds = u.AssignedUsers.Select(a => a.UserId).ToList()
            })
            .ToListAsync();
    }

    //public async Task<IEnumerable<string>> GetAssigneeNamesForAssignerAsync()
    //{
    //    var assignerUserId = _jwtTokenService.GetUserIdFromToken();

    //    var assignees = await _context.Users
    //        .Where(u => u.UserId == assignerUserId)
    //        .SelectMany(u => u.AssignedUsers)
    //        .Select(a => a.FirstName)
    //        .ToListAsync();

    //    return assignees;
    //}
    public async Task<List<AssigneeResponseDto>> GetAssigneeNamesForAssignerAsync()
    {
        var assignerUserId = _jwtTokenService.GetUserIdFromToken();

        var assignees = await _context.Users
            .Where(u => u.UserId == assignerUserId)
            .SelectMany(u => u.AssignedUsers)
            .Select(a => new AssigneeResponseDto
            {
                AssigneeId = a.UserId,
                AssigneeName = a.FirstName
            })
            .ToListAsync();

        return assignees;
    }


    public async Task<bool> CanAssignAsync(Guid assignerUserId, Guid assigneeUserId)
    {
        return await _context.Users
            .Where(u => u.UserId == assignerUserId)
            .AnyAsync(u => u.AssignedUsers.Any(a => a.UserId == assigneeUserId));
    }

    public async Task UpdateUserAssignmentMappingAsync(UserAssignmentMappingDto mappingDto)
    {
        var assigner = await _context.Users
            .Include(u => u.AssignedUsers)
            .FirstOrDefaultAsync(u => u.UserId == mappingDto.AssignerUserId);

        if (assigner == null)
        {
            throw new Exception("Assigner not found.");
        }

        // Remove existing assignments
        assigner.AssignedUsers.Clear();
        await _context.SaveChangesAsync();

        // Add new assignments
        var newAssignees = await _context.Users
            .Where(u => mappingDto.AssigneeUserIds.Contains(u.UserId))
            .ToListAsync();

        if (newAssignees.Any())
        {
            assigner.AssignedUsers.AddRange(newAssignees);
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteUserAssignmentMappingAsync(Guid assignerUserId)
    {
        var assigner = await _context.Users
            .Include(u => u.AssignedUsers)
            .FirstOrDefaultAsync(u => u.UserId == assignerUserId);

        if (assigner == null)
        {
            throw new Exception("Assigner not found.");
        }

        // Remove all assigned users
        assigner.AssignedUsers.Clear();
        await _context.SaveChangesAsync();
    }

}
