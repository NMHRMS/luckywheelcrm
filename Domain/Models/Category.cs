using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Category
    {
        public Guid CategoryId { get; set; }
        public Guid CompanyId { get; set; }
        public string CategoryName { get; set; }

        //Navigation Properties
        public virtual Company Company { get; set; }

        //Collection Properties
        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
        public virtual ICollection<User> Users { get; set; } = new List<User>();
    }
}
