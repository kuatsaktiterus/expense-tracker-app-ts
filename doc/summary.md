## SUMMARY API SPEC

## GET SUMMARY

Endpoint: GET /api/v1/summaries

Headers:

- Authorization: token

Response Body (success):

```json
{
  "data": {
    "id": 1,
    "incomes_total": 3000000,
    "expenses_total": "THR",
    "incomes_count": "THR",
    "expenses_count": "THR",
    "id_user": "1"
  }
}
```

Response Body (failed):

```json
{
  "errors": "unauthorized"
}
```
