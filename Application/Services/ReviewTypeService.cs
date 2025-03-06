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

        public ReviewTypeService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
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
            var reviewType = _mapper.Map<ReviewsType>(reviewTypeDto);
            reviewType.ReviewId = Guid.NewGuid();
            _context.ReviewTypes.Add(reviewType);
            await _context.SaveChangesAsync();
            return _mapper.Map<ReviewTypeResponseDto>(reviewType);

        }

        public async Task<ReviewTypeResponseDto?> UpdateReviewTypeAsync(Guid id, ReviewTypeDto reviewTypeDto)
        {
            var existingReviewType = await _context.ReviewTypes.FindAsync(id);
            if (existingReviewType == null) return null;

            _mapper.Map(reviewTypeDto, existingReviewType);
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
