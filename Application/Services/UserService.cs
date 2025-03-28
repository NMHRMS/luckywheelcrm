﻿using System;
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
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IJwtTokenService _jwtTokenService;

        public UserService(ApplicationDbContext context, IMapper mapper, IJwtTokenService jwtTokenService)
        {
            _context = context;
            _mapper = mapper;
            _jwtTokenService = jwtTokenService;
        }

        public async Task<IEnumerable<UserResponseDto>> GetAllUsersAsync()
        {
            var users = await _context.Users.ToListAsync();
            return _mapper.Map<IEnumerable<UserResponseDto>>(users);
        }

        public async Task<UserResponseDto?> GetUserByIdAsync(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            return user == null ? null : _mapper.Map<UserResponseDto>(user);
        }

        public async Task<UserResponseDto> AddUserAsync(UserDto userDto)
        {
            var userId = _jwtTokenService.GetUserIdFromToken();
            var user = _mapper.Map<User>(userDto);
            user.UserId = Guid.NewGuid();   
            user.CreatedBy = userId;
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return _mapper.Map<UserResponseDto>(user);
        }

        public async Task<UserResponseDto?> UpdateUserAsync(Guid id, UserDto userDto)
        {
            var userId = _jwtTokenService.GetUserIdFromToken();
            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null) return null;

            _mapper.Map(userDto, existingUser);
            existingUser.UpdatedBy = userId;
            _context.Users.Update(existingUser);
            await _context.SaveChangesAsync();
            return _mapper.Map<UserResponseDto>(existingUser);
        }

        public async Task<bool> DeleteUserAsync(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}