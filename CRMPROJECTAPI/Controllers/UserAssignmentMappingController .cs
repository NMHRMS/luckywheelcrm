using Application.Dtos;
using Application.Interfaces;
using Application.ResponseDto;
using Application.Services;
using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CRMPROJECTAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAssignmentMappingController : ControllerBase
    {
        private readonly IUserAssignmentMappingService _mappingService;

        public UserAssignmentMappingController(IUserAssignmentMappingService mappingService)
        {
            _mappingService = mappingService;
        }

        [HttpPost("set-mapping")]
        public async Task<IActionResult> SetMapping([FromBody] UserAssignmentMappingDto mappingDto)
        {
            await _mappingService.SetUserAssignmentMappingAsync(mappingDto);
            return Ok("Mapping updated successfully.");
        }

        [HttpGet("get-mappings")]
        public async Task<IActionResult> GetMappings()
        {
            var mappings = await _mappingService.GetUserAssignmentMappingsAsync();
            return Ok(mappings);
        }

        [HttpGet("assignees")]
        public async Task<ActionResult<List<AssigneeResponseDto>>> GetAssigneeNames()
        {
            var assigneeNames = await _mappingService.GetAssigneeNamesForAssignerAsync();
            return Ok(assigneeNames);
        }


        [HttpPut("update-mapping")]
        public async Task<IActionResult> UpdateMapping([FromBody] UserAssignmentMappingDto mappingDto)
        {
            await _mappingService.UpdateUserAssignmentMappingAsync(mappingDto);
            return Ok("Mapping updated successfully.");
        }

        [HttpDelete("delete-mapping/{assignerUserId}")]
        public async Task<IActionResult> DeleteMapping(Guid assignerUserId)
        {
            await _mappingService.DeleteUserAssignmentMappingAsync(assignerUserId);
            return Ok("Mapping deleted successfully.");
        }
    }
}
