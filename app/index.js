const express = require('express');
const userRouter = require('./routes/user');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Directory to store user data
const USERS_DIR = path.join(__dirname, 'users');

// Ensure the users directory exists
if (!fs.existsSync(USERS_DIR)) {
  fs.mkdirSync(USERS_DIR);
}

app.use('/api/v1/user', userRouter);

// TODO: implement user router
app.get('/', (req, res) => {
  res.send('Hello Express');
});
module.exports = app;
