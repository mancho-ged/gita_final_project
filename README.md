# File-sharing Service

## Testing the endpoints

Register the user

`bash
curl -X POST http://localhost:3000/api/v1/user/create \
-H "Content-Type: application/json" \
-d '{"username": "JohnDoe", "email": "john.doe@example.com", "password": "securepassword"}'
`
