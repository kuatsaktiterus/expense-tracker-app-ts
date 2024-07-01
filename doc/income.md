# INCOME API SPEC

## INSERT INCOME

Endpoint: POST /api/v1/incomes

Headers:

- Authorization: token

Request Body:

```json
{
  "income": 3000000,
  "income_name": "rahasia",
  "date_of_income": 27-06-2024
}
```

Response Body (success):

```json
{
  "id": 1,
  "income": "ricky",
  "income_name": "rahasia",
  "date_of_income": 27-06-2024
}
```

Response Body (failed):

```json
{
  "errors": "unauthorized"
}
```

## LIST INCOME

Endpoint: GET /api/v1/incomes

Headers:

- Authorization: token

Response Body (success):

```json
{
  "data": [
    {
      "id": 1,
      "income": 3000000,
      "incomes_name": "THR",
      "date_of_income": 24-06-2024
    },
    {
      "id": 2,
      "income": 3000000,
      "incomes_name": "THR lagi",
      "date_of_income": 24-06-2024
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

## GET INCOME

Endpoint: GET /api/v1/incomes/:id

Headers:

- Authorization: token

Response Body (success):

```json
{
    "data":{
      "id": 1,
      "income": 3000000,
      "expenses_name": "THR",
      "date_of_expense": 24-06-2024
    }
}
```

Response Body (failed):

```json
{
  "errors": "unauthorized"
}
```

## EDIT INCOME

Endpoint: PUT /api/v1/incomes/:id

Headers:

- Authorization

Request Body:

```json
{
  "data": {
    "income": 3000000, // optional
    "incomes_name": "THR jilid 2", // optional
    "date_of_income": 24-06-2024 // optional
  }
}
```

Response Body (success):

```json
{
  "data": {
    "id": 1,
    "expense": 3000000,
    "incomes_name": "THR jilid 2",
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
