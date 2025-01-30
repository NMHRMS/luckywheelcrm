using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.ResponseDto;

namespace Application.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserResponseDto>> GetAllUsersAsync();
        Task<UserResponseDto?> GetUserByIdAsync(Guid id);
        Task<UserResponseDto> AddUserAsync(AddUserDto userDto);
        Task<UserResponseDto> UpdateUserAsync(Guid id, AddUserDto userDto);
        Task<bool> DeleteUserAsync(Guid id);
    }
}
