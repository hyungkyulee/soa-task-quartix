# soa-task-quartix

## Overview
Design a system that 
- lets a user retrieve videos uploaded from a dashcam installed in one of their vehicles
- displays the videos in a Fleet Tracking report.

## Specifications
#### Schema Overview
- Vehicles : holds vehicle data
  - vehicleId (primary)
  - registrationNumber
  - fleetGroup
  - companyName
  - status
  - speed
  - latestLocation

- Dashcams : each vehicle has zero - many dashcam units
  - dashcamId (primary)
  - vehicleId (foreign)
  - manufacturer
  - model

- channels : one channel for a camera
  - channelId (primary)
  - dashcamId (foreign)

- Footages
  - footageId (primary)
  - channelId (foreign)
  - uploadDate
  - format
  - downloadUrl


### UI (Client App)
input fields
- vehicle (vehicleId)
- time period (startDate / endDate)

### API
#### Retrieve video footages uploaded from the dashcam
Client -> Request: Search Footage API Call -> API server
Client <- Response : return download urls <- API server

Client -> DownloadUrl -> API server -> Get stream (API Key) -> Dashcam Mfrs
Client <- streaming <- API server <- buffering <- Dashcam Video CDN <- Dashcam Mfrs


[Request]
```javascript
GET /footages/vehicle/:vehicleId/from/:startDate/to/:endDate

(or GET /footages?vehicle=:vehicleId&startDate=:startDate&endDate=:endDate )
```

[Example Response Body]
```json
{
  "footages": [{
      "footageId": "12345678-1234-1234-1234-123456789012",
      "uploadDate": "2021-12-12T00:00:00",
      "format": "mp4",
      "downloadUrl": "https://app.quartix.com/footages/12345678-1234-1234-1234-123456789012/download",
      "dashcam": {
        "dashcamId": "00000000-1234-1234-1234-123456789012",
        "manufacturer": "quartix",
        "model": "FF2000",
        "channel": "2"
      },
    },
  ]
}
```

[Example on EF MSSQL]
```c#
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
```

[Response HTTP Status Code]
- 200 : OK
  (e.g. handle 'No video found' or 'Video data found')
- 403 : Forbidden
- 400 : Bad Request
  (e.g. handle 'Waiting for Camera')

#### Retrieve a video stream from each mfr's api
```javascript
e.g. var stream = VideoApiReadStream(footages[1].downloadUrl)
[reference]
GET /footages/:footageId/download
{
  binary stream data
}
```

### Objects
#### Domain Objects
```c#
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

```

#### SQL Query Test
```sql
select * from Footages f 
join Channels c on c.ChannelId = f.ChannelId
join Dashcams d on d.DashcamId = c.DashcamId
join Vehicles v on v.VehicleId = d.VehicleId
```

#### Repository
```c#
public interface IDashcamFootageRepository
{
  Task<IEnumerable<Footage>> List(VehicleId vehicleId, DateTime startDate, DateTime endDate);
}

```
