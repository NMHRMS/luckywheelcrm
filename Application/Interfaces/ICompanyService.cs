using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.ResponseDto;

namespace Application.Interfaces
{
    public interface ICompanyService
    {
        Task<IEnumerable<CompanyResponseDto>> GetAllCompaniesAsync();
        Task<CompanyResponseDto?> GetCompanyByIdAsync(Guid id);
        Task<CompanyResponseDto> AddCompanyAsync(AddCompanyDto companyDto);
        Task<CompanyResponseDto?> UpdateCompanyAsync(Guid id, AddCompanyDto companyDto);
        Task<bool> DeleteCompanyAsync(Guid id);
    }

}



//Task<IEnumerable<AddCompanyDto>> GetAllCompaniesAsync();
//Task<AddCompanyDto?> GetCompanyByIdAsync(Guid id);
//Task<AddCompanyDto> AddCompanyAsync(AddCompanyDto companyDto);
//Task<AddCompanyDto?> UpdateCompanyAsync(Guid id, AddCompanyDto companyDto);
//Task<bool> DeleteCompanyAsync(Guid id);

