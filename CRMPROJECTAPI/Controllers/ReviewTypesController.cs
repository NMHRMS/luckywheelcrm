using Application.Dtos;
using Application.Interfaces;
using Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CRMPROJECTAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewTypesController : ControllerBase
    {
        private readonly IReviewTypeService _reviewTypeService;

        public ReviewTypesController(IReviewTypeService reviewTypeService)
        {
            _reviewTypeService = reviewTypeService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllReviewType()
        {
            var result = await _reviewTypeService.GetAllReviewTypesAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetReviewTypeById(Guid id)
        {
            var result = await _reviewTypeService.GetReviewTypeByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateReviewType(ReviewTypeDto reviewTypeDto)
        {
            var reviewType = await _reviewTypeService.AddReviewTypeAsync(reviewTypeDto);

            if (reviewType == null) return BadRequest();
            return Ok(reviewType);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReviewType(Guid id, ReviewTypeDto reviewTypeDto)
        {
            var updatedReviewType = await _reviewTypeService.UpdateReviewTypeAsync(id, reviewTypeDto);
            if (updatedReviewType == null) return NotFound();
            return Ok(updatedReviewType);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _reviewTypeService.DeleteReviewTypeAsync(id);
            return NoContent();
        }
    }
}
