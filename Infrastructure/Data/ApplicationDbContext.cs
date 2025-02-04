using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Domain.Models;

namespace Infrastructure.Data;

public partial class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Branch> Branches { get; set; }

    public virtual DbSet<CallRecord> CallRecords { get; set; }

    public virtual DbSet<Company> Companies { get; set; }

    public virtual DbSet<Lead> Leads { get; set; }

    public virtual DbSet<LeadReview> LeadsReview { get; set; }

    public virtual DbSet<LeadTracking> LeadsTracking { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<VehicleInOutRecord> VehicleCheckInCheckOut {  get; set; }
    public virtual DbSet<UserAssignmentMapping> UserAssignmentMappings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Branch>(entity =>
        {
            entity.HasKey(e => e.BranchId).HasName("PK_Branches");

            entity.ToTable("Branches", tb => tb.HasTrigger("trg_UpdateDate_Branches"));

            entity.Property(e => e.BranchId).HasColumnName("BranchID");
            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Contact).HasMaxLength(15);
            entity.Property(e => e.Address).HasMaxLength(100);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.CreateDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDate).HasColumnType("datetime");
           
        });

        modelBuilder.Entity<CallRecord>(entity =>
        {
            entity.HasKey(e => e.RecordId).HasName("PK_CallRecords");

            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.LeadId).HasColumnName("LeadID");
            entity.Property(e => e.CreateDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Date).HasColumnType("datetime");
            entity.Property(e => e.Recordings)
                .HasMaxLength(100)
                .IsFixedLength();

            entity.HasOne(e => e.Company)
                .WithMany(c => c.CallRecords)
                .HasForeignKey(e => e.CompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CallRecords_Companies");

            entity.HasOne(e => e.Lead)
                .WithMany(c => c.CallRecords)
                .HasForeignKey(e => e.LeadId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CallRecords_Leads");

            entity.HasOne(e => e.User)
                .WithMany(c => c.CallRecords)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CallRecords_Users");
        });

        modelBuilder.Entity<Company>(entity =>
        {
            entity.HasKey(e => e.CompanyId).HasName("PK_Companies");

            entity.ToTable("Companies", tb => tb.HasTrigger("trg_UpdateDate_Companies"));

            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.Address).HasMaxLength(100);
            entity.Property(e => e.CompanyContact).HasMaxLength(15);
            entity.Property(e => e.CreateDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.EmailId).HasColumnName("EmailID").HasMaxLength(50);
            entity.Property(e => e.MobileNo).HasMaxLength(15);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.OwnerName).HasMaxLength(100);
            entity.Property(e => e.Password).HasMaxLength(50);
            entity.Property(e => e.UpdateDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<Lead>(entity =>
        {
            entity.HasKey(e => e.LeadId).HasName("PK_Leads");
            entity.ToTable("Leads", tb => tb.HasTrigger("trg_UpdateDate_Leads"));

            entity.Property(e => e.LeadId).HasColumnName("LeadID");
            entity.Property(e => e.AssignedDate).HasColumnType("datetime");
            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.CreateDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CurrentAddress);
            entity.Property(e => e.DealerName).HasMaxLength(100);
            entity.Property(e => e.DistrictName).HasMaxLength(100);
            entity.Property(e => e.FatherName).HasMaxLength(100);
            entity.Property(e => e.FollowUpDate).HasColumnType("datetime");
            entity.Property(e => e.LeadSource).HasMaxLength(100);
            entity.Property(e => e.ExcelName).HasMaxLength(100);
            entity.Property(e => e.LeadType).HasMaxLength(50);
            entity.Property(e => e.MobileNo).HasMaxLength(15);
            entity.Property(e => e.ModelName).HasMaxLength(100);
            entity.Property(e => e.OfficeName).HasMaxLength(100);
            entity.Property(e => e.OwnerName).HasMaxLength(100);
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.RegistrationNo).HasMaxLength(50);
            entity.Property(e => e.StateName).HasMaxLength(100);
            entity.Property(e => e.Status).HasMaxLength(20).HasDefaultValue("Not Called");
            entity.Property(e => e.UpdateDate).HasColumnType("datetime");
            entity.Property(e => e.VehicleClass).HasMaxLength(100);

            entity.HasOne(d => d.AssignedToUser).WithMany(p => p.Leads)
                .HasForeignKey(d => d.AssignedTo)
                .HasConstraintName("FK_Leads_Users");

            entity.HasOne(d => d.Company).WithMany(p => p.Leads)
                .HasForeignKey(d => d.CompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Leads_Companies");

            entity.HasOne(d => d.Product).WithMany(p => p.Leads)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Leads_Products");
        });

        modelBuilder.Entity<LeadReview>(entity =>
        {
            entity.HasKey(e => e.LeadReviewId).HasName("PK_LeadsReview");

            entity.ToTable("LeadsReview", tb => tb.HasTrigger("trg_UpdateDate_LeadsReview"));

            entity.Property(e => e.LeadReviewId).HasColumnName("LeadReviewID");
            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.CreateDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.LeadId).HasColumnName("LeadID");
            entity.Property(e => e.UpdateDate).HasColumnType("datetime");

            entity.HasOne(d => d.Company).WithMany(p => p.LeadsReview)
              .HasForeignKey(d => d.CompanyId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK_LeadsReview_Companies");

        });

        modelBuilder.Entity<LeadTracking>(entity =>
        {
            entity.ToTable("LeadsTracking"); // Table name

            // Primary Key
            entity.HasKey(e => e.TrackID).HasName("PK_LeadsTracking");

            // Properties
            entity.Property(e => e.TrackID)
                .IsRequired();

            entity.Property(e => e.LeadID)
                .IsRequired();

            entity.Property(e => e.AssignedTo)
                .IsRequired();

            entity.Property(e => e.AssignedBy)
                .IsRequired();

            entity.Property(e => e.AssignedDate)
                .IsRequired();

            // Relationships
            entity.HasOne(e => e.Lead)
                .WithMany(l => l.LeadTrackings)
                .HasForeignKey(e => e.LeadID)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_LeadsTracking_Leads");

            entity.HasOne(e => e.AssignedToUser)
                .WithMany(u => u.AssignedToLeadTrackings)
                .HasForeignKey(e => e.AssignedTo)
                .OnDelete(DeleteBehavior.ClientSetNull)
             .HasConstraintName("FK_LeadsTracking_Users");

            entity.HasOne(e => e.AssignedByUser)
                .WithMany(u => u.AssignedByLeadTrackings)
                .HasForeignKey(e => e.AssignedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
             .HasConstraintName("FK_LeadsTracking_Users1");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductId).HasName("PK_Products");

            entity.ToTable("Products", tb => tb.HasTrigger("trg_UpdateDate_Products"));

            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.CreateDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ProductName).HasMaxLength(100);
            entity.Property(e => e.UpdateDate).HasColumnType("datetime");

            entity.HasOne(d => d.Company).WithMany(p => p.Products)
              .HasForeignKey(d => d.CompanyId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK_Products_Companies");
        });
       
        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK_Roles");
            entity.ToTable("Roles", tb => tb.HasTrigger("trg_UpdateDate_Roles"));

            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.CreateDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.RoleName).HasMaxLength(25);
            entity.Property(e => e.UpdateDate).HasColumnType("datetime");

            entity.HasOne(d => d.Company).WithMany(p => p.Roles)
                .HasForeignKey(d => d.CompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("[FK_Roles_Companies]");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK_Users");
            entity.ToTable("Users", tb => tb.HasTrigger("trg_UpdateDate_Users"));

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.BranchId).HasColumnName("BranchID");
            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.ContactNumber).HasMaxLength(50);
            entity.Property(e => e.CreateDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.EmailId).HasColumnName("EmailID").HasMaxLength(50);
            entity.Property(e => e.FirstName).HasMaxLength(25);
            entity.Property(e => e.LastName).HasMaxLength(25);
            entity.Property(e => e.Password).HasMaxLength(50);
            entity.Property(e => e.RoleId).HasColumnName("RoleID").HasColumnName("RoleID");
            entity.Property(e => e.UpdateDate).HasColumnType("datetime");

            entity.HasOne(d => d.Company)
                .WithMany(p => p.Users)
                .HasForeignKey(d => d.CompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Users_Companies");
            
            entity.HasOne(d => d.Branch)
                .WithMany(p => p.Users)
                .HasForeignKey(d => d.BranchId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Users_Branches");

            entity.HasOne(d => d.Role)
                .WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Users_Roles");
        });

        modelBuilder.Entity<VehicleInOutRecord>(entity =>
        {
            entity.ToTable("VehicleCheckInCheckOut", tb => tb.HasTrigger("trg_SetCheckOutDate"));

            entity.HasKey(e => e.Id).HasName("PK_VehicleCheckInCheckOut");

            entity.Property(e => e.Id).IsRequired().HasColumnName("ID");

            entity.Property(e => e.BranchId).IsRequired().HasColumnName("BranchID");

            entity.Property(e => e.CompanyId).IsRequired().HasColumnName("CompanyID");

            entity.Property(e => e.VehicleNo).HasMaxLength(10).IsRequired().HasMaxLength(10);

            entity.Property(e => e.CheckInImage).HasColumnType("varbinary(MAX)");

            entity.Property(e => e.CheckInReason).IsRequired().HasMaxLength(100);

            entity.Property(e => e.CheckInBy).IsRequired();

            entity.Property(e => e.CheckInDate).HasDefaultValueSql("GETDATE()"); 

            entity.Property(e => e.CheckOutImage).HasColumnType("varbinary(MAX)"); 

            entity.Property(e => e.CheckOutRemark).HasMaxLength(255);

            entity.Property(e => e.CheckOutBy).IsRequired(false);

            entity.Property(e => e.CheckOutDate).HasColumnType("DATETIME");

            entity.Property(e => e.Status).HasMaxLength(20);

            entity.HasOne(e => e.Branch).WithMany(b => b.VehicleCheckInCheckOut)
                .HasForeignKey(e => e.BranchId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_VehicleCheckInCheckOut_Branches");

            entity.HasOne(e => e.Company).WithMany(c => c.VehicleCheckInCheckOut)
                .HasForeignKey(e => e.CompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull) 
                .HasConstraintName("FK_VehicleCheckInCheckOut_Companies");
            
            entity.HasOne(e => e.CheckInUser).WithMany(c => c.VehicleCheckInCheckOut)
                .HasForeignKey(e => e.CheckInBy)
                .OnDelete(DeleteBehavior.ClientSetNull) 
                .HasConstraintName("FK_VehicleCheckInCheckOut_Users");
         
            entity.HasOne(e => e.CheckOutUser)
                .WithMany()
                .HasForeignKey(e => e.CheckOutBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_VehicleCheckInCheckOut_Users1");
        });

        modelBuilder.Entity<UserAssignmentMapping>()
           .HasKey(ua => ua.Id);

        modelBuilder.Entity<UserAssignmentMapping>()
            .HasOne<User>(ua => ua.Assigner)
            .WithMany(u => u.AssignedUsers)
            .HasForeignKey(ua => ua.AssignerUserId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("FK_UserAssignmentMappings_Users");

        modelBuilder.Entity<UserAssignmentMapping>()
            .HasOne<User>(ua => ua.Assignee)
            .WithMany(u => u.AssigneeUsers)
            .HasForeignKey(ua => ua.AssigneeUserId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("FK_UserAssignmentMappings_Users1");

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}