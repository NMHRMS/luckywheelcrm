using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.ResponseDto;
using AutoMapper;
using Domain.Models;

namespace Application.Mappers
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<Company, AddCompanyDto>().ReverseMap();
            CreateMap<Company, CompanyResponseDto>();
            CreateMap<Branch, AddBranchDto>().ReverseMap();
            CreateMap<Branch, BranchResponseDto>();
            CreateMap<Role, AddRoleDto>().ReverseMap();
            CreateMap<Role, RoleResponseDto>();
            CreateMap<User, AddUserDto>().ReverseMap();
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<User, UserResponseDto>();
            CreateMap<Product, AddProductDto>().ReverseMap();
            CreateMap<Product, ProductResponseDto>();
            CreateMap<LeadReview, LeadReviewDto>().ReverseMap();
            CreateMap<LeadReview, LeadReviewResponseDto>();
            CreateMap<CallRecord, CallRecordDto>().ReverseMap();
            CreateMap<CallRecord, CallRecordResponseDto>();
            CreateMap<Category, CategoryDto>().ReverseMap();
            CreateMap<Category, CategoryResponseDto>();
            CreateMap<VehicleInOutRecord, VehicleCheckInDto>().ReverseMap();
            CreateMap<VehicleInOutRecord, VehicleCheckOutDto>().ReverseMap();
            CreateMap<VehicleInOutRecord, VehicleCheckInResponseDto>();
            CreateMap<VehicleInOutRecord, VehicleCheckOutResponseDto>(); 
            CreateMap<Lead, LeadDto>().ReverseMap();
            CreateMap<Lead, LeadResponseDto>();
            CreateMap<LeadSource, AddLeadSourceDto>().ReverseMap();
            CreateMap<LeadSource, LeadSourceResponseDto>();
            CreateMap<LeadTracking, LeadResponseDto>();
            CreateMap<LeadTracking, LeadTrackingResponseDto>();
            CreateMap<LeadAssignmentDto, LeadTracking>()
                .ForMember(dest => dest.AssignedDate, opt => opt.MapFrom(src => DateTime.UtcNow));
            CreateMap<LeadCallUpdateDto, Lead>();
            CreateMap<LeadCallUpdateDto, LeadAssignmentDto>()
                .ForMember(dest => dest.LeadID, opt => opt.Ignore()) 
                .ForMember(dest => dest.AssignedBy, opt => opt.Ignore()) 
                .ForMember(dest => dest.AssignedDate, opt => opt.Ignore()); 
        }
    }
    }