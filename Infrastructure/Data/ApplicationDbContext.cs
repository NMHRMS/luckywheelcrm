using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Domain.Models;
using Microsoft.EntityFrameworkCore.Migrations;
using Infrastructure.Utilities;
using System.Reflection.Emit;

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

    public virtual DbSet<District> Districts { get; set; }

    public virtual DbSet<Lead> Leads { get; set; }

    public virtual DbSet<LeadReview> LeadsReview { get; set; }

    public virtual DbSet<LeadSource> LeadSources { get; set; }

    public virtual DbSet<LeadTracking> LeadsTracking { get; set; }

    public virtual DbSet<Category> Categories {  get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ReviewsType> ReviewTypes { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<State> States { get; set; }

    public virtual DbSet<Status> Statuses { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<VehicleInOutRecord> VehicleCheckInCheckOut { get; set; }

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
            entity.Property(e => e.CreatedBy).HasColumnName("CreatedBy");
            entity.Property(e => e.UpdatedBy).HasColumnName("UpdatedBy");
            entity.Property(e => e.CreateDate).HasDefaultValue(DateTimeHelper.GetIndianTime()).HasColumnType("datetime");
            entity.Property(e => e.UpdateDate).HasColumnType("datetime");
            entity.HasOne(e => e.Company).WithMany(c => c.Branches).HasForeignKey(e => e.CompanyId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Branches_Companies");
            entity.HasOne(e => e.CreatedByUser).WithMany(c => c.Branches).HasForeignKey(e => e.CreatedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Branches_Users");
            entity.HasOne(e => e.UpdatedByUser).WithMany().HasForeignKey(e => e.UpdatedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Branches_Users1");

        });

        modelBuilder.Entity<CallRecord>(entity =>
        {
            entity.HasKey(e => e.RecordId).HasName("PK_CallRecords");
            entity.Property(e => e.RecordId).HasColumnName("CallRecordID");
            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.MobileNo).HasMaxLength(15);
            entity.Property(e => e.CallType).HasMaxLength(50);
            entity.Property(e => e.Recordings).HasColumnType("nvarchar(MAX)");
            entity.Property(e => e.Date).HasColumnType("datetime");
            entity.Property(e => e.Duration).HasColumnType("time(7)");
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.CreatedBy).HasColumnName("CreatedBy");
            entity.Property(e => e.CreateDate).HasColumnType("datetime").HasDefaultValue(DateTimeHelper.GetIndianTime());
            entity.HasOne(e => e.Company).WithMany(c => c.CallRecords).HasForeignKey(e => e.CompanyId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_CallRecords_Companies");
            entity.HasOne(e => e.User).WithMany(c => c.CallRecords).HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_CallRecords_Users");
            entity.HasOne(e => e.CreatedByUser).WithMany().HasForeignKey(e => e.CreatedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_CallRecords_Users1");


        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK_Categories");
            entity.ToTable("Categories", tb => tb.HasTrigger("trg_UpdateDate_Categories"));
            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.CategoryName).IsRequired().HasMaxLength(50);
            entity.Property(e => e.CreatedBy).HasColumnName("CreatedBy");
            entity.Property(e => e.UpdatedBy).HasColumnName("UpdatedBy");
            entity.Property(e => e.CreateDate).HasDefaultValue(DateTimeHelper.GetIndianTime()).HasColumnType("datetime");
            entity.Property(e => e.UpdateDate).HasColumnType("datetime");
            entity.HasOne(e => e.Company).WithMany(c => c.Categories).HasForeignKey(e => e.CompanyId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Categories_Companies");
            entity.HasOne(e => e.CreatedByUser).WithMany(c => c.Categories).HasForeignKey(e => e.CreatedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Categories_Users");
            entity.HasOne(e => e.UpdatedByUser).WithMany().HasForeignKey(e => e.UpdatedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Categories_Users1");


        });

        modelBuilder.Entity<District>(entity =>
        {
            entity.HasKey(e => e.DistrictId).HasName("PK_Districts");
            entity.ToTable("Districts", tb => tb.HasTrigger("trg_UpdateDate_Districts"));
            entity.Property(e => e.DistrictId).HasColumnName("DistrictID");
            entity.Property(e => e.StateId).HasColumnName("StateID");
            entity.Property(e => e.DistrictName).HasMaxLength(100);
            entity.Property(e => e.CreatedBy).HasColumnName("CreatedBy");
            entity.Property(e => e.UpdatedBy).HasColumnName("UpdatedBy");
            entity.Property(e => e.CreateDate).HasDefaultValue(DateTimeHelper.GetIndianTime()).HasColumnType("datetime");
            entity.Property(e => e.UpdateDate).HasColumnType("datetime");
            entity.HasOne(e => e.CreatedByUser).WithMany(c => c.Districts).HasForeignKey(e => e.CreatedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Districts_Users");
            entity.HasOne(e => e.UpdatedByUser).WithMany().HasForeignKey(e => e.UpdatedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Districts_Users1");
            entity.HasOne(d => d.State).WithMany(p => p.Districts).HasForeignKey(d => d.StateId).OnDelete(DeleteBehavior.Cascade).HasConstraintName("FK_Districts_States");
        });

        modelBuilder.Entity<State>(entity =>
        {
            entity.HasKey(e => e.StateId).HasName("PK_States");
            entity.ToTable("States", tb => tb.HasTrigger("trg_UpdateDate_States"));
            entity.Property(e => e.StateId).HasColumnName("StateID");
            entity.Property(e => e.StateName).HasMaxLength(100);
            entity.Property(e => e.CreatedBy).HasColumnName("CreatedBy");
            entity.Property(e => e.UpdatedBy).HasColumnName("UpdatedBy");
            entity.Property(e => e.CreateDate).HasDefaultValue(DateTimeHelper.GetIndianTime()).HasColumnType("datetime");
            entity.Property(e => e.UpdateDate).HasColumnType("datetime");
            entity.HasOne(e => e.CreatedByUser).WithMany(c => c.States).HasForeignKey(e => e.CreatedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_States_Users");
            entity.HasOne(e => e.UpdatedByUser).WithMany().HasForeignKey(e => e.UpdatedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_States_Users1");

        });

        modelBuilder.Entity<Status>(entity =>
        {
            entity.HasKey(e => e.StatusId).HasName("StatusID");
            entity.ToTable("Statuses", tb => tb.HasTrigger("trg_UpdateDate_Statuses"));
            entity.Property(e => e.StatusId).HasColumnName("StatusID");
            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.StatusType).HasMaxLength(20);
            entity.Property(e => e.CreatedBy).HasColumnName("CreatedBy");
            entity.Property(e => e.UpdatedBy).HasColumnName("UpdatedBy");
            entity.Property(e => e.CreateDate).HasDefaultValue(DateTimeHelper.GetIndianTime()).HasColumnType("datetime");
            entity.Property(e => e.UpdateDate).HasColumnType("datetime");
            entity.HasOne(e => e.CreatedByUser).WithMany(c => c.Statuses).HasForeignKey(e => e.CreatedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Statuses_Users");
            entity.HasOne(e => e.UpdatedByUser).WithMany().HasForeignKey(e => e.UpdatedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Statuses_Users1");
            entity.HasOne(d => d.Company).WithMany(p => p.Statuses).HasForeignKey(d => d.CompanyId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Statuses_Companies");
        });

        modelBuilder.Entity<LeadSource>(entity =>
        {
            entity.HasKey(e => e.SourceId).HasName("PK_LeadSources");
            entity.ToTable("LeadSources", tb => tb.HasTrigger("trg_UpdateDate_LeadSources"));
            entity.Property(e => e.SourceId).HasColumnName("SourceID");
            entity.Property(e => e.SourceName).HasMaxLength(100);
            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.CreatedBy).HasColumnName("CreatedBy");
            entity.Property(e => e.UpdatedBy).HasColumnName("UpdatedBy");
            entity.Property(e => e.CreateDate).HasDefaultValue(DateTimeHelper.GetIndianTime()).HasColumnType("datetime");
            entity.Property(e => e.UpdateDate).HasColumnType("datetime");
            entity.HasOne(e => e.CreatedByUser).WithMany(c => c.LeadsSource).HasForeignKey(e => e.CreatedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_LeadSources_Users");
            entity.HasOne(e => e.UpdatedByUser).WithMany().HasForeignKey(e => e.UpdatedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_LeadSources_Users1");


            entity.HasOne(d => d.Company)
                  .WithMany(p => p.LeadSources)
                  .HasForeignKey(d => d.CompanyId)
                  .OnDelete(DeleteBehavior.Cascade)
                  .HasConstraintName("FK_LeadSources_Companies");
        });

        modelBuilder.Entity<Company>(entity =>
        {
            entity.HasKey(e => e.CompanyId).HasName("PK_Companies");
            entity.ToTable("Companies", tb => tb.HasTrigger("trg_UpdateDate_Companies"));
            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.Address).HasMaxLength(100);
            entity.Property(e => e.CompanyContact).HasMaxLength(15);
            entity.Property(e => e.EmailId).HasColumnName("EmailID").HasMaxLength(50);
            entity.Property(e => e.MobileNo).HasMaxLength(15);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.OwnerName).HasMaxLength(100);
            entity.Property(e => e.Password).HasMaxLength(50);
            entity.Property(e => e.CreatedBy).HasColumnName("CreatedBy");
            entity.Property(e => e.UpdatedBy).HasColumnName("UpdatedBy");
            entity.Property(e => e.CreateDate).HasDefaultValue(DateTimeHelper.GetIndianTime()).HasColumnType("datetime");
            entity.Property(e => e.UpdateDate).HasColumnType("datetime");
            entity.HasOne(e => e.CreatedByUser).WithMany(c => c.Companies).HasForeignKey(e => e.CreatedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Companies_Users");
            entity.HasOne(e => e.UpdatedByUser).WithMany().HasForeignKey(e => e.UpdatedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Companies_Users1");

        });

        modelBuilder.Entity<Lead>(entity =>
        {
            entity.HasKey(e => e.LeadId).HasName("PK_Leads");
            entity.ToTable("Leads", tb => tb.HasTrigger("trg_UpdateDate_Leads"));

            entity.Property(e => e.LeadId).HasColumnName("LeadID");
            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.AssignedTo).HasColumnName("AssignedTo");
            entity.Property(e => e.DistrictId).HasColumnName("DistrictID");
            entity.Property(e => e.StateId).HasColumnName("StateID");
            entity.Property(e => e.LeadSourceId).HasColumnName("LeadSourceID");

            entity.Property(e => e.ExcelName).HasMaxLength(100);
            entity.Property(e => e.OwnerName).HasMaxLength(100);
            entity.Property(e => e.FatherName).HasMaxLength(100);
            entity.Property(e => e.MobileNo).HasMaxLength(15);
            entity.Property(e => e.CurrentAddress).HasColumnType("nvarchar(max)");
            entity.Property(e => e.RegistrationNo).HasMaxLength(50);
            entity.Property(e => e.RegistrationDate).HasColumnType("datetime2(7)");
            entity.Property(e => e.CurrentVehicle).HasMaxLength(100);
            entity.Property(e => e.ChasisNo).HasMaxLength(30);
            entity.Property(e => e.ModelName).HasMaxLength(100);
            entity.Property(e => e.LeadType).HasMaxLength(50);
            entity.Property(e => e.AssignedBy).HasColumnName("AssignedBy");
            entity.Property(e => e.AssignedDate).HasColumnType("datetime");
            entity.Property(e => e.FollowUpDate).HasColumnType("datetime");
            entity.Property(e => e.LastRevertedBy).HasColumnName("LastRevertedBy");
            entity.Property(e => e.Remark).HasColumnType("nvarchar(max)");
            entity.Property(e => e.Status).HasMaxLength(20).HasDefaultValue("Not Called");
            entity.Property(e => e.CreatedBy).HasColumnName("CreatedBy");
            entity.Property(e => e.CreateDate).HasDefaultValue(DateTimeHelper.GetIndianTime()).HasColumnType("datetime");
            entity.Property(e => e.UpdateDate).HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasColumnName("UpdatedBy");

            entity.HasOne(d => d.AssignedToUser).WithMany(p => p.Leads).HasForeignKey(d => d.AssignedTo).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Leads_AssignedTo");
            entity.HasOne(d => d.AssignedByUser).WithMany().HasForeignKey(d => d.AssignedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Leads_Users");
            entity.HasOne(d => d.RevertedByUser).WithMany().HasForeignKey(d => d.LastRevertedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Leads_LastRevertedBy");
            entity.HasOne(e => e.CreatedByUser).WithMany().HasForeignKey(e => e.CreatedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Leads_Users1");
            entity.HasOne(e => e.UpdatedByUser).WithMany().HasForeignKey(e => e.UpdatedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Leads_Users2");
            entity.HasOne(d => d.Company).WithMany(p => p.Leads).HasForeignKey(d => d.CompanyId).HasConstraintName("FK_Leads_Companies");
            entity.HasOne(d => d.Category).WithMany(p => p.Leads).HasForeignKey(d => d.CategoryId).HasConstraintName("FK_Leads_Categories");
            entity.HasOne(d => d.Product).WithMany(p => p.Leads).HasForeignKey(d => d.ProductId).HasConstraintName("FK_Leads_Products");
            entity.HasOne(d => d.District).WithMany(p => p.Leads).HasForeignKey(d => d.DistrictId).HasConstraintName("FK_Leads_Districts");
            entity.HasOne(d => d.State).WithMany(p => p.Leads).HasForeignKey(d => d.StateId).HasConstraintName("FK_Leads_States");
            entity.HasOne(d => d.LeadSource).WithMany(p => p.Leads).HasForeignKey(d => d.LeadSourceId).HasConstraintName("FK_Leads_LeadSources");
        });

        modelBuilder.Entity<LeadReview>(entity =>
        {
            entity.HasKey(e => e.LeadReviewId).HasName("PK_LeadsReview");
            entity.ToTable("LeadsReview", tb => tb.HasTrigger("trg_UpdateDate_LeadsReview"));
            entity.Property(e => e.LeadReviewId).HasColumnName("LeadReviewID");
            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.ReviewBy).HasColumnName("ReviewBy");
            entity.Property(e => e.LeadId).HasColumnName("LeadID"); 
            entity.Property(e => e.UpdatedBy).HasColumnName("UpdatedBy");
            entity.Property(e => e.CreateDate).HasDefaultValue(DateTimeHelper.GetIndianTime()).HasColumnType("datetime");
            entity.Property(e => e.UpdateDate).HasColumnType("datetime");
            entity.HasOne(e => e.UpdatedByUser).WithMany().HasForeignKey(e => e.UpdatedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_LeadsReview_Users1");
            entity.HasOne(d => d.Company).WithMany(p => p.LeadsReview).HasForeignKey(d => d.CompanyId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_LeadsReview_Companies");
            entity.HasOne(d => d.ReviewByUser).WithMany(p => p.LeadsReview).HasForeignKey(d => d.ReviewBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_LeadsReview_Users");

        });

        modelBuilder.Entity<LeadTracking>(entity =>
        {
            entity.ToTable("LeadsTracking");
            entity.HasKey(e => e.TrackId).HasName("PK_LeadsTracking");
            entity.Property(e => e.TrackId).IsRequired();
            entity.Property(e => e.LeadId).IsRequired();
            entity.Property(e => e.AssignedTo).IsRequired();
            entity.Property(e => e.AssignedBy).IsRequired();
            entity.Property(e => e.AssignedDate).IsRequired();
            entity.Property(e => e.LeadStatus).IsRequired();
            entity.Property(e => e.ClosedDate);
            entity.HasOne(e => e.Lead).WithMany(l => l.LeadTrackings).HasForeignKey(e => e.LeadId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_LeadsTracking_Leads");
            entity.HasOne(e => e.AssignedToUser).WithMany(u => u.AssignedToLeadTrackings).HasForeignKey(e => e.AssignedTo).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_LeadsTracking_Users");
            entity.HasOne(e => e.AssignedByUser).WithMany(u => u.AssignedByLeadTrackings).HasForeignKey(e => e.AssignedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_LeadsTracking_Users1");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductId).HasName("PK_Products");
            entity.ToTable("Products", tb => tb.HasTrigger("trg_UpdateDate_Products"));
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.ProductName).HasMaxLength(100);
            entity.Property(e => e.CreateDate).HasDefaultValue(DateTimeHelper.GetIndianTime()).HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasColumnName("CreatedBy");
            entity.Property(e => e.UpdateDate).HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasColumnName("UpdatedBy");
            entity.HasOne(d => d.Company).WithMany(p => p.Products).HasForeignKey(d => d.CompanyId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Products_Companies");
            entity.HasOne(e => e.Category).WithMany(c => c.Products).HasForeignKey(e => e.CategoryId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Products_Categories");
            entity.HasOne(e => e.CreatedByUser).WithMany(c => c.Products).HasForeignKey(e => e.CreatedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Products_Users");
            entity.HasOne(e => e.UpdatedByUser).WithMany().HasForeignKey(e => e.UpdatedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Products_Users1");

        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK_Roles");
            entity.ToTable("Roles", tb => tb.HasTrigger("trg_UpdateDate_Roles"));
            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.RoleName).HasMaxLength(25);
            entity.Property(e => e.CreateDate).HasDefaultValue(DateTimeHelper.GetIndianTime()).HasColumnType("datetime"); 
            entity.Property(e => e.CreatedBy).HasColumnName("CreatedBy");
            entity.Property(e => e.UpdateDate).HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasColumnName("UpdatedBy");
            entity.HasOne(d => d.Company).WithMany(p => p.Roles).HasForeignKey(d => d.CompanyId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Roles_Companies");
            entity.HasOne(e => e.CreatedByUser).WithMany(c => c.Roles).HasForeignKey(e => e.CreatedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Roles_Users");
            entity.HasOne(e => e.UpdatedByUser).WithMany().HasForeignKey(e => e.UpdatedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Roles_Users1");

        });

        modelBuilder.Entity<ReviewsType>(entity =>
        {
            entity.HasKey(e => e.ReviewId).HasName("ReviewID");
            entity.ToTable("ReviewTypes", tb => tb.HasTrigger("trg_UpdateDate_ReviewTypes"));
            entity.Property(e => e.ReviewId).HasColumnName("ReviewID");
            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.ReviewType).HasMaxLength(50);
            entity.Property(e => e.CreateDate).HasDefaultValue(DateTimeHelper.GetIndianTime()).HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasColumnName("CreatedBy");
            entity.Property(e => e.UpdateDate).HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasColumnName("UpdatedBy");
            entity.HasOne(d => d.Company).WithMany(p => p.ReviewTypes).HasForeignKey(d => d.CompanyId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_ReviewTypes_Companies");
            entity.HasOne(e => e.CreatedByUser).WithMany(c => c.ReviewsType).HasForeignKey(e => e.CreatedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_ReviewTypes_Users");
            entity.HasOne(e => e.UpdatedByUser).WithMany().HasForeignKey(e => e.UpdatedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_ReviewTypes_Users1");

        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK_Users");
            entity.ToTable("Users", tb => tb.HasTrigger("trg_UpdateDate_Users"));

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.BranchId).HasColumnName("BranchID");
            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.EmailId).HasColumnName("EmailID").HasMaxLength(50);
            entity.Property(e => e.Password).HasMaxLength(50);
            entity.Property(e => e.FirstName).HasMaxLength(25);
            entity.Property(e => e.LastName).HasMaxLength(25);
            entity.Property(e => e.ContactNumber).HasMaxLength(50);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            //entity.Property(e => e.FireBaseId).HasColumnName("FireBaseID");
            entity.Property(e => e.CreatedBy).HasColumnName("CreatedBy");
            entity.Property(e => e.UpdatedBy).HasColumnName("UpdatedBy");
            entity.Property(e => e.CreateDate).HasDefaultValue(DateTimeHelper.GetIndianTime()).HasColumnType("datetime");
            entity.Property(e => e.UpdateDate).HasColumnType("datetime");

            entity.HasOne(e => e.CreatedByUser).WithMany(c => c.CreatedUsers).HasForeignKey(e => e.CreatedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Users_CreatedBy");
            entity.HasOne(e => e.UpdatedByUser).WithMany(c => c.UpdatedUsers).HasForeignKey(e => e.UpdatedBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Users_UpdatedBy");

            entity.HasOne(d => d.Company).WithMany(p => p.Users).HasForeignKey(d => d.CompanyId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Users_Companies");
            entity.HasOne(d => d.Branch).WithMany(p => p.Users).HasForeignKey(d => d.BranchId).HasConstraintName("FK_Users_Branches");
            entity.HasOne(d => d.Role).WithMany(p => p.Users).HasForeignKey(d => d.RoleId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_Users_Roles");
            entity.HasOne(d => d.Category).WithMany(p => p.Users).HasForeignKey(d => d.CategoryId).HasConstraintName("FK_Users_Categories");
        });

        modelBuilder.Entity<User>()
            .HasMany(u => u.AssignedUsers)
            .WithMany(u => u.AssigneeUsers)
            .UsingEntity<Dictionary<string, object>>(
                "UserAssignmentMappings",
                j => j.HasOne<User>().WithMany().HasForeignKey("AssigneeUserId").OnDelete(DeleteBehavior.ClientSetNull),
                j => j.HasOne<User>().WithMany().HasForeignKey("AssignerUserId").OnDelete(DeleteBehavior.ClientSetNull),
                j =>
                {
                    j.HasKey("AssigneeUserId", "AssignerUserId"); 
                }
            );
     
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
            entity.Property(e => e.CheckInDate).HasDefaultValue(DateTimeHelper.GetIndianTime());
            entity.Property(e => e.CheckOutImage).HasColumnType("varbinary(MAX)");
            entity.Property(e => e.CheckOutRemark).HasMaxLength(255);
            entity.Property(e => e.CheckOutBy).IsRequired(false);
            entity.Property(e => e.CheckOutDate).HasColumnType("DATETIME").HasDefaultValue(DateTimeHelper.GetIndianTime());
            entity.Property(e => e.Status).HasMaxLength(20);
            entity.HasOne(e => e.Branch).WithMany(b => b.VehicleCheckInCheckOut).HasForeignKey(e => e.BranchId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_VehicleCheckInCheckOut_Branches");
            entity.HasOne(e => e.Company).WithMany(c => c.VehicleCheckInCheckOut).HasForeignKey(e => e.CompanyId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_VehicleCheckInCheckOut_Companies");
            entity.HasOne(e => e.CheckInUser).WithMany(c => c.VehicleCheckInCheckOut).HasForeignKey(e => e.CheckInBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_VehicleCheckInCheckOut_Users");
            entity.HasOne(e => e.CheckOutUser).WithMany().HasForeignKey(e => e.CheckOutBy).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_VehicleCheckInCheckOut_Users1");
        });
        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}


