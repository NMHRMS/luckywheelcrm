﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models;

public partial class Company
{
    public Guid CompanyId { get; set; }
    public string Name { get; set; }
    public string CompanyContact { get; set; }
    public string? Address { get; set; }
    public string OwnerName { get; set; }
    public string? MobileNo { get; set; }
    public string EmailId {  get; set; }
    public string Password { get; set; }
    public DateTime CreateDate { get; set; }
    public DateTime? UpdateDate { get; set; }
    public virtual ICollection<Branch> Branches { get; set; } = new List<Branch>();

    public virtual ICollection<Lead> Leads { get; set; } = new List<Lead>();

    public virtual ICollection<LeadReview> LeadsReview { get; set; } = new List<LeadReview>();
   
    public virtual ICollection<LeadSource> LeadSources { get; set; } = new List<LeadSource>();

    public virtual ICollection<Role> Roles { get; set; } = new List<Role>();

    public virtual ICollection<User> Users { get; set; } = new List<User>();

    public virtual ICollection<Category> Categories { get; set; } = new List<Category>();

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();

    public virtual ICollection<VehicleInOutRecord> VehicleCheckInCheckOut { get; set; } = new List<VehicleInOutRecord>();

    public virtual ICollection<CallRecord> CallRecords { get; set; } = new List<CallRecord>();

}




