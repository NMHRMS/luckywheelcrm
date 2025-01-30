using Application.Dtos;
using Application.Interfaces;
using Application.Services;
using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CRMPROJECTAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BranchController : ControllerBase
    {
        private readonly IBranchService _branchService;

        public BranchController(IBranchService branchService)
        {
            _branchService = branchService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBranches()
        {
            var branches = await _branchService.GetAllBranchesAsync();
            return Ok(branches);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBranchById(Guid id)
        {
            var branch = await _branchService.GetBranchByIdAsync(id);
            if (branch == null) return NotFound();
            return Ok(branch);
        }

        [HttpPost]
        public async Task<IActionResult> CreateBranch([FromBody] AddBranchDto branchDto)
        {
            var branch = await _branchService.AddBranchAsync(branchDto);
            if (branch == null)
                return BadRequest("Error creating branch.");

            return Ok(branch);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBranch(Guid id, [FromBody] AddBranchDto branchDto)
        {
            var updatedBranch = await _branchService.UpdateBranchAsync(id, branchDto);
            if (updatedBranch == null) return NotFound();
            return Ok(updatedBranch);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBranch(Guid id)
        {
            await _branchService.DeleteBranchAsync(id);
            return NoContent();
        }
    }
}
