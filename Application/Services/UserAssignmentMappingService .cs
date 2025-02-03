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
    public class UserAssignmentMappingService : IUserAssignmentMappingService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public UserAssignmentMappingService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task SetUserAssignmentMappingAsync(UserAssignmentMappingDto mappingDto)
        {
            var existingMappings = await _context.UserAssignmentMappings
                .Where(m => m.AssignerUserId == mappingDto.AssignerUserId)
                .ToListAsync();

            bool isAlreadyAssigned = existingMappings
                .Any(m => m.AssigneeUserId == mappingDto.AssigneeUserId);

            if (!isAlreadyAssigned)
            {
                var newMapping = new UserAssignmentMapping
                {
                    Id = Guid.NewGuid(),
                    AssignerUserId = mappingDto.AssignerUserId,
                    AssigneeUserId = mappingDto.AssigneeUserId
                };

                await _context.UserAssignmentMappings.AddAsync(newMapping);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<UserAssignmentMappingResponseDto>> GetUserAssignmentMappingsAsync()
        {
            var mappings = await _context.UserAssignmentMappings.ToListAsync();

            var grouped = mappings
                .GroupBy(m => m.AssignerUserId)
                .Select(g => new UserAssignmentMappingResponseDto
                {
                    AssignerUserId = g.Key,
                    AssigneeUserIds = g.Select(x => x.AssigneeUserId).ToList()
                });

            return grouped;
        }

        public async Task<bool> CanAssignAsync(Guid assignerUserId, Guid assigneeUserId)
        {
            return await _context.UserAssignmentMappings
                .AnyAsync(m => m.AssignerUserId == assignerUserId && m.AssigneeUserId == assigneeUserId);
        }
    }

}
