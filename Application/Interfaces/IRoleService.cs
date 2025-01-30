using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.ResponseDto;

namespace Application.Interfaces
{
    public interface IRoleService
    {
        Task<IEnumerable<RoleResponseDto>> GetAllRolesAsync();
        Task<RoleResponseDto?> GetRoleByIdAsync(Guid id);
        Task<RoleResponseDto> AddRoleAsync(AddRoleDto roleDto);
        Task<RoleResponseDto> UpdateRoleAsync(Guid id, AddRoleDto roleDto);
        Task<bool> DeleteRoleAsync(Guid id);
    }
}
