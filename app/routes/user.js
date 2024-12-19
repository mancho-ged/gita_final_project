var express = require('express');
var router = express.Router();
const z = require('zod');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const auth = require('../utils/auth');
const path = require('path');

const {
  createUser,
  findUserByEmail,
  authenticateUser,
} = require('../services/userService');
const {
  createItem,
  listItems,
  deleteItem,
} = require('../services/folderService');

const {
  uploadFile,
  attachMeta,
  getMeta,
} = require('../services/fileService.js');

// Secret for JWT
const JWT_SECRET = 'your_jwt_secret';

const upload = multer({ dest: path.join(__dirname, '..', 'uploads') });

// Route: Register User
router.post('/create', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      error: 'All fields are required: username, email, and password.',
    });
  }

  if (findUserByEmail(email)) {
    return res
      .status(409)
      .json({ error: 'User with this email already exists.' });
  }

  const user = createUser(username, email, password);
  res.status(201).json({
    message: 'User created successfully',
    user: { id: user.id, username, email },
  });
});

// Route: Validate User
router.post('/validate', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const user = findUserByEmail(email);
  if (user) {
    return res.status(200).json({ valid: true });
  }

  res.status(404).json({ valid: false, error: 'User not found.' });
});

// Route: Login User
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = authenticateUser(email, password);
  if (user) {
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h',
    });
    return res.status(200).json({ message: 'Login successful', token });
  }

  res.status(401).json({ error: 'Invalid email or password.' });
});

// GET /api/v1/user/space - List all items
router.get('/space', async (req, res) => {
  const { userId, folderPath = '' } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const items = await listItems(userId, folderPath);
    res.status(200).json({ items });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/v1/user/space/create - Create a file or folder
router.put('/space/create', async (req, res) => {
  const { userId, itemPath, isFolder = true } = req.body;

  if (!userId || !itemPath) {
    return res
      .status(400)
      .json({ error: 'User ID and item path are required' });
  }

  try {
    await createItem(userId, itemPath, isFolder);
    res.status(201).json({ message: 'Item created successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/v1/user/space/file - Delete a file or folder
router.delete('/space/file', async (req, res) => {
  const { userId, itemPath } = req.body;

  if (!userId || !itemPath) {
    return res
      .status(400)
      .json({ error: 'User ID and item path are required' });
  }

  try {
    deleteItem(userId, itemPath);
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// File Management Routes
router.post(
  '/space/upload',
  auth.authenticateUser,
  upload.single('file'),
  uploadFile
);
router.post('/space/meta', auth.authenticateUser, attachMeta);
router.get('/space/meta', auth.authenticateUser, getMeta);

module.exports = router;
