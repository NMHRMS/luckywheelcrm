﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.ResponseDto;

namespace Application.Interfaces
{
    public interface ILeadSourceService
    {
        Task<IEnumerable<LeadSourceResponseDto>> GetAllLeadSourcesAsync();
        Task<LeadSourceResponseDto?> GetLeadSourceByIdAsync(Guid id);
        Task<LeadSourceResponseDto> AddLeadSourceAsync(AddLeadSourceDto leadSourceDto);
        Task<LeadSourceResponseDto?> UpdateLeadSourceAsync(Guid id, AddLeadSourceDto leadSourceDto);
        Task<bool> DeleteLeadSourceAsync(Guid id);
    }
}
