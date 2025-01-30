using CRMPROJECTAPI;
using Infrastructure;
using Application;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Application.Interfaces;
using Application.Services;
using Infrastructure.Data;
using Application.Mappers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IBranchService, BranchService>();
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ILeadService, LeadService>();
builder.Services.AddScoped<ILeadReviewService, LeadReviewService>();
builder.Services.AddScoped<ICallRecordService, CallRecordService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IVehicleInOutService, VehicleInOutService>();
builder.Services.AddScoped<ILeadAssignService, LeadsAssignService>();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddAutoMapper(typeof(MapperProfile));
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// Add CORS with a policy to allow all origins, headers, and methods
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder =>
        {
            builder.AllowAnyOrigin()  // Allows all origins
                   .AllowAnyHeader()  // Allows all headers
                   .AllowAnyMethod(); // Allows all methods (GET, POST, etc.)
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseDeveloperExceptionPage();

app.UseHttpsRedirection();

app.UseCors("AllowSpecificOrigin");
app.UseStaticFiles();
app.MapControllers();
app.Run();



