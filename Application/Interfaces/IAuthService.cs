using Application.Dtos;

namespace Application.Interfaces
{
    public interface IAuthService
    {
        Task<AddUserDto?> LoginAsync(string email, string password);
    }
}