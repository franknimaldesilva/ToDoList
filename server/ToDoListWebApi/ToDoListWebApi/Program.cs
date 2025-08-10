using ToDoListStore;

var ToDoSpecificOrigins = "_ToDoSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: ToDoSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:4200").WithHeaders("Content-Type","storeid").WithMethods("POST","DELETE","GET");
                      });
});

// Add services to the container.

builder.Services.AddControllers(); 
builder.Services.AddSingleton<IStore, Store>();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
app.UseCors(ToDoSpecificOrigins);

app.UseHttpsRedirection();

app.UseAuthorization();
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapControllers();

app.Run();
