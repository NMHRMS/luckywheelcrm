using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Interfaces;
using AutoMapper;
using Domain.Models;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public AuthService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<AddUserDto?> LoginAsync(string email, string password)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.EmailId == email && u.Password == password);

            return user != null ? _mapper.Map<AddUserDto>(user) : null;
        }
    }
}


//namespace Application.Services
//{
//    public class AuthService : IAuthService
//    {
//        private readonly ApplicationDbContext _context;

//        public AuthService(ApplicationDbContext context)
//        {
//            _context = context;
//        }

//        public async Task<User?> Add(string email, string password)
//        {
//            return await _context.AuthenticateUserAsync(email, password);
//        }
//    }
//}
