using Application.Dtos;
using Application.Interfaces;
using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CRMPROJECTAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompaniesController : ControllerBase
    {
        private readonly ICompanyService _companyService;

        public CompaniesController(ICompanyService companyService)
        {
            _companyService = companyService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCompanies()
        {
            var companies = await _companyService.GetAllCompaniesAsync();
            return Ok(companies);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCompanyById(Guid id)
        {
            var company = await _companyService.GetCompanyByIdAsync(id);
            if (company == null) return NotFound();
            return Ok(company);
        }

        [HttpPost]
        public async Task<IActionResult> AddCompany([FromBody] AddCompanyDto companyDto)
        {
            var company = await _companyService.AddCompanyAsync(companyDto);

            if (company == null)
                return BadRequest("Error creating company.");

            return Ok(company);
            //return CreatedAtAction(nameof(GetCompanyById), new { id = addedCompany.CompanyId }, addedCompany);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCompany(Guid id, [FromBody] AddCompanyDto companyDto)
        {
            var updatedCompany = await _companyService.UpdateCompanyAsync(id, companyDto);
            if (updatedCompany == null) return NotFound();
            return Ok(updatedCompany);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCompany(Guid id)
        {
            var result = await _companyService.DeleteCompanyAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}


