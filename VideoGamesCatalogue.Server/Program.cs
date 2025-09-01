using Microsoft.EntityFrameworkCore;
using VideoGamesCatalogue.Server.Data;
using VideoGamesCatalogue.Server.Services;
using VideoGamesCatalogue.Server.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(allowedOrigins) // Your React app URL
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials(); // If you need to send cookies/auth headers
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add DbContext
builder.Services.AddDbContext<VideoGameContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add custom services
builder.Services.AddScoped<IVideoGameService, VideoGameService>();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

// Ensure database is created and migrated with retry logic for Docker
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<VideoGameContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    
    // Wait for SQL Server to be ready with retry logic
    var retries = 15;
    while (retries > 0)
    {
        try
        {
            logger.LogInformation("Attempting to connect to database...");
            context.Database.EnsureCreated();
            logger.LogInformation("Database connection successful!");
            break;
        }
        catch (Exception ex)
        {
            retries--;
            logger.LogWarning($"Database not ready, retrying... ({retries} attempts left)");
            logger.LogWarning($"Error: {ex.Message}");
            
            if (retries == 0)
            {
                logger.LogError("Failed to connect to database after all retries");
                throw;
            }
            
            Thread.Sleep(5000);
        }
    }
}

app.Run();
