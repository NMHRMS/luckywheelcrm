using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.ResponseDto;

namespace Application.Interfaces
{
    public interface IStateDistrictService
    {
        Task<IEnumerable<StateResponseDto>> GetAllStatesAsync();
        Task<StateResponseDto?> GetStateByIdAsync(Guid stateId);
        Task<IEnumerable<DistrictResponseDto>> GetDistrictsByStateNameAsync(string stateName);
        Task<DistrictResponseDto?> GetDistrictByIdAsync(Guid districtId);
    }
}
