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
    public class ReviewTypeService : IReviewTypeService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IJwtTokenService _jwtTokenService;

        public ReviewTypeService(ApplicationDbContext context, IMapper mapper, IJwtTokenService jwtTokenService)
        {
            _context = context;
            _mapper = mapper;
            _jwtTokenService = jwtTokenService;
        }

        public async Task<IEnumerable<ReviewTypeResponseDto>> GetAllReviewTypesAsync()
        {
            var reviewTypes = await _context.ReviewTypes.ToListAsync();
            return _mapper.Map<IEnumerable<ReviewTypeResponseDto>>(reviewTypes);
        }

        public async Task<ReviewTypeResponseDto?> GetReviewTypeByIdAsync(Guid id)
        {
            var reviewType = await _context.ReviewTypes.FindAsync(id);
            return reviewType == null ? null : _mapper.Map<ReviewTypeResponseDto>(reviewType);
        }

        public async Task<ReviewTypeResponseDto> AddReviewTypeAsync(ReviewTypeDto reviewTypeDto)
        {
            var userId = _jwtTokenService.GetUserIdFromToken();
            var reviewType = _mapper.Map<ReviewsType>(reviewTypeDto);
            reviewType.ReviewId = Guid.NewGuid();
            reviewType.CreatedBy = userId;
            reviewType.CreateDate = DateTime.Now;
            _context.ReviewTypes.Add(reviewType);
            await _context.SaveChangesAsync();
            return _mapper.Map<ReviewTypeResponseDto>(reviewType);
        }

        public async Task<ReviewTypeResponseDto?> UpdateReviewTypeAsync(Guid id, ReviewTypeDto reviewTypeDto)
        {
            var userId = _jwtTokenService.GetUserIdFromToken();
            var existingReviewType = await _context.ReviewTypes.FindAsync(id);
            if (existingReviewType == null) return null;

            _mapper.Map(reviewTypeDto, existingReviewType);
            existingReviewType.UpdatedBy = userId;
            _context.ReviewTypes.Update(existingReviewType);
            await _context.SaveChangesAsync();
            return _mapper.Map<ReviewTypeResponseDto>(existingReviewType);
        }

        public async Task<bool> DeleteReviewTypeAsync(Guid id)
        {
            var reviewType = await _context.ReviewTypes.FindAsync(id);
            if (reviewType == null) return false;

            _context.ReviewTypes.Remove(reviewType);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
