<h1 align="center">Endpoint</h1>

## Region

-   GET /region/:provinsi

```json
{
  "name": "aceh",
  "path": "*.xml"
  "date": "3 feb 2024, 20:59:21 WIB",
  ...
}
```

## Regency

-   GET /regency/:kabupaten

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

-   GET /regency/:kabupaten?f=hu

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

-   GET /regency/:kabupaten?f=hu+humin

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

-   GET /regency/:kabupaten?f=hu+humin&onlyData=true

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
