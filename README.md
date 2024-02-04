<h1 align="center">Endpoint</h1>

## Region

-   GET /region/:provinsi

```json
{
  "name": "aceh",
  "path": "*.xml"
  "date": "3 feb 2024, 20:59:21 WIB",
  "kab": {
    "acehbarat": {},
    ...
  }
  ...
}
```

-   GET /region/:provinsi?f=kab

```json
{
  "achebarat": {},
  ...
}
```

## Regency

-   GET /region/:provinsi/regency/:kabupaten

```json
{
  "hu":{
    '0': {
      "name": "humidity",
      "data": [arr],
      "type": "hourly",
      "data": "202402030000"
    }
  },
  ...
}
```

-   GET /region/:provinsi/regency/:kabupaten?f=hu

```json
{
  '0': {
    "name": "humidity",
    "data": [arr],
    "type": "hourly",
    "data": "202402030000"
   }
}
```