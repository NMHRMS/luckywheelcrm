using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.ResponseDto;

namespace Application.Interfaces
{
    public interface IUserAssignmentMappingService
    {
        Task SetUserAssignmentMappingAsync(UserAssignmentMappingDto mappingDto);
        Task<IEnumerable<UserAssignmentMappingResponseDto>> GetUserAssignmentMappingsAsync();
        Task<IEnumerable<string>> GetAssigneeNamesForAssignerAsync();
        Task<bool> CanAssignAsync(Guid assignerUserId, Guid assigneeUserId);
        Task UpdateUserAssignmentMappingAsync(UserAssignmentMappingDto mappingDto);
        Task DeleteUserAssignmentMappingAsync(Guid assignerUserId);
    }

}
