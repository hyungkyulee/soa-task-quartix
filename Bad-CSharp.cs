
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Xml;

namespace Test.Repos
{
    // public class VehicleModel
    public class Vehicle
    {
        public int VehicleId;
        public int CustomerId;
        public string Status;
    }

    public class DatabaseContext : DbContext
    {
        public DatabaseContext(string connectionString) : base(connectionString)
        {
        }

        // public DbSet<VehicleModel> VehicleModels { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
    }

    // public class selectedVeh
    // {
    //     public int VehicleId;
    // }

    public class VehiclesRepository
    {
        private const string Active = "Active";

        // public databaseContext myContext;
        public DatabaseContext _myContext;

        // public VehiclesRepositry()
        // {
        //     myContext = new databaseContext("Connection_string_name");
        // }
        public VehiclesRepository(DatabaseContext myContext)
        {
            _myContext = myContext;
        }

        // public List<VehicleModel> getSlectedVehicles(int customerId, selectedVeh[] selIds)
        // {
        //     IEnumerable<VehicleModel> sv = from vhs in myContext.VehicleModel
        //         join s in selIds
        //     on vhs.VehicleId equals s.VehicleId
        //     select vhs;

        //     List<VehicleModel> cv = new List<VehicleModel> { };

        //     foreach (var v in sv)
        //     {
        //         if (v.VehicleId == customerId)
        //         {
        //             if (IsVehicleActive(myContext, v.VehicleId) == true)
        //             {
        //                 cv.Add(v);
        //             }
        //         }
        //     }

        //     return cv;
        // }
        public IEnumerable<Vehicle> GetSelectedVehicles(int customerId, int[] selectedIds)
        {
            var customerVehicles = from vehicle in myContext.Vehicle
                                where selectedIds.Contains(vehicle.vehicleId)
                                    && vehicle.customerId == customerId
                                    && string.Equals(vehicle.Status, Active, StringComparison.InvariantCultureIgnoreCase)
                                select vehicle;

            return customerVehicles;
        }

        // private static bool IsVehicleActive(databaseContext c, int i)
        // {
        //     var v = c.VehicleModel.FirstOrDefault(vh => vh.VehicleId == i);
        //     if (v.Status == "Active" || v.Status == "ACTIVE" || v.Status == "active")
        //     {
        //         return true;
        //     }
        //     else
        //     {
        //         return false;
        //     }
        // }
        // private static bool IsVehicleActive(DatabaseContext context, int vehicleId)
        // {
        //     var vehicle = context.VehicleModel.SingleOrDefault(vh => vh.VehicleId == vehicleId);
        //     return (vehicle.Status == "Active" || vehicle.Status == "ACTIVE" || vehicle.Status == "active");
        // }

        // public string GetCustomerDescription(string CustomerName, string CustomerAddressLine1, string cal2, string city, string country, ref string Postcode)
        // {
        //     var r = CustomerName + " " + CustomerAddressLine1 + " " + cal2 + "," + city + " " + country + " " + "Postcode";
        //     return r;
        // }
        public string GetCustomerDescription(string customerName, 
            string customerAddressLine1, 
            string cal2, 
            string city, 
            string country, 
            string postcode)
        {
            return $"{customerName} {customerAddressLine1} {cal2} {city} {country} {postcode}";
        }
    }
}