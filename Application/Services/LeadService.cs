using Application.Dtos;
using Application.Interfaces;
using Application.ResponseDto;
using Application.Services;
using AutoMapper;
using Domain.Models;
using Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;

namespace Application.Services
{
    public class LeadService : ILeadService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILeadAssignService _leadAssignService;
        private readonly IJwtTokenService _jwtTokenService;

        public LeadService(ApplicationDbContext context, IMapper mapper, ILeadAssignService leadAssignService, IJwtTokenService jwtTokenService)
        {
            _context = context;
            _mapper = mapper;
            _leadAssignService = leadAssignService;
            _jwtTokenService = jwtTokenService;  
        }

        public async Task<IEnumerable<LeadResponseDto>> GetAllLeadsAsync()
        {
            var leads = await _context.Leads.ToListAsync();
            return _mapper.Map<IEnumerable<LeadResponseDto>>(leads);
        }

        public async Task<LeadResponseDto?> GetLeadByIdAsync(Guid id)
        {
            var lead = await _context.Leads.FindAsync(id);
            return lead == null ? null : _mapper.Map<LeadResponseDto>(lead);
        }

        public async Task<LeadResponseDto> AddLeadAsync(LeadDto leadDto)
        {
            var lead = _mapper.Map<Lead>(leadDto);
            lead.LeadId = Guid.NewGuid();
            _context.Leads.Add(lead);
            await _context.SaveChangesAsync();
            return _mapper.Map<LeadResponseDto>(lead);
        }

        public async Task<LeadResponseDto?> UpdateLeadAsync(Guid id, LeadDto leadDto)
        {
            var existingLead = await _context.Leads.FindAsync(id);
            if (existingLead == null) return null;

            _mapper.Map(leadDto, existingLead);
            _context.Leads.Update(existingLead);
            await _context.SaveChangesAsync();
            return _mapper.Map<LeadResponseDto>(existingLead);
        }

        public async Task UploadLeadsFromExcelAsync(IFormFile file)
        {
            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);
            using var package = new ExcelPackage(stream);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            var worksheet = package.Workbook.Worksheets[0];
            var rowCount = worksheet.Dimension.Rows;

            var leads = new List<Lead>();
            for (int row = 1; row <= rowCount; row++)
            {
                Guid? assignedToUser = null; ;
                Guid? product = null;
                var companyId = _jwtTokenService.GetCompanyIdFromToken();
                var lead = new Lead
                {
                    LeadSource = null,
                    ExcelName = file.FileName,
                    OwnerName = worksheet.Cells[row, 7].Value?.ToString() ?? "Unknown",
                    FatherName = worksheet.Cells[row, 8].Value?.ToString(),
                    MobileNo = worksheet.Cells[row, 14].Value?.ToString() ?? "N/A",
                    OfficeName = worksheet.Cells[row, 3].Value?.ToString(),
                    DistrictName = worksheet.Cells[row, 4].Value?.ToString() ?? "Unknown",
                    CurrentAddress = worksheet.Cells[row, 9].Value?.ToString() ?? "N/A",
                    RegistrationNo = worksheet.Cells[row, 5].Value?.ToString(),
                    RegistrationDate = DateTime.TryParse(worksheet.Cells[row, 6].Value?.ToString(), out DateTime regDate) ? regDate : (DateTime?)null,
                    VehicleClass = worksheet.Cells[row, 10].Value?.ToString(),
                    StateName = worksheet.Cells[row, 2].Value?.ToString() ?? "Unknown",
                    LadenWeight = null,
                    ModelName = worksheet.Cells[row, 13].Value?.ToString(),
                    DealerName = worksheet.Cells[row, 15].Value?.ToString(),
                    ProductId = product,
                    LeadType = "General",
                    Status = "Not Called",
                    CreateDate = DateTime.UtcNow,
                    UpdateDate = DateTime.UtcNow,
                    AssignedTo = assignedToUser,
                    AssignedDate = null,
                    FollowUpDate = null,
                    Remark = null,
                    LeadId = Guid.NewGuid(),
                    CompanyId = companyId,
                };

                leads.Add(lead);
            }

            try
            {
                await _context.Leads.AddRangeAsync(leads);

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }

                throw new Exception("Error uploading leads: An error occurred while saving the entity changes.", ex);
            }
        }

        public async Task<LeadResponseDto> UpdateLeadCallsAsync(Guid leadId, LeadCallUpdateDto updateDto)
        {
            var lead = await _context.Leads.FindAsync(leadId);
            if (lead == null)
                return null; 

            lead.Status = updateDto.Status;
            lead.FollowUpDate = updateDto.FollowUpDate;
            lead.Remark = updateDto.Remark;
            lead.LeadType = updateDto.LeadType;

            var currentUserId = _jwtTokenService.GetUserIdFromToken();
            if (currentUserId == null)
                throw new Exception("User not authenticated");

            if (updateDto.AssignedTo != Guid.Empty && lead.AssignedTo != updateDto.AssignedTo)
            {
                var assignmentDto = _mapper.Map<LeadAssignmentDto>(updateDto);
                assignmentDto.LeadID = leadId;
                assignmentDto.AssignedBy = currentUserId.Value; 
                assignmentDto.AssignedDate = DateTime.UtcNow;

                await _leadAssignService.AssignLeadAsync(assignmentDto);
            }
            
            await _context.SaveChangesAsync();
            return _mapper.Map<LeadResponseDto>(lead);
        }

        public async Task<IEnumerable<LeadResponseDto>> GetLeadsByAssignmentAsync(bool assigned)
        {
            var leads = await _context.Leads
                .Where(l => assigned ? l.AssignedTo != null : l.AssignedTo == null)
                .ToListAsync();
            return _mapper.Map<IEnumerable<LeadResponseDto>>(leads);
        }

        public async Task<IEnumerable<LeadResponseDto>> SearchLeadsAsync(string? name, string? state, string? district, string? modelName, string? dealerName)
        {
            var query = _context.Leads.AsQueryable();

            if (!string.IsNullOrEmpty(name))
                query = query.Where(l => l.OwnerName.Contains(name));

            if (!string.IsNullOrEmpty(state))
                query = query.Where(l => l.StateName.Contains(state));

            if (!string.IsNullOrEmpty(district))
                query = query.Where(l => l.DistrictName.Contains(district));

            if (!string.IsNullOrEmpty(modelName))
                query = query.Where(l => l.ModelName.Contains(modelName));

            if (!string.IsNullOrEmpty(dealerName))
                query = query.Where(l => l.DealerName.Contains(dealerName));

            var leads = await query.ToListAsync();
            return _mapper.Map<IEnumerable<LeadResponseDto>>(leads);
        }

        public async Task<IEnumerable<LeadResponseDto>> GetAssignedLeadsAsync(Guid userId)
        {
            var leads = await _context.Leads
                .Where(lt => lt.AssignedTo == userId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<LeadResponseDto>>(leads);
        }
    
        public async Task<IEnumerable<LeadResponseDto>> GetTodaysAssignedLeadsAsync(Guid userId)
        {
            var today = DateTime.UtcNow.Date;
            var leads = await _context.Leads
                .Where(l => l.AssignedTo == userId && l.AssignedDate.HasValue && l.AssignedDate.Value.Date == today)
                .ToListAsync();
            return _mapper.Map<IEnumerable<LeadResponseDto>>(leads);
        }

        public async Task<bool> DeleteLeadAsync(Guid id)
        {
            var lead = await _context.Leads.FindAsync(id);
            if (lead == null) return false;

            _context.Leads.Remove(lead);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<DashboardLeadResponseDto> GetDashboardLeads()
        {
            var leadList = _context.Leads.ToList();
            int totalLeads = leadList.Count;
            return new DashboardLeadResponseDto
            {
                leads = leadList,
                totalLeadsCount = totalLeads
            };
        }
    }
}