using Application.Interface.RepositoryInterface;
using Application.Interface.ServiceInterface;
using Application.MappingProfile.AnnouncementProfile;
using Application.MappingProfile.CategoryProfile;
using Application.MappingProfile.ContestProfile;
using Application.MappingProfile.ContestSubmissionProfile;
using Application.MappingProfile.FAQProfile;
using Application.MappingProfile.FeedbackProfile;
using Application.MappingProfile.IngredientProfile;
using Application.MappingProfile.RecipeIngredientProfile;
using Application.MappingProfile.RecipeProfile;
using Application.MappingProfile.RoleProfile;
using Application.MappingProfile.siteFeedbackProfile;
using Application.MappingProfile.SubscriptionProfile;
using Application.MappingProfile.TipProfile;
using Application.MappingProfile.UserProfile;
using Domain.DatabaseConfiq;
using Domain.Entities;
using Infrastructure.Repository;
using Infrastructure.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

//  cors service
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowEverything", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


builder.Services.AddAuthorization();

builder.Services.AddDbContext<ApplicationDbContext>(option =>
    option.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHttpContextAccessor();


builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddScoped<ISubscriptionService, SubscriptionService>();
builder.Services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();

builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();

builder.Services.AddScoped<IRecipeService, RecipeService>();
builder.Services.AddScoped<IRecipeRepository, RecipeRepository>();

builder.Services.AddScoped<IIngredientService, IngredientService>();
builder.Services.AddScoped<IIngredientRepository, IngredientRepository>();

builder.Services.AddScoped<ITipService, TipService>();
builder.Services.AddScoped<ITipRepository, TipRepository>();

builder.Services.AddScoped<IRecipeIngredientService, RecipeIngredientService>();
builder.Services.AddScoped<IRecipeIngredientRepository, RecipeIngredientRepository>();

builder.Services.AddScoped<IFAQService, FAQService>();
builder.Services.AddScoped<IFAQRepository, FAQRepository>();

builder.Services.AddScoped<ISiteFeedbackService, SiteFeedbackService>();
builder.Services.AddScoped<ISiteFeedbackRepository, SiteFeedbackRepository>();

builder.Services.AddScoped<IFeedbackService, FeedbackService>();
builder.Services.AddScoped<IFeedbackRepository, FeedbackRepository>();

builder.Services.AddScoped<IContestService, ContestService>();
builder.Services.AddScoped<IContestRepository, ContestRepository>();

builder.Services.AddScoped<IContestSubmissionService, ContestSubmissionService>();
builder.Services.AddScoped<IContestSubmissionRepository, ContestSubmissionRepository>();

builder.Services.AddScoped<IAnnouncementService, AnnouncementService>();
builder.Services.AddScoped<IAnnouncementRepository, AnnouncementRepository>();


builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddMaps(typeof(UserProfile).Assembly);
});


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT token."
    });

    options.AddSecurityRequirement(document =>
        new OpenApiSecurityRequirement
        {
            [new OpenApiSecuritySchemeReference("Bearer", document)] = new List<string>()
        });
});


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/error");
    app.UseHsts();
}


app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "V1 API");
    options.RoutePrefix = "swagger";
});


app.UseStaticFiles();

app.UseRouting();
app.UseCors("AllowEverything");
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/error", () => Results.Json(new { error = "An unexpected error occurred. Please try again later." }, statusCode: 500));

app.MapControllers();
app.Run();