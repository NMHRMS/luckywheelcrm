using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Application.Services
{
    public class JwtTokenService: IJwtTokenService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public JwtTokenService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public Guid? GetCompanyIdFromToken()
        {
            var companyIdClaim = _httpContextAccessor.HttpContext.User.Claims
                .FirstOrDefault(c => c.Type == "companyId");

            return companyIdClaim != null ? Guid.Parse(companyIdClaim.Value) : (Guid?)null;
        }

    
        public Guid? GetUserIdFromToken()
        {
            // Use ClaimTypes.NameIdentifier to extract the UserId
            var userIdClaim = _httpContextAccessor.HttpContext.User.Claims
                .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier); // Updated key

            return userIdClaim != null ? Guid.Parse(userIdClaim.Value) : (Guid?)null;
        }

        public string GetUserNameFromToken()
        {
            var userNameClaim = _httpContextAccessor.HttpContext.User.Claims
                .FirstOrDefault(c => c.Type == "userName");

            return userNameClaim?.Value;
        }
    }
}
