# soa-task-quartix

## Overview
Design a system that 
- lets a user retrieve videos uploaded from a dashcam installed in one of their vehicles
- displays the videos in a Fleet Tracking report.

## Specifications

### Database 
#### Schema Overview
- Trips
  - tripId
  - departureTime
  - arrivalTime
  - fromLocation
  - toLocation
  - totalTripTime
  - totalTripDistance
  - averageSpeed
  - vehicleId
  - driverName

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
#### Retrieve a video uploaded from the dashcam

GET /footages/vehicle/:vehicleId/from/:startDate/to/:endDate
GET /footages?vehicle=:vehicleId&startDate=:startDate&endDate=:endDate

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


var stream = apiStream(footages[1].downloadUrl)

GET /footages/:footageId/download
{
  binary stream data
}


dashcam
channel

Domain Object
 - property


Repository
 - 



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

Response
- 200 : OK
  (e.g. handle 'No video found' or 'Video data found')
- 403 : Forbidden
- 400 : Bad Request
  (e.g. handle 'Waiting for Camera')


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
