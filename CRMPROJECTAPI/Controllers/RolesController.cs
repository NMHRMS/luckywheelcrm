using Microsoft.AspNetCore.Http;
using Application.Dtos;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Application.Services;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;

namespace Presentation.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RolesController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllRoles()
        {
            var roles = await _roleService.GetAllRolesAsync();
            return Ok(roles);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoleById(Guid id)
        {
            var role = await _roleService.GetRoleByIdAsync(id);
            if (role == null) return NotFound();
            return Ok(role);
        }

        [HttpPost]
        public async Task<IActionResult> AddRole([FromBody] AddRoleDto roleDto)
        {
            var role = await _roleService.AddRoleAsync(roleDto);
            if (role == null)
                return BadRequest("Error creating role.");

            return Ok(role);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(Guid id, [FromBody] AddRoleDto roleDto)
        {
            if (roleDto == null)
                return BadRequest("Invalid role data");

            var updatedRole = await _roleService.UpdateRoleAsync(id, roleDto);
            if (updatedRole == null)
                return NotFound();
            return Ok(updatedRole);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(Guid id)
        {
            var result = await _roleService.DeleteRoleAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
