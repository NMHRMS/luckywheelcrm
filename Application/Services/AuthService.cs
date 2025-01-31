using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.Dtos;
using Application.Interfaces;
using AutoMapper;
using Domain.Models;
using Infrastructure.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public AuthService(ApplicationDbContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _configuration = configuration;
        }

        public async Task<AddUserDto?> LoginAsync(string email, string password)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.EmailId == email && u.Password == password);

            if (user == null)
                return null;

            var token = GenerateJwtToken(user);
            var userDto = _mapper.Map<AddUserDto>(user);
            userDto.Token = token;

            return userDto;
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
        {
          new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
          new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"), 
          new Claim(ClaimTypes.Email, user.EmailId),
          new Claim("branchId", user.BranchId.ToString()),
          new Claim("companyId", user.CompanyId.ToString()),
          new Claim("roleId", user.RoleId.ToString())
         };



            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
