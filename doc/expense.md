# EXPENSE API SPEC

## INSERT EXPENSE

Endpoint: POST /api/v1/expenses

Headers:

- Authorization: token

Request Body (success):

```json
{
  "expense": 3000000,
  "expense_name": "rahasia",
  "date_of_expense": 27-06-2024,
  "id_user": 1
}
```

Response Body:

```json
{
  "id": 1,
  "expense": 3000000,
  "expense_name": "rahasia",
  "date_of_expense": 27-06-2024,
  "id_user": 1
}
```

Response Body (failed):

```json
{
  "errors": "unauthorized"
}
```

## LIST EXPENSE

Endpoint: GET /api/v1/expenses

Headers:

- Authorization: token

Response Body (success):

```json
{
  "data": [
    {
      "id": 1,
      "expense": 3000000,
      "expense_name": "beli hp baru",
      "date_of_expense": 24-06-2024,
      "id_user": 1
    },
    {
      "id": 2,
      "expense": 3000000,
      "expense_name": "beli hp baru",
      "date_of_expense": 24-06-2024,
      "id_user": 1
    }
  ],
  "paging": {
    "size": 10,
    "current_page": 1,
    "total_page": 10
  }
}
```

Response Body (failed):

```json
{
  "errors": "unauthorized"
}
```

## GET EXPENSE

Endpoint: GET /api/v1/expenses/:id

Headers:

- Authorization: token

Response Body (success):

```json
{
    "data":{
      "id": 1,
      "expense": 3000000,
      "expense_name": "beli hp baru",
      "date_of_expense": 24-06-2024,
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

## EDIT EXPENSE

Endpoint: PUT /api/v1/expenses/:id

Headers:

- Authorization

Request Body:

```json
{
  "data": {
    "expense": 3000000, // optional
    "expense_name": "beli hp baru", // optional
    "date_of_expense": 24-06-2024 // optional
  }
}
```

Response Body (success):

```json
{
  "data": {
    "id": 1,
    "expense": 3000000,
    "expense_name": "beli hp baru",
    "date_of_expense": 24-06-2024,
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

## DELETE EXPENSE

Endpoint: DELETE /api/v1/expense/:id

Headers:

- Authorization: token

Response Body (success):

```json
{
  "data": true
}
```
