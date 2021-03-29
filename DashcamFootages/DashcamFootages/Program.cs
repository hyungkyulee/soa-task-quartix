using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Channels;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Protocols;

namespace DashcamFootages
{
    class Program
    {
        // public void ConfigureServices(IServiceCollection services)
        // {
        //     services.AddDbContext<EfDashcamDbContext>(options =>
        //         options.UseSqlServer(Configuration.GetConnectionString("DashcamDatabase")));
        // }
        
        static void Main(string[] args)
        {
            using (var db = new EfDashcamDbContext())
            {
                // var vehicles = db.Vehicles.ToList();
                // foreach (var vehicle in vehicles)
                // {
                //     Console.WriteLine(vehicle.Status);
                // }

                
                // var allVehicles = from vehicle in db.Vehicles
                //     select vehicle;
                //
                // foreach (var vehicle in allVehicles)
                // {
                //     Console.WriteLine(vehicle.Status);
                // }
                //
                // var activeVehicles = from vehicle in db.Vehicles
                //     where vehicle.Status == "Active"
                //     select vehicle;
                //
                // foreach (var vehicle in activeVehicles)
                // {
                //     Console.WriteLine($"{vehicle.VehicleId}: {vehicle.Status}");
                // }

                var dashcams = from dashcam in db.Dashcams
                    join channel in db.Channels on dashcam equals channel.Dashcam
                    // where string.Equals(dashcam.Vehicle.Status, "Active", StringComparison.InvariantCultureIgnoreCase)
                    // where dashcam.Vehicle.Status.ToUpperInvariant() == "Active".ToUpperInvariant()
                    where dashcam.Vehicle.Status == "Active"
                    select new
                    {
                        DashcamId = dashcam.DashcamId,
                        Manufacturer = dashcam.Manufacturer,
                        Model = dashcam.Model,
                        ChannelNumber = channel.ChannelNumber,
                        ChannelId = channel.ChannelId,
                        VehicleId = dashcam.Vehicle.VehicleId
                    };

                foreach (var dashcam in dashcams)
                {
                    Console.WriteLine($"ChID:{dashcam.ChannelId} - Ch({dashcam.ChannelNumber}) is available on {dashcam.DashcamId}: Model({dashcam.Model} made by {dashcam.Manufacturer} in Vehicle({dashcam.VehicleId})");
                }
                
                //searchFootage(vehicleId, startData, endDate)

                var footages = from footage in db.Footages
                    where footage.Channel.Dashcam.Vehicle.VehicleId == 1
                    // where DateTime.Parse(footage.UploadDate) > DateTime.Parse("2020-11-01")
                    select new
                    {
                        FootageId = footage.FootageId,
                        Format = footage.Format,
                        DownloadUrl = footage.DownloadUrl,
                        VehicleId = footage.Channel.Dashcam.Vehicle.VehicleId,
                        UploadDate = footage.UploadDate,
                        ChannelNumber = footage.Channel.ChannelNumber,
                        Model = footage.Channel.Dashcam.Model,
                        Manufacturer = footage.Channel.Dashcam.Manufacturer
                    };

                foreach (var footage in footages)
                {
                    Console.WriteLine($"VideoID:{footage.FootageId} searched at vehicleID({footage.VehicleId}) and Date({footage.UploadDate})");
                    Console.WriteLine($"Format: {footage.Format}");
                    Console.WriteLine($"DownloadUrl: {footage.DownloadUrl}");
                    Console.WriteLine($"Dashcam: Ch({footage.ChannelNumber}) on {footage.Model} made by {footage.Manufacturer}");
                }
                    

                // var videos = from footage in db.Footages
                //     join channel in db.Channels on footage equals channel.ChannelId
                //     join dashcam in db.Dashcams on channel.DashcamId equals dashcam.DashcamId
                //     join vehicle in db.Vehicles on dashcam. equals vehicle.VehicleId
                //     select footage;

                // foreach (var video in videos)
                // {
                //     Console.WriteLine($"Footage Info - ID: {video.FootageId}, Video Format: {video.Format}, Downlod URL: {video.DownloadUrl}");
                //     Console.WriteLine($"  > Dashcam detail - Mfr: {video.Dashcam.Manufacturer}");
                //     Console.WriteLine($"                   - Model: {video.Dashcam.Model}");
                //     Console.WriteLine($"                   - Channel: {video.Dashcam.Channel}\n");
                // }
            }
        }
    }

    public class EfDashcamDbContext : DbContext
    {
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Dashcam> Dashcams { get; set; }
        public DbSet<Channel> Channels { get; set; }
        public DbSet<Footage> Footages { get; set; }
        
        
        // ConnectionString to connect this context with local DB
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Server=localhost,1433;User=sa;Password=hkPassw0rd;Database=Quartix.Dashcam.Db;");
        }
    }

    [Table("Vehicles")]
    public class Vehicle
    {
        [Column("VehicleId")]
        public int VehicleId { get; set; }
        // public int CustomerId { get; set; }
        public string Status { get; set; }
    }
    
    [Table("Footages")]
    public class Footage
    {
        [Column("FootageId")]
        public int FootageId { get; set; }
        public string UploadDate { get; set; }
        public string Format { get; set; }
        public string DownloadUrl { get; set; }
        
        // public int ChannelId { get; set; }
        public Channel Channel { get; set; }
    }

    [Table("Channels")]
    public class Channel
    {
        public int ChannelId { get; set; }
        public int ChannelNumber { get; set; }
        
        // public int DashcamId { get; set; }
        public Dashcam Dashcam { get; set; }
    }
    
    [Table("Dashcams")]
    public class Dashcam
    {
        public int DashcamId { get; set; }
        public string Manufacturer { get; set; }
        public string Model { get; set; }
        
        // public int VehicleId { get; set; }
        public Vehicle Vehicle { get; set; }
    }

    
}