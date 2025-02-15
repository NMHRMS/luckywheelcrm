using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IJwtTokenService
    {
        Guid? GetCompanyIdFromToken();  
        Guid? GetUserIdFromToken();     
        string GetUserNameFromToken();
        string GetRoleNameFromToken();
    }
}

