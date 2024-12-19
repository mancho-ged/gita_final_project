const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Directory to store user data
const USERS_DIR = path.join(__dirname, 'users');

// Ensure the users directory exists
if (!fs.existsSync(USERS_DIR)) {
  fs.mkdirSync(USERS_DIR);
}

// Helper: Get the file path for a user by ID
const getUserFilePath = (id) => path.join(USERS_DIR, `user_${id}.json`);

// Create a new user
const createUser = (username, email, password) => {
  const userId = uuidv4();
  const user = { id: userId, username, email, password };
  const userFilePath = getUserFilePath(userId);
  try {
    fs.writeFileSync(userFilePath, JSON.stringify(user, null, 2));
    console.log('User file created successfully');
  } catch (err) {
    console.error('Error writing user file:', err.message);
    throw new Error('Failed to create user');
  }
  return user;
};

// Get all users
const getAllUsers = () => {
  const files = fs.readdirSync(USERS_DIR);
  return files.map((file) => {
    const data = fs.readFileSync(path.join(USERS_DIR, file));
    return JSON.parse(data);
  });
};

// Find a user by email
const findUserByEmail = (email) => {
  const users = getAllUsers();
  return users.find((user) => user.email === email);
};

// Authenticate user by email and password
const authenticateUser = (email, password) => {
  const user = findUserByEmail(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
};

module.exports = {
  createUser,
  getAllUsers,
  findUserByEmail,
  authenticateUser,
};
