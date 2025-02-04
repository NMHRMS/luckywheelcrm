﻿using Application.Dtos;
using Application.Interfaces;
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
    }
}
