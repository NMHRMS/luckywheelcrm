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
    public class BranchService : IBranchService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IJwtTokenService _jwtTokenService;

        public BranchService(ApplicationDbContext context, IMapper mapper, IJwtTokenService jwtTokenService)
        {
            _context = context;
            _mapper = mapper;
            _jwtTokenService = jwtTokenService;
        }
         
        public async Task<IEnumerable<BranchResponseDto>> GetAllBranchesAsync()
        {
            var branch = await _context.Branches.ToListAsync();
            return _mapper.Map<IEnumerable<BranchResponseDto>>(branch);
        }

        public async Task<BranchResponseDto?> GetBranchByIdAsync(Guid id)
        {
            var branch = await _context.Branches.FindAsync(id);
            return branch == null ? null : _mapper.Map<BranchResponseDto>(branch);
        }

        public async Task<BranchResponseDto> AddBranchAsync(AddBranchDto branchDto)
        {

            var userId = _jwtTokenService.GetUserIdFromToken();
            var branch = _mapper.Map<Branch>(branchDto);
            branch.BranchId = Guid.NewGuid();
            branch.CreatedBy = userId;
            _context.Branches.Add(branch);
            await _context.SaveChangesAsync();
            return _mapper.Map<BranchResponseDto>(branch);
        }
        public async Task<BranchResponseDto> UpdateBranchAsync(Guid id, AddBranchDto branchDto)
        {
            var userId = _jwtTokenService.GetUserIdFromToken();
            var existingBranch = await _context.Branches.FindAsync(id);
            if (existingBranch == null) return null;

            _mapper.Map(branchDto, existingBranch);

            existingBranch.UpdatedBy = userId; 
            _context.Branches.Update(existingBranch);
            await _context.SaveChangesAsync();
            return _mapper.Map<BranchResponseDto>(existingBranch);
        }

       
        public async Task<bool> DeleteBranchAsync(Guid id)
        {
            var branch = await _context.Branches.FindAsync(id);
            if (branch == null) return false;

            _context.Branches.Remove(branch);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
