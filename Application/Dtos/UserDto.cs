using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class UserDto
    {
        public string FirstName { get; set; }
        public string? LastName { get; set; }
        public string EmailId { get; set; } 
        public string Password { get; set; }
        public string ContactNumber { get; set; }
        public bool IsActive { get; set; }
        public Guid CompanyId { get; set; }
        public Guid? BranchId { get; set; }
        public Guid RoleId { get; set; }
        public Guid? CategoryId { get; set; }
        //public string? FireBaseId { get; set; }
    }
}
