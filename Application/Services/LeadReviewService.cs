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
    public class LeadReviewService : ILeadReviewService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        public LeadReviewService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<IEnumerable<LeadReviewResponseDto>> GetAllLeadsReviewAsync()
        {
            var leadReviews = await _context.LeadsReview
                .Include(l=> l.ReviewByUser)
                .ToListAsync();
            return _mapper.Map<IEnumerable<LeadReviewResponseDto>>(leadReviews);
        }
        public async Task<LeadReviewResponseDto?> GetLeadReviewByIdAsync(Guid id)
        {
            var leadReview = await _context.LeadsReview.FindAsync(id);
            return leadReview == null ? null : _mapper.Map<LeadReviewResponseDto>(leadReview);
        }
        public async Task<LeadReviewResponseDto> AddLeadReviewAsync(LeadReviewDto leadReviewDto)
        {
            var leadReview = _mapper.Map<LeadReview>(leadReviewDto);
            leadReview.LeadReviewId = Guid.NewGuid();
            _context.LeadsReview.Add(leadReview);
            await _context.SaveChangesAsync();
            return _mapper.Map<LeadReviewResponseDto>(leadReview);
        }
        public async Task<LeadReviewResponseDto?> UpdateLeadReviewAsync(Guid id, LeadReviewDto leadReviewDto)
        {
            var existingLeadReview = await _context.LeadsReview.FindAsync(id);
            if (existingLeadReview == null) return null;

            _mapper.Map(leadReviewDto, existingLeadReview);
            _context.LeadsReview.Update(existingLeadReview);
            await _context.SaveChangesAsync();
            return _mapper.Map<LeadReviewResponseDto?>(existingLeadReview);
        }
        public async Task<bool> DeleteLeadReviewAsync(Guid id)
        {
            var leadReview = await _context.LeadsReview.FindAsync(id);
            if (leadReview == null) return false;

            _context.LeadsReview.Remove(leadReview);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}