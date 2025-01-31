using Application.Dtos;
using Application.Interfaces;
using Application.Services;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;


namespace CRMPROJECTAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class VehicleInOutController : ControllerBase
    {
        private readonly IVehicleInOutService _vehicleInOutService;
        public VehicleInOutController(IVehicleInOutService vehicleInOutService)
        {
            _vehicleInOutService = vehicleInOutService;
        }

        [HttpPost("check-in")]
        public async Task<IActionResult> CheckIn([FromForm] VehicleCheckInDto checkInDto, IFormFile? checkInImage)
        {
            if (checkInDto == null )
            {
                return BadRequest("Invalid data.");
            }

            var result = await _vehicleInOutService.CheckInAsync(checkInDto, checkInImage);

            if (result == null)
            {
                return BadRequest("Failed to check-in vehicle.");
            }
            return Ok(result);
        }      
        [HttpPost("check-out/{vehicleNo}")]
        public async Task<IActionResult> CheckOut(string vehicleNo, [FromForm] VehicleCheckOutDto checkOutDto, IFormFile? checkOutImage)
        {
            var existingRecord = await _vehicleInOutService.GetRecordByVehicleNoAsync(vehicleNo);

            if (existingRecord == null)
            {
                return NotFound(new { message = "No active check-in record found for this vehicle" });
            }
            var result = await _vehicleInOutService.CheckOutAsync(existingRecord.Id, checkOutDto, checkOutImage);
            return Ok(result);
        }

        [HttpGet("by-vehicle/{vehicleNo}")]
        public async Task<IActionResult> GetByVehicleNo(string vehicleNo)
        {
            var record = await _vehicleInOutService.GetRecordByVehicleNoAsync(vehicleNo);
            return Ok(record);
        }

        [HttpGet("checkin-by-date/{date}")]
        public async Task<IActionResult> GetCheckInByDate(DateTime date)
        {
            var records = await _vehicleInOutService.GetCheckInByDateAsync(date);
            return Ok(records);
        }

        [HttpGet("checkout-by-date/{date}")]
        public async Task<IActionResult> GetCheckOutByDate(DateTime date)
        {
            var records = await _vehicleInOutService.GetCheckOutByDateAsync(date);
            return Ok(records);
        }

        [HttpGet("checkin-by-user/{userId}")]
        public async Task<IActionResult> GetCheckInByUser(Guid userId)
        {
            var records = await _vehicleInOutService.GetCheckInByUserAsync(userId);
            return Ok(records);
        }

        [HttpGet("checkout-by-user/{userId}")]
        public async Task<IActionResult> GetCheckOutByUser(Guid userId)
        {
            var records = await _vehicleInOutService.GetCheckOutByUserAsync(userId);
            return Ok(records);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var records = await _vehicleInOutService.GetAllRecordsAsync();
            return Ok(records);
        }

        [HttpGet("all-in")]
        public async Task<IActionResult> GetAllIns()
        {
            var records = await _vehicleInOutService.GetAllInRecordsAsync();
            return Ok(records);
        } 

        [HttpGet("all-out")]
        public async Task<IActionResult> GetAllOuts()
        {
            var records = await _vehicleInOutService.GetAllOutRecordsAsync();
            return Ok(records);
        }

        [HttpGet("get-checkInOutDetails_by_id")]
        public async Task<IActionResult> GetCheckInOutDetailsById(Guid branchId)
        {
            var response = await _vehicleInOutService.GetCheckInOutDetailsById(branchId);
            return Ok(response);
        }
    }
}
