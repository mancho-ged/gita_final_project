const fs = require('fs/promises');
const path = require('path');

// Root directory for user files
const USER_FILES_DIR = path.join(__dirname, '..', 'uploads');

// Ensure the root folder exists
(async () => {
  try {
    await fs.mkdir(USER_FILES_DIR, { recursive: true });
  } catch (err) {
    console.error('Error creating user_files directory:', err.message);
  }
})();

// Helper: Get user-specific folder
const getUserFolder = (userId) => path.join(USER_FILES_DIR, `user_${userId}`);

// Ensure the user-specific folder exists
const ensureUserFolder = async (userId) => {
  const userFolder = getUserFolder(userId);
  try {
    await fs.mkdir(userFolder, { recursive: true });
  } catch (err) {
    console.error('Error creating user folder:', err.message);
    throw new Error('Failed to ensure user folder');
  }
  return userFolder;
};

// Create a file or folder
const createItem = async (userId, itemPath, isFolder = true) => {
  const userFolder = await ensureUserFolder(userId);
  const fullPath = path.join(userFolder, itemPath);

  if (isFolder) {
    await fs.mkdir(fullPath);
  } else {
    await fs.writeFile(fullPath, '');
  }
};

// List items in a user's folder
const listItems = async (userId, folderPath = '') => {
  const userFolder = await ensureUserFolder(userId);
  const fullPath = path.join(userFolder, folderPath);

  const items = await fs.readdir(fullPath, { withFileTypes: true });
  console.log(items);
  if (items.length === 0) {
    console.log('The directory is empty');
  }
  return items.map((item) => ({
    name: item.name,
    type: item.isDirectory() ? 'folder' : 'file',
  }));
};

// Delete a file or folder
const deleteItem = async (userId, itemPath) => {
  const userFolder = await ensureUserFolder(userId);
  const fullPath = path.join(userFolder, itemPath);

  const stats = await fs.lstat(fullPath);

  if (stats.isDirectory()) {
    const contents = await fs.readdir(fullPath);
    if (contents.length > 0) {
      throw new Error('Folder is not empty');
    }
    await fs.rmdir(fullPath);
  } else {
    await fs.unlink(fullPath);
  }
};

module.exports = {
  createItem,
  listItems,
  deleteItem,
};
