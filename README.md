<h1 align="center">Endpoint</h1>

# V1

### Tech Stack

-   Express.js
-   Node.js
-   mongoose

## Region

-   GET /api/v1/region/:provinsi

```json
{
  "name": "aceh",
  "path": "*.xml"
  "date": "3 feb 2024, 20:59:21 WIB",
  ...
}
```

## Regency

-   GET /api/v1/regency/:kabupaten

```json
{
  "name": "kediri"
  "data":{
    "hu":{
      "format": "hourly",
      "t":[{
        "h": "0",
        "value": ["90 %"]
        ...
      }]
    }
    ...
  }
  ...
}
```

-   GET /api/v1/regency/:kabupaten?f=hu

```json
{
    "name": "kediri",
    "data": {
        "hu": {
            "format": "hourly",
            "t": [
                {
                    "h": "0",
                    "value": ["90 %"]
                },
                ...
            ]
        }
    }
}
```

-   GET /api/v1/regency/:kabupaten?f=hu+humin

```json
{
    "name": "kediri",
    "data": {
        "hu": {
          "format": "hourly",
          ...
        },
        "humin": {
          "format": "daily",
          ...
        }
    }
}
```

-   GET /api/v1/regency/:kabupaten?f=hu+humin&onlyData=true

```json
{
    "hu": {
      "t": [...]
    },
    "humin": {
      "t": [...]
    }
}
```

# V2

### Tech Stack

-   Nodejs
-   Express
-   Redis

## Region

-   GET /api/v2/:provinsi

```json
{
    "status": "success",
    "message": "null",
    "data": {
        "issued": {
            //...
        },
        "area": [
            {
                "id": "501272",
                "latitude": "-7.033333333",
                "longitude": "112.7667",
                "coordinate": "112.7667 -7.033333333",
                "type": "land",
                "region": "",
                "level": "1",
                "description": "Bangkalan",
                "domain": "Jawa Timur",
                "tags": "",
                "hu": {
                    //...
                },
                "humax": {
                    //...
                },
                "tmax": {
                    //...
                },
                "humin": {
                    //...
                },
                "tmin": {
                    //...
                },
                "t": {
                    //...
                },
                "weather": {
                    //...
                },
                "wd": {
                    //...
                },
                "ws": {
                    //...
                }
            }
            //..
        ]
    }
}
```

## Regency

-   GET /api/v2/regency/:kabupaten

```json
{
    "status": "success",
    "message": "null",
    "data": {
        "id": "5002268",
        "latitude": "-7.806242",
        "longitude": "112.180023",
        "coordinate": "112.180023 -7.806242",
        "type": "land",
        "region": "",
        "level": "1",
        "description": "Kabupaten Kediri",
        "domain": "Jawa Timur",
        "tags": "",
        "hu": {
            "description": "Humidity",
            "type": "hourly",
            "times": [
                //...
            ]
        },
        "humax": {
            "description": "Max humidity",
            "type": "daily",
            "times": [
                //...
            ]
        },
        "tmax": {
            "description": "Max temperature",
            "type": "daily",
            "times": [
                //...
            ]
        },
        "humin": {
            "description": "Min humidity",
            "type": "daily",
            "times": [
                //...
            ]
        },
        "tmin": {
            "description": "Min temperature",
            "type": "daily",
            "times": [
                //...
            ]
        },
        "t": {
            "description": "Temperature",
            "type": "hourly",
            "times": [
                //...
            ]
        },
        "weather": {
            "description": "Weather",
            "type": "hourly",
            "times": [
                //...
            ]
        },
        "wd": {
            "description": "Wind direction",
            "type": "hourly",
            "times": [
                //...
            ]
        },
        "ws": {
            "description": "Wind speed",
            "type": "hourly",
            "times": [
                //...
            ]
        }
    }
}
```
