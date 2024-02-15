<h1 align="center">REST API Weather</h1>

REST API prakiraan cuaca, suhu udara, kelembapan udara, kecepatan angin, dan arah angin untuk kota-kota besar di 34 provinsi di Indonesia dalam waktu 3 harian.

Sumber: [Data Terbuka BMKG](https://data.bmkg.go.id/)

## Demo

[https://dizzy-pike-slippers.cyclic.app/](https://dizzy-pike-slippers.cyclic.app/) [https://0wwhsalsx2.execute-api.us-east-1.amazonaws.com/](https://0wwhsalsx2.execute-api.us-east-1.amazonaws.com/)

> :fire:Source Code Aws Serverless: [https://github.com/SaifulI57/lambda-api-weather](https://github.com/SaifulI57/lambda-api-weather)

# V1

### Tech Stack

-   Express.js
-   Node.js
-   Mongodb

## ENDPOINT

**Region**

-   GET `/api/v1/region/:provinsi`

**Contoh:**

-   GET `/api/v1/region/aceh`

**Response**

```json
{
  "name": "aceh",
  "path": "*.xml"
  "date": "3 feb 2024, 20:59:21 WIB",
  ...
}
```

**Regency**

-   GET `/api/v1/regency/:kabupaten`

**Contoh:**

-   GET `/api/v1/regency/kediri`

**Response**

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

**Filter**

-   GET `/api/v1/regency/:kabupaten?f=hu`

**Contoh:**

-   GET `/api/v1/regency/kediri?f=hu`

**Response**

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

**Filter**

-   GET `/api/v1/regency/:kabupaten?f=hu+humin`

**Contoh:**

-   GET `/api/v1/regency/:kabupaten?f=hu+humin`

**Response**

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

**Filter**

-   GET `/api/v1/regency/:kabupaten?f=hu+humin&onlyData=true`

**Contoh:**

-   GET `/api/v1/regency/kediri?f=hu+humin&onlyData=true`

**Response**

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

## Endpoint

**Region**

-   GET `/api/v2/:provinsi`

**Contoh**

-   GET `/api/v2/jawa timur`

**Response**

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

**Regency**

-   GET `/api/v2/regency/:kabupaten`

**Contoh**

-   GET `/api/v2/regency/kediri`

**Response**

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
