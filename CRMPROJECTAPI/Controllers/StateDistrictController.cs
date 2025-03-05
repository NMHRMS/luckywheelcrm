using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CRMPROJECTAPI.Controllers
{
    using Application.Interfaces;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/states")]
    [ApiController]
    public class StateDistrictController : ControllerBase
    {
        private readonly IStateDistrictService _stateDistrictService;

        public StateDistrictController(IStateDistrictService stateDistrictService)
        {
            _stateDistrictService = stateDistrictService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllStates()
        {
            var states = await _stateDistrictService.GetAllStatesAsync();
            return Ok(states);
        }

        [HttpGet("{stateId}")]
        public async Task<IActionResult> GetStateById(Guid stateId)
        {
            var state = await _stateDistrictService.GetStateByIdAsync(stateId);
            if (state == null) return NotFound("State not found.");
            return Ok(state);
        }

        [HttpGet("districts/statename/{stateName}")]
        public async Task<IActionResult> GetDistrictsByStateName(string stateName)
        {
            var districts = await _stateDistrictService.GetDistrictsByStateNameAsync(stateName);
            if (!districts.Any()) return NotFound("State not found or no districts available.");
            return Ok(districts);
        }

        [HttpGet("districts/{districtId}")]
        public async Task<IActionResult> GetDistrictById(Guid districtId)
        {
            var district = await _stateDistrictService.GetDistrictByIdAsync(districtId);
            if (district == null) return NotFound("District not found.");
            return Ok(district);
        }
    }

}
