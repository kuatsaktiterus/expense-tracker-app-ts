# USER API SPEC

## REGISTER USER

Endpoint: POST /api/v1/users

Request Body:

```json
{
  "username": "ricky",
  "password": "rahasia"
}
```

Response Body (success):

```json
{
  "data": {
    "username": "ricky",
    "password": "rahasia"
  }
}
```

Response Body (failed):

```json
{
  "errors": "username already exist"
}
```

## LOGIN USER

Endpoint: POST /api/v1/users/login

Request Body:

```json
{
  "username": "ricky",
  "password": "rahasia"
}
```

Response Body (success):

```json
{
  "data": {
    "id": 1,
    "username": "ricky",
    "password": "rahasia",
    "token": "token"
  }
}
```

Response Body (failed):

```json
{
  "errors": "username or password is wrong"
}
```

## GET CURRENT USER

Endpoint: GET /api/v1/users/current

Headers:

- Authorization: token

Response Body (success):

```json
{
  "data": {
    "id": 1,
    "username": "ricky",
    "password": "rahasia"
  }
}
```

Response Body (failed):

```json
{
  "errors": "unauthorized"
}
```

## EDIT CURRENT USER

Endpoint: PATCH /api/v1/users/current

Headers:

- Authorization

Request Body:

```json
{
  "id": 1,
  "username": "ricky", // optional
  "password": "rahasia" // optional
}
```

Response Body (success):

```json
{
  "data": {
    "id": 1,
    "username": "ricky"
  }
}
```

Response Body (failed):

```json
{
  "errors": "username already registered"
}
```

## LOGOUT

Endpoint: DELETE /api/v1/users/current

Request Body:

```json
{
  "username": "ricky",
  "password": "rahasia"
}
```

Response Body (success):

```json
{
  "data": true
}
```
