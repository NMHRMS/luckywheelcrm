using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Interfaces;
using Application.ResponseDto;
using AutoMapper;
using Domain.Models;
using Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class VehicleInOutService : IVehicleInOutService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly string _uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "checkinout");

        public VehicleInOutService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<VehicleCheckInResponseDto> CheckInAsync(VehicleCheckInDto vehicleDto, IFormFile checkInImage)
        {
            if (await _context.VehicleCheckInCheckOut.AnyAsync(v => v.VehicleNo == vehicleDto.VehicleNo && v.CheckOutDate == null))
            {
                throw new InvalidOperationException("This vehicle is already checked in.");
            }

            var vehicleRecord = _mapper.Map<VehicleInOutRecord>(vehicleDto);

            vehicleRecord.CheckInDate = DateTime.UtcNow;
            vehicleRecord.Status = "Checked In"; 

            if (checkInImage != null)
            {
                vehicleRecord.CheckInImage = await SaveImageAsync(checkInImage);
            }
            vehicleRecord.Id = Guid.NewGuid();
            await _context.VehicleCheckInCheckOut.AddAsync(vehicleRecord);
            await _context.SaveChangesAsync();
            return _mapper.Map<VehicleCheckInResponseDto>(vehicleRecord);
        }

        public async Task<VehicleCheckOutResponseDto?> CheckOutAsync(Guid vehicleId, VehicleCheckOutDto vehicleDto, IFormFile? checkOutImage)
        {
            var vehicleRecord = await _context.VehicleCheckInCheckOut.FindAsync(vehicleId);
            if (vehicleRecord == null || vehicleRecord.CheckOutDate != null)
            {
                throw new InvalidOperationException("Vehicle record not found or already checked out.");
            }

            vehicleRecord.CheckOutBy = vehicleDto.CheckOutBy;
            vehicleRecord.CheckOutRemark = vehicleDto.CheckOutRemark;
            vehicleRecord.CheckOutDate = DateTime.UtcNow;
            vehicleRecord.Status = "Checked Out"; 

            if (checkOutImage != null)
            {
                vehicleRecord.CheckOutImage = await SaveImageAsync(checkOutImage);
            }

            await _context.SaveChangesAsync();
            return _mapper.Map<VehicleCheckOutResponseDto>(vehicleRecord);
        }

        public async Task<VehicleInOutRecord> GetRecordByVehicleNoAsync(string vehicleNo)
        {
            var record = await _context.VehicleCheckInCheckOut
                .FirstOrDefaultAsync(v => v.VehicleNo == vehicleNo);

            return _mapper.Map<VehicleInOutRecord>(record);
        }

        public async Task<IEnumerable<VehicleCheckInResponseDto>> GetCheckInByDateAsync(DateTime date)
        {
            var records = await _context.VehicleCheckInCheckOut
                .Where(v => v.CheckInDate.Date == date.Date)    
                .ToListAsync();

            return _mapper.Map<IEnumerable<VehicleCheckInResponseDto>>(records);
        }

        public async Task<IEnumerable<VehicleCheckOutResponseDto>> GetCheckOutByDateAsync(DateTime date)
        {
            var records = await _context.VehicleCheckInCheckOut
                .Where(v => v.CheckOutDate.HasValue && v.CheckOutDate.Value.Date == date.Date)
                .ToListAsync();

            return _mapper.Map<IEnumerable<VehicleCheckOutResponseDto>>(records);
        }

        public async Task<IEnumerable<VehicleCheckInResponseDto>> GetCheckInByUserAsync(Guid userId)
        {
            var records = await _context.VehicleCheckInCheckOut
                .Where(v => v.CheckInBy == userId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<VehicleCheckInResponseDto>>(records);
        }


        public async Task<IEnumerable<VehicleCheckOutResponseDto>> GetCheckOutByUserAsync(Guid userId)
        {
            var records = await _context.VehicleCheckInCheckOut
                .Where(v => v.CheckOutBy == userId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<VehicleCheckOutResponseDto>>(records);
        }


        public async Task<IEnumerable<VehicleInOutRecord>> GetAllRecordsAsync()
        {
            var records = await _context.VehicleCheckInCheckOut.ToListAsync();
            return _mapper.Map<IEnumerable<VehicleInOutRecord>>(records);
        }

        public async Task<IEnumerable<VehicleCheckInResponseDto>> GetAllInRecordsAsync()
        {
            var records = await _context.VehicleCheckInCheckOut
               .Where(v => v.Status == "Checked In")
               .ToListAsync();

            return _mapper.Map<IEnumerable<VehicleCheckInResponseDto>>(records);
       
        }
        
        public async Task<IEnumerable<VehicleCheckOutResponseDto>> GetAllOutRecordsAsync()
        {
            var records = await _context.VehicleCheckInCheckOut
                .Where(v => v.Status == "Checked Out") 
                .ToListAsync();

            return _mapper.Map<IEnumerable<VehicleCheckOutResponseDto>>(records);
           
        }

        private async Task<string> SaveImageAsync(IFormFile file)
        {
            if (!Directory.Exists(_uploadFolder))
            {
                Directory.CreateDirectory(_uploadFolder);
            }
            string uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

            var filePath = Path.Combine(_uploadFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Path.Combine("uploads", uniqueFileName);
        }

        public async Task<VehicleInOutResponse> GetCheckInOutDetailsById(Guid branchId)
        {
            var records = await _context.VehicleCheckInCheckOut
                                        .Where(x => x.BranchId == branchId)
                                        .ToListAsync();

            var mappedRecords = _mapper.Map<IEnumerable<VehicleInOutRecord>>(records);
            int vehicleInOutCount = mappedRecords.Count();

            return new VehicleInOutResponse
            {
                Records = mappedRecords,
                Count = vehicleInOutCount
            };
        }

        public async Task<VehicleInOutResponse> GetCheckInListByBranchId(Guid branchId)
        {
            var records = await _context.VehicleCheckInCheckOut
                                        .Where(x => x.BranchId == branchId && x.Status== "Checked In")
                                        .ToListAsync();

            var mappedRecords = _mapper.Map<IEnumerable<VehicleInOutRecord>>(records);
            int vehicleInOutCount = mappedRecords.Count();

            return new VehicleInOutResponse
            {
                Records = mappedRecords,
                Count = vehicleInOutCount
            };
        }

        public async Task<VehicleInOutResponse> GetCheckOutListByBranchId(Guid branchId)
        {
            var records = await _context.VehicleCheckInCheckOut
                                        .Where(x => x.BranchId == branchId && x.Status== "Checked Out")
                                        .ToListAsync();

            var mappedRecords = _mapper.Map<IEnumerable<VehicleInOutRecord>>(records);
            int vehicleInOutCount = mappedRecords.Count();

            return new VehicleInOutResponse
            {
                Records = mappedRecords,
                Count = vehicleInOutCount
            };
        }

    }
}
