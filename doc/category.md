## CATEGORY API

## INSERT CATEGORY

Endpoint: POST /api/v1/categories

Headers:

- Authorization: token

Request Body:

```json
{
  "category": "Kuliah",
  "id_user": 1
}
```

Response Body (success):

```json
{
  "id": 1,
  "category": "Kuliah",
  "id_user": 1
}
```

Response Body (failed):

```json
{
  "errors": "unauthorized"
}
```

## GET LIST CATEGORY

Endpoint: GET /api/v1/categories

Headers:

- Authorization: token

Response Body (success):

```json
{
  "data": [
    {
      "id": 1,
      "category": "Kuliah",
      "id_user": 1
    },
    {
      "id": 2,
      "category": "Malming",
      "id_user": 1
    }
  ],
  "paging": {
    "size": 10,
    "current_page": 1,
    "total_page": 1
  }
}
```

Response Body (failed):

```json
{
  "errors": "unauthorized"
}
```

## GET CATEGORY

Endpoint: GET /api/v1/categories/:id

Headers:

- Authorization: token

Response Body (success):

```json
{
  "data": {
    "id": 1,
    "category": "Kuliah",
    "id_user": 1
  }
}
```

Response Body (failed):

```json
{
  "errors": "unauthorized"
}
```

## UPDATE CATEGORY

Endpoint: PUT /api/v1/categories/:id

Headers:

- Authorization

Request Body:

```json
{
  "data": {
    "category": "Kuliah"
  }
}
```

Response Body (success):

```json
{
  "data": {
    "id": 1,
    "category": "Kuliah",
    "id_user": 1
  }
}
```

Response Body (failed):

```json
{
  "errors": "unauthorized"
}
```

## DELETE CATEGORY

Endpoint: DELETE /api/v1/categories/:id

Headers:

- Authorization: token

Response Body (success):

```json
{
  "data": true
}
```
