using System;
using System.Collections;
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
        private readonly IJwtTokenService _jwtTokenService;
        public LeadReviewService(ApplicationDbContext context, IMapper mapper, IJwtTokenService jwtTokenService)
        {
            _context = context;
            _mapper = mapper;
            _jwtTokenService = jwtTokenService;
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
            var leadReview = await _context.LeadsReview
                 .Include(l => l.ReviewByUser)
                 .FirstOrDefaultAsync(lr=> lr.LeadReviewId == id);
            return leadReview == null ? null : _mapper.Map<LeadReviewResponseDto>(leadReview);
        }

        public async Task<IEnumerable<LeadReviewResponseDto>> GetLeadReviewsByLeadIdAsync(Guid leadId)
        {
            var reviews = await _context.LeadsReview
                .Where(lr => lr.LeadId == leadId)
                .Include(lr => lr.ReviewByUser)
                .ToListAsync();

            return reviews.Select(lr => new LeadReviewResponseDto
            {
                LeadReviewId = lr.LeadReviewId,
                CompanyId = lr.CompanyId,
                LeadId = lr.LeadId,
                Review = lr.Review,
                ReviewBy = lr.ReviewBy,
                ReviewByName = lr.ReviewByUser != null ? lr.ReviewByUser.FirstName : null,
                ReviewDate = lr.ReviewDate,
                FollowUpDate = lr.FollowUpDate
            }).ToList();
        }

        public async Task<LeadReviewResponseDto> AddLeadReviewAsync(LeadReviewDto leadReviewDto)
        {
            var leadReview = _mapper.Map<LeadReview>(leadReviewDto);
            leadReview.LeadReviewId = Guid.NewGuid();

            _context.LeadsReview.Add(leadReview); 
            await _context.SaveChangesAsync();

            var userDictionary = await _context.Users
           .ToDictionaryAsync(u => u.UserId, u => u.FirstName);

            var response = _mapper.Map<LeadReviewResponseDto>(leadReview);

            if (leadReview.ReviewBy.HasValue && userDictionary.TryGetValue(leadReview.ReviewBy.Value, out var reviewerName))
            {
                response.ReviewByName = reviewerName;
            }

            return response;
        }

        public async Task<LeadReviewResponseDto?> UpdateLeadReviewAsync(Guid id, LeadReviewDto leadReviewDto)
        {
            var userId = _jwtTokenService.GetUserIdFromToken(); 
            var existingLeadReview = await _context.LeadsReview.FindAsync(id);
            if (existingLeadReview == null) return null;

            _mapper.Map(leadReviewDto, existingLeadReview);
            existingLeadReview.UpdatedBy = userId;
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