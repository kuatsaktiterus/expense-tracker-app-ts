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
    "expenses_total": "THR",
    "expenses_total": "THR"
  }
}
```

Response Body (failed):

```json
{
  "errors": "unauthorized"
}
```
