﻿using Application.Dtos;
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

        public async Task<LeadsSegregatedResponseDto> GetLatestUploadedLeadsAsync()
        {
            var latestExcelName = await _context.Leads
                .OrderByDescending(l => l.CreateDate)
                .Select(l => l.ExcelName)
                .FirstOrDefaultAsync();

            if (latestExcelName == null)
                return new LeadsSegregatedResponseDto();


            var leadList = await _context.Leads
                .Where(l => l.ExcelName == latestExcelName)
                .Where(l => l.AssignedTo == null)
                .Include(l => l.District)
                .Include(l => l.State)
                .Include(l => l.LeadSource)
                .Include(l => l.Category)
                .Include(l => l.Product)
                .Include(l => l.AssignedToUser)
                .ToListAsync();

            var groupedLeads = leadList
                .GroupBy(l => l.MobileNo)
                .ToList();

            var newLeads = groupedLeads
                .Where(g => g.Count() == 1)
                .Select(g => g.First())
                .Where(l => l.Status != "Blocked")
                .OrderBy(l => l.CreateDate)
                .ToList();

            var duplicateLeads = groupedLeads
                .Where(g => g.Count() > 1)
                .SelectMany(g => g)
                .Where(l => l.Status != "Blocked")
                .OrderBy(l => l.CreateDate)
                .ToList();

            var blockedLeads = leadList
                .Where(l => l.Status == "Blocked")
                .OrderBy(l => l.CreateDate)
                .ToList();

            return new LeadsSegregatedResponseDto
            {
                NewLeads = _mapper.Map<IEnumerable<LeadResponseDto>>(newLeads),
                DuplicateLeads = _mapper.Map<IEnumerable<LeadResponseDto>>(duplicateLeads),
                BlockedLeads = _mapper.Map<IEnumerable<LeadResponseDto>>(blockedLeads),
                NewLeadsCount = newLeads.Count(),
                DuplicateLeadsCount = duplicateLeads.Count(),
                BlockedLeadsCount = blockedLeads.Count()
            };
        }

        public async Task<LeadsSegregatedResponseDto> GetAllLeadsAsync()
        {
            var leads = await _context.Leads.ToListAsync();

            var leadList = await _context.Leads
                .Include(l => l.District)
                .Include(l => l.State)
                .Include(l => l.LeadSource)
                .Include(l => l.Category)
                .Include(l => l.Product)
                .Include(l => l.AssignedToUser)
                .ToListAsync();
            var groupedLeads = leads.GroupBy(l => l.MobileNo).ToList();

            var newLeads = groupedLeads
                .Where(g => g.Count() == 1)
                .Select(g => g.First())
                .Where(l => l.Status != "Blocked")
                .OrderBy(l => l.CreateDate)
                .ToList();

            var duplicateLeads = groupedLeads
                .Where(g => g.Count() > 1)
                .SelectMany(g => g)
                .Where(l => l.AssignedTo == null && l.Status != "Blocked")
                .OrderBy(l => l.CreateDate)
                .ToList();

            var blockedLeads = leads
                .Where(l => l.Status == "Blocked")
                .OrderBy(l => l.CreateDate)
                .ToList();

            return new LeadsSegregatedResponseDto
            {
                NewLeads = _mapper.Map<IEnumerable<LeadResponseDto>>(newLeads),
                DuplicateLeads = _mapper.Map<IEnumerable<LeadResponseDto>>(duplicateLeads),
                BlockedLeads = _mapper.Map<IEnumerable<LeadResponseDto>>(blockedLeads),
                NewLeadsCount = newLeads.Count(),
                DuplicateLeadsCount = duplicateLeads.Count(),
                BlockedLeadsCount = blockedLeads.Count()
            };
        }

        public async Task<LeadResponseDto?> GetLeadByIdAsync(Guid id)
        {
            var lead = await _context.Leads
                .Include(l => l.District)
                .Include(l => l.State)
                .Include(l => l.LeadSource)
                .Include(l => l.Category)
                .Include(l => l.Product)
                .Include(l => l.AssignedToUser) 
                .FirstOrDefaultAsync(l => l.LeadId == id);
            return lead == null ? null : _mapper.Map<LeadResponseDto>(lead);
        }

        public async Task<LeadResponseDto?> AddLeadAsync(LeadDto leadDto)
        {
            var states = await _context.States.ToDictionaryAsync(s => s.StateName, s => s.StateId);
            var districts = await _context.Districts.ToDictionaryAsync(d => d.DistrictName, d => d.DistrictId);
            var leadSources = await _context.LeadSources.ToDictionaryAsync(ls => ls.SourceName, ls => ls.SourceId);
            var categories = await _context.Categories.ToDictionaryAsync(c => c.CategoryName, c => c.CategoryId);
            var products = await _context.Products.ToDictionaryAsync(p => p.ProductName, p => p.ProductId);

            var users = await _context.Users
                .Select(u => new { FullName = (u.FirstName ?? ""), u.UserId })
                .ToDictionaryAsync(u => u.FullName.Trim(), u => u.UserId);

            var lead = _mapper.Map<Lead>(leadDto);

            lead.StateId = !string.IsNullOrWhiteSpace(leadDto.StateName) && states.ContainsKey(leadDto.StateName)
                ? states[leadDto.StateName]
                : null;
            lead.DistrictId = !string.IsNullOrWhiteSpace(leadDto.DistrictName) && districts.ContainsKey(leadDto.DistrictName)
                ? districts[leadDto.DistrictName]
                : null;
            lead.LeadSourceId = !string.IsNullOrWhiteSpace(leadDto.LeadSourceName) && leadSources.ContainsKey(leadDto.LeadSourceName)
                ? leadSources[leadDto.LeadSourceName]
                : null;
            lead.CategoryId = !string.IsNullOrWhiteSpace(leadDto.CategoryName) && categories.ContainsKey(leadDto.CategoryName)
                ? categories[leadDto.CategoryName]
                : null;
            lead.ProductId = !string.IsNullOrWhiteSpace(leadDto.ProductName) && products.ContainsKey(leadDto.ProductName)
                ? products[leadDto.ProductName]
                : null;

            lead.AssignedTo = !string.IsNullOrWhiteSpace(leadDto.AssignedToName) && users.ContainsKey(leadDto.AssignedToName)
                ? users[leadDto.AssignedToName]
                : null;

            lead.LeadId = Guid.NewGuid();
            _context.Leads.Add(lead);
            await _context.SaveChangesAsync();

            return _mapper.Map<LeadResponseDto>(lead);
        }

        public async Task<LeadResponseDto?> UpdateLeadAsync(Guid id, LeadDto leadDto)
        {
            var existingLead = await _context.Leads.FindAsync(id);
            if (existingLead == null) return null;

            var states = await _context.States.ToDictionaryAsync(s => s.StateName, s => s.StateId);
            var districts = await _context.Districts.ToDictionaryAsync(d => d.DistrictName, d => d.DistrictId);
            var leadSources = await _context.LeadSources.ToDictionaryAsync(ls => ls.SourceName, ls => ls.SourceId);
            var categories = await _context.Categories.ToDictionaryAsync(c => c.CategoryName, c => c.CategoryId);
            var products = await _context.Products.ToDictionaryAsync(p => p.ProductName, p => p.ProductId);

            var users = await _context.Users
                .Select(u => new { FullName = (u.FirstName ?? "") + " " + (u.LastName ?? ""), u.UserId })
                .ToDictionaryAsync(u => u.FullName.Trim(), u => u.UserId);

            _mapper.Map(leadDto, existingLead);

            existingLead.StateId = !string.IsNullOrWhiteSpace(leadDto.StateName) && states.ContainsKey(leadDto.StateName)
                ? states[leadDto.StateName]
                : existingLead.StateId;
            existingLead.DistrictId = !string.IsNullOrWhiteSpace(leadDto.DistrictName) && districts.ContainsKey(leadDto.DistrictName)
                ? districts[leadDto.DistrictName]
                : existingLead.DistrictId;
            existingLead.LeadSourceId = !string.IsNullOrWhiteSpace(leadDto.LeadSourceName) && leadSources.ContainsKey(leadDto.LeadSourceName)
                ? leadSources[leadDto.LeadSourceName]
                : existingLead.LeadSourceId;
            existingLead.CategoryId = !string.IsNullOrWhiteSpace(leadDto.CategoryName) && categories.ContainsKey(leadDto.CategoryName)
                ? categories[leadDto.CategoryName]
                : existingLead.CategoryId;
            existingLead.ProductId = !string.IsNullOrWhiteSpace(leadDto.ProductName) && products.ContainsKey(leadDto.ProductName)
                ? products[leadDto.ProductName]
                : existingLead.ProductId;

            var assignedByUserId = _jwtTokenService.GetUserIdFromToken();

            // Handle Lead Assignment with Permission Check
            if (!string.IsNullOrWhiteSpace(leadDto.AssignedToName) && users.ContainsKey(leadDto.AssignedToName))
            {
                var newAssignedTo = users[leadDto.AssignedToName];

                if (existingLead.AssignedTo != newAssignedTo) // Lead is being reassigned
                {
                    var assignerUser = await _context.Users
                        .Include(u => u.AssignedUsers)
                        .FirstOrDefaultAsync(u => u.UserId == assignedByUserId);

                    bool hasPermission = assignerUser?.AssignedUsers
                        .Any(u => u.UserId == newAssignedTo) ?? false;

                    if (!hasPermission)
                    {
                        throw new UnauthorizedAccessException("You do not have permission to assign this lead.");
                    }

                    existingLead.AssignedTo = newAssignedTo;
                    existingLead.AssignedDate = DateTime.UtcNow;

                    // Add an entry in the LeadTracking table
                    var leadTracking = new LeadTracking
                    {
                        LeadId = existingLead.LeadId,
                        AssignedTo = newAssignedTo,
                        AssignedBy = (Guid)assignedByUserId,
                        AssignedDate = DateTime.UtcNow
                    };
                    await _context.LeadsTracking.AddAsync(leadTracking);
                }
            }

            existingLead.UpdateDate = DateTime.UtcNow;
            _context.Leads.Update(existingLead);
            await _context.SaveChangesAsync();

            var response = _mapper.Map<LeadResponseDto>(existingLead);

            // Ensure AssignedToName is included in the response
            response.AssignedToName = existingLead.AssignedTo.HasValue && users.ContainsValue(existingLead.AssignedTo.Value)
                ? users.FirstOrDefault(x => x.Value == existingLead.AssignedTo.Value).Key
                : null;

            return response;
        }

        public async Task<bool> CheckIfFileExists(string fileName)
        {
            return await _context.Leads.AnyAsync(l => l.ExcelName == fileName);
        }

        public async Task UploadLeadsFromExcelAsync(IFormFile file, string fileName)
        {
            bool fileExists = await _context.Leads.AnyAsync(l => l.ExcelName == fileName);
            if (fileExists)
            {
                throw new Exception("A file with this name already exists. Please rename the file before uploading.");
            }

            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);
            using var package = new ExcelPackage(stream);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            var worksheet = package.Workbook.Worksheets[0];
            var rowCount = worksheet.Dimension.Rows;

            var leads = new List<Lead>();

            var states = await _context.States.ToDictionaryAsync(s => s.StateName, s => s.StateId);
            var districts = await _context.Districts.ToDictionaryAsync(d => d.DistrictName, d => d.DistrictId);
            var products = await _context.Products.ToDictionaryAsync(p => p.ProductName, p => p.ProductId);


            var companyId = _jwtTokenService.GetCompanyIdFromToken();

            for (int row = 2; row <= rowCount; row++)
            {
                var stateName = worksheet.Cells[row, 2].Value?.ToString();
                var districtName = worksheet.Cells[row, 3].Value?.ToString();
                var ownerName = worksheet.Cells[row, 4].Value?.ToString();
                var fatherName = worksheet.Cells[row, 5].Value?.ToString();
                var mobileNo = worksheet.Cells[row, 6].Value?.ToString();
                var currentAddress = worksheet.Cells[row, 7].Value?.ToString();
                var currentVehicle = worksheet.Cells[row, 8].Value?.ToString();
                var chasisNo = worksheet.Cells[row, 9].Value?.ToString();
                var registrationNo = worksheet.Cells[row, 10].Value?.ToString();
                var registrationDateStr = worksheet.Cells[row, 11].Value?.ToString();
                var productName = worksheet.Cells[row, 12].Value?.ToString();
                var modelName = worksheet.Cells[row, 13].Value?.ToString();

                //int? chasisNo = int.TryParse(chasisNoStr, out int parsedChasisNo) ? parsedChasisNo : (int?)null;
                DateTime? registrationDate = DateTime.TryParse(registrationDateStr, out DateTime regDate) ? regDate : (DateTime?)null;

                var lead = new Lead
                {
                    ExcelName = fileName,
                    OwnerName = ownerName ?? "Unknown",
                    FatherName = fatherName ?? "N/A",
                    MobileNo = mobileNo ?? "N/A",
                    StateId = !string.IsNullOrWhiteSpace(stateName) && states.ContainsKey(stateName) ? states[stateName] : (Guid?)null,
                    DistrictId = !string.IsNullOrWhiteSpace(districtName) && districts.ContainsKey(districtName) ? districts[districtName] : (Guid?)null,
                    CurrentAddress = currentAddress ?? "N/A",
                    CurrentVehicle = currentVehicle ?? "None",
                    ChasisNo = chasisNo ?? null,
                    RegistrationNo = registrationNo ?? null,
                    RegistrationDate = registrationDate ?? null,
                    ModelName = modelName ?? null,
                    ProductId = !string.IsNullOrWhiteSpace(productName) && products.ContainsKey(productName) ? products[productName] : null,
                    LeadType = "N/A",   
                    Status = "Not Called",
                    CreateDate = DateTime.UtcNow,
                    UpdateDate = DateTime.UtcNow,
                    AssignedTo = null,
                    AssignedDate = null,
                    FollowUpDate = null,
                    LastRevertedBy = null,
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
                assignmentDto.AssignedDate = DateTime.UtcNow;

                await _leadAssignService.AssignLeadAsync(assignmentDto);
            }
            
            await _context.SaveChangesAsync();
            return _mapper.Map<LeadResponseDto>(lead);
        }

        public async Task<IEnumerable<LeadResponseDto>> GetLeadsByAssignmentAsync(bool assigned)
        {
            var leads = await _context.Leads
                .Include(l => l.District)
                .Include(l => l.State)
                .Include(l => l.LeadSource)
                .Include(l => l.Category)
                .Include(l => l.Product)
                .Include(l => l.AssignedToUser)
                .Where(l => assigned ? l.AssignedTo != null : l.AssignedTo == null)
                .ToListAsync();
            return _mapper.Map<IEnumerable<LeadResponseDto>>(leads);
        }

        public async Task<IEnumerable<LeadResponseDto>> GetAssignedLeadsAsync(Guid userId)
        {
            var leads = await _context.Leads
                .Include(l => l.District)
                .Include(l => l.State)
                .Include(l => l.LeadSource)
                .Include(l => l.Category)
                .Include(l => l.Product)
                .Include(l => l.AssignedToUser)
                .OrderBy( l => l.AssignedDate)
                .Where(lt => lt.AssignedTo == userId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<LeadResponseDto>>(leads);
        }

        public async Task<IEnumerable<LeadResponseDto>> SearchLeadsAsync(string? name, string? state, string? district, string? modelName)
        {
            var query = _context.Leads.AsQueryable();

            if (!string.IsNullOrEmpty(name))
                query = query.Where(l => l.OwnerName.Contains(name));

            //if (!string.IsNullOrEmpty(state))
            //    query = query.Where(l => l.StateName.Contains(state));

            //if (!string.IsNullOrEmpty(district))
            //    query = query.Where(l => l.DistrictName.Contains(district));

            if (!string.IsNullOrEmpty(modelName))
                query = query.Where(l => l.ModelName.Contains(modelName));

            var leads = await query.ToListAsync();
            return _mapper.Map<IEnumerable<LeadResponseDto>>(leads);
        }

        public async Task<IEnumerable<LeadResponseDto>> GetTodaysAssignedLeadsAsync(Guid userId)
        {
            var today = DateTime.UtcNow.Date;
            var leads = await _context.Leads
                .Include(l => l.District)
                .Include(l => l.State)
                .Include(l => l.LeadSource)
                .Include(l => l.Category)
                .Include(l => l.Product)
                .Include(l => l.AssignedToUser)
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
            var leadList = _context.Leads
                .Include(l => l.District)
                .Include(l => l.State)
                .Include(l => l.LeadSource)
                .Include(l => l.Category)
                .Include(l => l.Product)
                .Include(l => l.AssignedToUser)
                .ToList();
            int totalLeads = leadList.Count;
            return new DashboardLeadResponseDto
            {
                leads = _mapper.Map<IEnumerable<LeadResponseDto>>(leadList),
                totalLeadsCount = totalLeads
            };
        } 

        public async Task<UserLeadsStatusResponseDto> GetDashboardLeads(Guid userId)
        {
            var leadList = _context.Leads.Where(u => u.AssignedTo == userId).ToList();
            int totalLeads = leadList.Count;

            var InterestedList = leadList.Where(l => l.Status == "Psitive").ToList();
            int InterestedCount = InterestedList.Count;

            var NotInterestedList = leadList.Where(l => l.Status == "Negative").ToList();
            int NotInterestedCount = NotInterestedList.Count;

            var NotCalledList = leadList.Where(l => l.Status == "Not Called").ToList();
            int NotCalledCount = NotCalledList.Count;

            var ConnectedList = leadList.Where(l => l.Status == "Connected").ToList();
            int ConnectedCount = ConnectedList.Count;

            var NotConnectedList = leadList.Where(l => l.Status == "Not Connected").ToList();
            int NotConnectedCount = NotConnectedList.Count;

            var PendingList = leadList.Where(l => l.Status == "Pending").ToList();
            int PendingCount = PendingList.Count;

            var ClosedList = leadList.Where(l => l.Status == "Closed").ToList();
            int ClosedCount = ClosedList.Count;

            return new UserLeadsStatusResponseDto
            {
                leads = leadList,
                totalAssignedCount = totalLeads,
                InterestedCount = InterestedCount,
                NotInterestedCount = NotInterestedCount,
                NotCalledCount = NotCalledCount,
                ConnectedCount = ConnectedCount,
                NotConnectedCount = NotConnectedCount,
                PendingCount = PendingCount,
                ClosedCount = ClosedCount

            };
        }

        public async Task<LeadsByExcelNameResponseDto> GetLeadsByExcelName(string excelName)
        {
            var leadList = await _context.Leads
                .Where(x => x.ExcelName == excelName)
                .Include(x => x.LeadSource)
                .Include(x => x.District)
                .Include(x => x.State)
                .Include(x => x.Category)
                .Include(x => x.Product)
                .Include(x => x.AssignedToUser)
                .ToListAsync();

            int totalLeads = leadList.Count;
            var assignedList = leadList.Where(x=>x.AssignedTo!=null).ToList();
            int assignedCount = assignedList.Count;
            var notAssignedList = leadList.Where(x=>x.AssignedTo==null).ToList();
            int notAssignedCount = notAssignedList.Count;

            return new LeadsByExcelNameResponseDto
            {
                Leads = _mapper.Map<IEnumerable<LeadResponseDto>>(leadList),
                TotalLeadsCount = totalLeads,
                AssignedLeadsCount=assignedCount,
                NotAssignedLeadsCount=notAssignedCount,
            };
        }

        public async Task<List<LeadListResponseDto>> GetLeadsDataList()
        {
            var excelNames = _context.Leads.Where(x => x.ExcelName != null).Select(x => x.ExcelName).Distinct().ToList();                        
            var responseList = new List<LeadListResponseDto>();

            foreach (var excelName in excelNames)
            {
                var leadList = _context.Leads.Where(x => x.ExcelName == excelName).ToList();
                int totalLeads = leadList.Count;
                var assignedList = leadList.Where(x => x.AssignedTo != null).ToList();
                int assignedCount = assignedList.Count;
                var notAssignedList = leadList.Where(x => x.AssignedTo == null).ToList();
                int notAssignedCount = notAssignedList.Count;

                DateTime? createdDate = leadList.OrderBy(x => x.CreateDate).FirstOrDefault()?.CreateDate;

                var responseDto = new LeadListResponseDto
                {
                    ExcelName = excelName,
                    TotalCount = totalLeads,
                    AssignedCount = assignedCount,
                    NotAssignedCount = notAssignedCount,
                    CreatedDate = createdDate
                };

                responseList.Add(responseDto);
            }

            return responseList;
        }

        public async Task<IEnumerable<LeadResponseDto>> GetLeadsByFollowUpDateAsync(DateTime followUpDate)
        {
            var leads = await _context.Leads
                .Include(l => l.District)
                .Include(l => l.State)
                .Include(l => l.LeadSource)
                .Include(l => l.Category)
                .Include(l => l.Product)
                .Include(l => l.AssignedToUser)
                .Where(l => l.FollowUpDate.HasValue && l.FollowUpDate.Value.Date == followUpDate.Date)
                .ToListAsync();

            return _mapper.Map<IEnumerable<LeadResponseDto>>(leads);
        }

        public async Task<IEnumerable<LeadResponseDto>> GetTodaysFollowUpLeadsAsync(Guid userId)
        {
            var today = DateTime.UtcNow.Date;
            var leads = await _context.Leads
                .Include(l => l.District)
                .Include(l => l.State)
                .Include(l => l.LeadSource)
                .Include(l => l.Category)
                .Include(l => l.Product)
                .Include(l => l.AssignedToUser)
                .Where(l => l.AssignedTo == userId && l.FollowUpDate.HasValue && l.FollowUpDate.Value.Date == today)
                .ToListAsync();
            return _mapper.Map<IEnumerable<LeadResponseDto>>(leads);
        }

        public async Task<IEnumerable<LeadResponseDto>> GetAssignedLeadsByFollowUpDateAsync(Guid userId, DateTime followUpDate)
        {
            var leads = await _context.Leads
                .Include(l => l.District)
                .Include(l => l.State)
                .Include(l => l.LeadSource)
                .Include(l => l.Category)
                .Include(l => l.Product)
                .Include(l => l.AssignedToUser)
                .Where(l => l.AssignedTo == userId && l.FollowUpDate.Value.Date == followUpDate.Date) 
                .ToListAsync();

            return _mapper.Map<IEnumerable<LeadResponseDto>>(leads);
        }

        public async Task<GetDashboardStatusRespDto> GetDashboardListByUserId(Guid userID,DateTime date)
        {
            var leadList = _context.Leads.Where(x => x.AssignedTo == userID && x.AssignedDate.HasValue && x.AssignedDate.Value.Date == date.Date).ToList();
            int assignedLeadsCount = leadList.Count;
            int positiveLeadsCount = leadList.Where(x=>x.Status=="Positive").ToList().Count;
            int negativeLeadsCount = leadList.Where(x=>x.Status=="Negative").ToList().Count;
            int closedLeadsCount = leadList.Where(x=>x.Status=="Closed").ToList().Count;
            return new GetDashboardStatusRespDto
            {
                Leads = leadList,
                AssignedLeadsCount = assignedLeadsCount,
                PositiveLeadsCount = positiveLeadsCount,
                NegativeLeadsCount = negativeLeadsCount,
                ClosedLeadsCount = closedLeadsCount,
            };
        }

        public async Task<IEnumerable<LeadResponseDto>> GetAssignedLeadsByAssignedDateRangeAsync(Guid userId, DateTime startDate, DateTime endDate)
        {
            var leads = await _context.Leads
                .Include(l => l.District)
                .Include(l => l.State)
                .Include(l => l.LeadSource)
                .Include(l => l.Category)
                .Include(l => l.Product)
                .Include(l => l.AssignedToUser)
                .Where(l => l.AssignedTo == userId && l.AssignedDate.Value.Date >= startDate.Date && l.AssignedDate.Value.Date <= endDate.Date)
                .ToListAsync();

            return _mapper.Map<IEnumerable<LeadResponseDto>>(leads);
        }

        public async Task<IEnumerable<LeadResponseDto>> GetAssignedLeadsByFollowUpDateRangeAsync(Guid userId, DateTime startDate, DateTime endDate)
        {
            var leads = await _context.Leads
                .Include(l => l.District)
                .Include(l => l.State)
                .Include(l => l.LeadSource)
                .Include(l => l.Category)
                .Include(l => l.Product)
                .Include(l => l.AssignedToUser)
                .Where(l => l.AssignedTo == userId && l.FollowUpDate.Value.Date >= startDate.Date && l.FollowUpDate.Value.Date <= endDate.Date)
                .ToListAsync();

            return _mapper.Map<IEnumerable<LeadResponseDto>>(leads);
        }

        public async Task<IEnumerable<LeadResponseDto>> GetLeadsByTimeFrameAsync(Guid userId, string timeframe)
        {
            DateTime startDate = DateTime.UtcNow.Date;
            DateTime endDate = DateTime.UtcNow.Date;

            switch (timeframe.ToLower())
            {
                case "day":
                    // Today’s leads
                    break;
                case "week":
                    startDate = startDate.AddDays(-7); // Last 7 days
                    break;
                case "month":
                    startDate = startDate.AddMonths(-1); // Last 30 days
                    break;
                case "year":
                    startDate = startDate.AddYears(-1); // Last year
                    break;
                default:
                    throw new ArgumentException("Invalid timeframe. Use 'day', 'week', 'month', or 'year'.");
            }

            var leads = await _context.Leads
                .Include(l => l.District)
                .Include(l => l.State)
                .Include(l => l.LeadSource)
                .Include(l => l.Category)
                .Include(l => l.Product)
                .Include(l => l.AssignedToUser)
                .Where(l => l.AssignedTo == userId && l.AssignedDate.Value.Date >= startDate && l.AssignedDate.Value.Date <= endDate)
                .ToListAsync();

            return _mapper.Map<IEnumerable<LeadResponseDto>>(leads);
        }
    }
}
