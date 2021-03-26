# soa-task-quartix

## Overview
Design a system that 
- lets a user retrieve videos uploaded from a dashcam installed in one of their vehicles
- displays the videos in a Fleet Tracking report.

## Specifications

### Database 
#### Schema Overview
- Vehicles : holds vehicle data
  - vehicleId
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
  - channels[] (one channel for a camera)

- channels
  - channelId
  - dashcamId

- Footages
  - footageId
  - channelId
  - uploadDate
  - format
  - downloadUrl


### API
#### Retrieve video footages uploaded from the dashcam
[Request]
```javascript
GET /footages/vehicle/:vehicleId/from/:startDate/to/:endDate

(or GET /footages?vehicle=:vehicleId&startDate=:startDate&endDate=:endDate )
```

[Example Response Body]
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

[Response HTTP Status Code]
- 200 : OK
  (e.g. handle 'No video found' or 'Video data found')
- 403 : Forbidden
- 400 : Bad Request
  (e.g. handle 'Waiting for Camera')

#### Retrieve a video stream from each mfr's api

e.g. var stream = VideoApiReadStream(footages[1].downloadUrl)
[reference]
GET /footages/:footageId/download
{
  binary stream data
}

### Objects
#### Domain Objects
```c#
public class Footage 
{
  public FootageId FootageId { get; }
  public DateTime UploadDate { get; }
  public string Format { get; }
  puglic string DownloadUrl { get; }
  public Dashcam Dashcam { get; }
  
  ctor ...
  
}

public class Dashcam
{
  public DashcamId DashcamId { get; }
  public string Manufacturer { get; }
  public string Model { get; }
  public IEnumerable<Channel> Channels { get; }
}

public class Channel
{
  public ChannelId ChannelId { get; }
}
```

#### Repository
public async Task<IEnumerable<Footage>> List();



API Endpoint
```javascript
GET /dashcams/unitId/channelNumber/videos?startDate=:startDate&endDate=:endDate
```

Example
```json
GET /dashcams/unitId/videos?startDate=:startDate&endDate=:endDate

{
  "VideoList": [{
      "VideoId": "12345678-1234-1234-1234-123456789012",
      "uploadDate": "2021-12-12T00:00:00",
      "format": "mp4",
      "downloadUrl": "https://brands.com/camera/aaa/2021-12-12-0000/video1.mp4"
    },
    {
      "VideoId": "12345678-1234-1234-1234-123456789012",
      "uploadDate": "2021-12-12T00:00:00",
      "format": "mp4",
      "downloadUrl": "https://brands.com/camera/aaa/2021-12-12-0000/video1.mp4"
    }
  ]
}
```




#### Retrieve vehicles
API Endpoint
```javascript
GET /vehicles
```

Example
```json
GET /dashcams/unitId/videos?startDate=:startDate&endDate=:endDate

{
  "VehicleList": [{
      "VideoId": "12345678-1234-1234-1234-123456789012",
      "uploadDate": "2021-12-12T00:00:00",
      "format": "mp4",
      "downloadUrl": "https://brands.com/camera/aaa/2021-12-12-0000/video1.mp4"
    },
    {
      "VideoId": "12345678-1234-1234-1234-123456789012",
      "uploadDate": "2021-12-12T00:00:00",
      "format": "mp4",
      "downloadUrl": "https://brands.com/camera/aaa/2021-12-12-0000/video1.mp4"
    }
  ]
}
```

Response
- 200 : OK
  (e.g. handle 'No video found' or 'Video data found')
- 403 : Forbidden
- 400 : Bad Request
  (e.g. handle 'Waiting for Camera')


### UI
input fields
- 
