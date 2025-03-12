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
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IJwtTokenService _jwtTokenService;

        public CompanyService(ApplicationDbContext context, IMapper mapper, IJwtTokenService jwtTokenService)
        {
            _context = context;
            _mapper = mapper;
            _jwtTokenService = jwtTokenService;
        }

        public async Task<IEnumerable<CompanyResponseDto>> GetAllCompaniesAsync()
        {
            var companies = await _context.Companies.ToListAsync();
            return _mapper.Map<IEnumerable<CompanyResponseDto>>(companies);
        }

        public async Task<CompanyResponseDto?> GetCompanyByIdAsync(Guid id)
        {
            var company = await _context.Companies.FindAsync(id);
            return company == null ? null : _mapper.Map<CompanyResponseDto>(company);
        }

        public async Task<CompanyResponseDto> AddCompanyAsync(AddCompanyDto companyDto)
        {
            var userId = _jwtTokenService.GetUserIdFromToken();
            var company = _mapper.Map<Company>(companyDto);
            company.CompanyId = Guid.NewGuid(); 
            company.CreatedBy = userId;
            _context.Companies.Add(company);
            await _context.SaveChangesAsync();
            return _mapper.Map<CompanyResponseDto>(company);
        }

        public async Task<CompanyResponseDto?> UpdateCompanyAsync(Guid id, AddCompanyDto companyDto)
        {
            var userId = _jwtTokenService.GetUserIdFromToken();
            var existingCompany = await _context.Companies.FindAsync(id);
            if (existingCompany == null) return null;

            _mapper.Map(companyDto, existingCompany);
            existingCompany.UpdatedBy = userId;
            _context.Companies.Update(existingCompany);
            await _context.SaveChangesAsync();
            return _mapper.Map<CompanyResponseDto>(existingCompany);
        }

        public async Task<bool> DeleteCompanyAsync(Guid id)
        {
            var company = await _context.Companies.FindAsync(id);
            if (company == null) return false;

            _context.Companies.Remove(company);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

