using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.ResponseDto;
using Domain.Models;
using Microsoft.AspNetCore.Http;
namespace Application.Interfaces
{
    public interface IVehicleInOutService
    {
        Task<VehicleCheckInResponseDto> CheckInAsync(VehicleCheckInDto vehicleDto, IFormFile checkInImage);
        Task<VehicleCheckOutResponseDto?> CheckOutAsync(Guid vehicleId, VehicleCheckOutDto vehicleDto, IFormFile? checkOutImage);
        Task<VehicleCheckInResponseDto?> GetRecordByVehicleNoAsync(string vehicleNo); // to Check Check-in vehicles
        Task<IEnumerable<VehicleInOutRecord>> GetAllRecordsAsync();
        Task<IEnumerable<VehicleCheckInResponseDto>> GetAllInRecordsAsync();
        Task<IEnumerable<VehicleCheckOutResponseDto>> GetAllOutRecordsAsync();
        Task<VehicleInOutResponse> GetCheckInOutDetailsById(Guid branchId);
    }
}















//Task<VehicleCheckInOutDto> CheckInAsync(VehicleCheckInOutDto recordDto);
//Task<VehicleCheckInOutDto?> CheckOutAsync(Guid vehicleId, VehicleCheckInOutDto recordDto);
//Task<VehicleCheckInOutDto?> GetRecordByVehicleNoAsync(string vehicleNo);

//Task<IEnumerable<VehicleCheckInOutDto>> GetAllRecordsAsync();
//Task<VehicleCheckInOutDto?> GetRecordByIdAsync(int id);
//Task<VehicleCheckInOutDto> AddCheckInAsync(VehicleCheckInOutDto dto);
//Task<VehicleCheckInOutDto> UpdateCheckOutAsync(int id, VehicleCheckInOutDto dto);
//Task<bool> DeleteRecordAsync(int id);