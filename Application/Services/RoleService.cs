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
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Application.Services
{
    public class RoleService : IRoleService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public RoleService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<RoleResponseDto>> GetAllRolesAsync()
        {
            var roles = await _context.Roles.ToListAsync();
            return _mapper.Map<IEnumerable<RoleResponseDto>>(roles);
        }

        public async Task<RoleResponseDto?> GetRoleByIdAsync(Guid id)
        {
            var role = await _context.Roles.FindAsync(id);
            return role == null ? null : _mapper.Map<RoleResponseDto>(role);
        }

        public async Task<RoleResponseDto> AddRoleAsync(AddRoleDto roleDto)
        {
            var role = _mapper.Map<Role>(roleDto);
            role.RoleId = Guid.NewGuid();
            _context.Roles.Add(role);
            await _context.SaveChangesAsync();
            return _mapper.Map<RoleResponseDto>(role);
        }

        public async Task<RoleResponseDto?> UpdateRoleAsync(Guid id, AddRoleDto roleDto)
        {
            var existingRole = await _context.Roles.FindAsync(id);
            if (existingRole == null) return null;

            _mapper.Map(roleDto, existingRole);
            _context.Roles.Update(existingRole);
            await _context.SaveChangesAsync();
            return _mapper.Map<RoleResponseDto>(existingRole);
        }

        public async Task<bool> DeleteRoleAsync(Guid id)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null) return false;

            _context.Roles.Remove(role);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
