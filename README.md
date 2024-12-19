# File-sharing Service

start project with npm start

## Testing the endpoints

Register the user

`bash
curl -X POST http://localhost:3000/api/v1/user/create \
-H "Content-Type: application/json" \
-d '{"username": "JohnDoe", "email": "john.doe@example.com", "password": "securepassword"}'
`
or with postman

### Endpoint POST

```bash
/api/v1/user/create
```

#### Body

```json
{
  "username": "testuser2",
  "password": "password123",
  "email": "email2@email.com"
}
```

### Endpoint POST

```bash
/api/v1/user/login
```

#### Body

```json
{
  "email": "email2@email.com",
  "password": "password123"
}
```

#### Expected output

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQxNWI4ZjIxLTk4NTktNGVhMC04YTVlLTk2ZDE4OTk4YzE2ZSIsImVtYWlsIjoiZW1haWwyQGVtYWlsLmNvbSIsImlhdCI6MTczNDYzMjA1NiwiZXhwIjoxNzM0NjM1NjU2fQ.AqAfmPBdpquVjrk6JMvS7V1E0Pvzvcqgou9lrcnH5Ww"
}
```
