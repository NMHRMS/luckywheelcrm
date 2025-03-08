using Application.Dtos;
using Application.Interfaces;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CRMPROJECTAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class LeadsReviewController : ControllerBase
    {
        private readonly ILeadReviewService _leadReviewService;

        public LeadsReviewController(ILeadReviewService leadReviewService)
        {
            _leadReviewService = leadReviewService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllLeadReviews()
        {
            var leadReviews = await _leadReviewService.GetAllLeadsReviewAsync();
            return Ok(leadReviews);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetLeadReviewById(Guid id)
        {
            var leadReview = await _leadReviewService.GetLeadReviewByIdAsync(id);
            if (leadReview == null) return NotFound();
            return Ok(leadReview);
        }

        [HttpGet("reviews_by_leadId/{leadId}")]
        public async Task<IActionResult> GetLeadReviewsByLeadId(Guid leadId)
        {
            var leadReviews = await _leadReviewService.GetLeadReviewsByLeadIdAsync(leadId);
            if (!leadReviews.Any())
            {
                return NotFound("No reviews found for this Lead ID.");
            }
            return Ok(leadReviews);
        }

        [HttpPost]
        public async Task<IActionResult> CreateLeadReview([FromBody] LeadReviewDto leadReviewDto)
        {
            var leadReview = await _leadReviewService.AddLeadReviewAsync(leadReviewDto);

            if (leadReview == null)     
                return BadRequest("Error adding lead review.");

            return Ok(leadReview);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLeadReview(Guid id, [FromBody] LeadReviewDto leadReviewDto)
        {
            var updatedLeadReview = await _leadReviewService.UpdateLeadReviewAsync(id, leadReviewDto);
            if (updatedLeadReview == null) return NotFound();
            return Ok(updatedLeadReview);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLeadReview(Guid id)
        {
            await _leadReviewService.DeleteLeadReviewAsync(id);
            return NoContent();
        }
    }
}
