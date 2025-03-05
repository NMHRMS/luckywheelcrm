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
            CreateMap<State, StateDto>();
            CreateMap<State, StateResponseDto>();
            CreateMap<District, DistrictDto>();
            CreateMap<District, DistrictResponseDto>();
            CreateMap<Role, AddRoleDto>().ReverseMap();
            CreateMap<Role, RoleResponseDto>();
            CreateMap<User, AddUserDto>().ReverseMap();
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<User, UserResponseDto>();
            CreateMap<Product, AddProductDto>().ReverseMap();
            CreateMap<Product, ProductResponseDto>();
            CreateMap<LeadReview, LeadReviewDto>().ReverseMap();
            CreateMap<LeadReview, LeadReviewResponseDto>()
                 .ForMember(dest => dest.ReviewByName,
                      opt => opt.MapFrom(src => src.ReviewByUser != null ? $"{src.ReviewByUser.FirstName}" : null));
            CreateMap<CallRecord, CallRecordDto>().ReverseMap();
            CreateMap<CallRecord, CallRecordResponseDto>();
            CreateMap<Category, CategoryDto>().ReverseMap();
            CreateMap<Category, CategoryResponseDto>();
            CreateMap<VehicleInOutRecord, VehicleCheckInDto>().ReverseMap();
            CreateMap<VehicleInOutRecord, VehicleCheckOutDto>().ReverseMap();
            CreateMap<VehicleInOutRecord, VehicleCheckInResponseDto>();
            CreateMap<VehicleInOutRecord, VehicleCheckOutResponseDto>(); 
            CreateMap<Lead, LeadDto>().ReverseMap();
            CreateMap<Lead, LeadResponseDto>()
                .ForMember(dest => dest.LeadSourceName, opt => opt.MapFrom(src => src.LeadSource.SourceName))
                .ForMember(dest => dest.DistrictName, opt => opt.MapFrom(src => src.District.DistrictName))
                .ForMember(dest => dest.StateName, opt => opt.MapFrom(src => src.State.StateName))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.CategoryName))
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.ProductName))
                .ForMember(dest => dest.AssignedToName,
                      opt => opt.MapFrom(src => src.AssignedToUser != null? $"{src.AssignedToUser.FirstName}": null))
                .ForMember(dest => dest.LastRevertedByName,
                      opt => opt.MapFrom(src => src.RevertedByUser != null? $"{src.RevertedByUser.FirstName}": null));
            CreateMap<LeadSource, AddLeadSourceDto>().ReverseMap();
            CreateMap<LeadSource, LeadSourceResponseDto>();
            CreateMap<LeadTracking, LeadResponseDto>();
            CreateMap<LeadTracking, LeadTrackingResponseDto>();
            CreateMap<LeadAssignmentDto, LeadTracking>()
                .ForMember(dest => dest.AssignedDate, opt => opt.MapFrom(src => DateTime.UtcNow));
            CreateMap<LeadCallUpdateDto, Lead>();
            CreateMap<LeadCallUpdateDto, LeadAssignmentDto>()
                .ForMember(dest => dest.LeadID, opt => opt.Ignore()) 
                .ForMember(dest => dest.AssignedDate, opt => opt.Ignore()); 
        }
    }
    }