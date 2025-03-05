using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    using Application.Interfaces;
    using Application.ResponseDto;
    using AutoMapper;
    using Infrastructure.Data;
    using Microsoft.EntityFrameworkCore;

    public class StateDistrictService : IStateDistrictService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public StateDistrictService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<StateResponseDto>> GetAllStatesAsync()
        {
            var states = await _context.States.ToListAsync();
            return _mapper.Map<IEnumerable<StateResponseDto>>(states);
        }

        public async Task<StateResponseDto?> GetStateByIdAsync(Guid stateId)
        {
            var state = await _context.States.FindAsync(stateId);
            return state == null ? null : _mapper.Map<StateResponseDto>(state);
        }

        public async Task<IEnumerable<DistrictResponseDto>> GetDistrictsByStateNameAsync(string stateName)
        {
            var state = await _context.States
                .FirstOrDefaultAsync(s => s.StateName.ToLower() == stateName.ToLower());

            if (state == null) return new List<DistrictResponseDto>(); 

            var districts = await _context.Districts
                .Where(d => d.StateId == state.StateId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<DistrictResponseDto>>(districts);
        }


        public async Task<DistrictResponseDto?> GetDistrictByIdAsync(Guid districtId)
        {
            var district = await _context.Districts.FindAsync(districtId);
            return district == null ? null : _mapper.Map<DistrictResponseDto>(district);
        }
    }

}
