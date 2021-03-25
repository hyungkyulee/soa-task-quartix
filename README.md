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
  - dashcams[]

- Dashcams : each vehicle has zero - many dashcam units
  - unitId
  - manufacturer
  - model
  - channels[] (one channel for a camera)

- VideoFootages
  - videoId
  - uploadDate
  - format
  - downloadUrl
  - unitId
  - channelIndex

#### Serverless Resources for document DB
```yml
resources:
  Resources:
    videoFootagesTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: videoFootages-${opt:stage, self:provider.stage}
        AttributeDefinitions:
          - AttributeName: unitId
            AttributeType: S
          - AttributeName: videoId
            AttributeType: S
        KeySchema:
          - AttributeName: unitId
            KeyType: HASH
          - AttributeName: videoId
            KeyType: RANGE
        ProvisionedThroughput:
          ReadCapacityUnits: 5
          WriteCapacityUnits: 5
          
    dashcamTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: videoFootages-${opt:stage, self:provider.stage}
        AttributeDefinitions:
          - AttributeName: unitId
            AttributeType: S
          - AttributeName: channelIndex
            AttributeType: S
          - AttributeName: videoId
            AttributeType: S
        KeySchema:
          - AttributeName: category
            KeyType: HASH
          - AttributeName: videoId
            KeyType: RANGE
        ProvisionedThroughput:
          ReadCapacityUnits: 5
          WriteCapacityUnits: 5
```

### API
#### Retrieve a video uploaded from the dashcam
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
