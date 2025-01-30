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
            CreateMap<User, UserResponseDto>();
            CreateMap<Product, AddProductDto>().ReverseMap();
            CreateMap<Product, ProductResponseDto>();
            CreateMap<Lead, LeadDto>().ReverseMap();
            CreateMap<Lead, LeadResponseDto>();
            CreateMap<LeadReview, LeadReviewDto>().ReverseMap();
            CreateMap<LeadReview, LeadReviewResponseDto>();
            CreateMap<CallRecord, CallRecordDto>().ReverseMap();
            CreateMap<CallRecord, CallRecordResponseDto>();
            CreateMap<VehicleInOutRecord, VehicleCheckInDto>().ReverseMap();
            CreateMap<VehicleInOutRecord, VehicleCheckOutDto>().ReverseMap();
            CreateMap<VehicleInOutRecord, VehicleCheckInResponseDto>();
            CreateMap<VehicleInOutRecord, VehicleCheckOutResponseDto>(); // Add this line
            CreateMap<LeadTracking, LeadTrackingDto>().ReverseMap();
            CreateMap<LeadTracking, LeadTrackingResponseDto>();
            CreateMap<LeadAssignmentDto, LeadTracking>()
                .ForMember(dest => dest.AssignedDate, opt => opt.MapFrom(src => DateTime.UtcNow));
        }
    }
    }


        //CreateMap<LeadTracking, LeadTrackingDto>()
        //    .ForMember(dest => dest.AssignedToUser, opt => opt.MapFrom(src => src.AssignedToUser.UserName))
        //    .ForMember(dest => dest.AssignedByUser, opt => opt.MapFrom(src => src.AssignedByUser.UserName));