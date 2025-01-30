using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Domain.Models;

namespace Application.Interfaces
{
    public interface IAuthService
    {
        Task<AddUserDto?> LoginAsync(string email, string password);
    }
}

//namespace Application.Interfaces
//{
//    public interface IAuthService
//    {
//        Task<User?> LoginAsync(string email, string password);
//    }
//}
