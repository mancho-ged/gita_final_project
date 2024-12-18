const fs = require('fs'); // Use callback-based API
const path = require('path');

// Directory to store user files
const USER_FILES_DIR = path.join(__dirname, 'user_files');

// Ensure the user_files directory exists
if (!fs.existsSync(USER_FILES_DIR)) {
  fs.mkdirSync(USER_FILES_DIR, { recursive: true });
}

// Helper: Get a user's root folder
const getUserRoot = (userId) => path.join(USER_FILES_DIR, `user_${userId}`);

// Ensure user root folder exists
const ensureUserRoot = (userId, callback) => {
  const userRoot = getUserRoot(userId);
  fs.mkdir(userRoot, { recursive: true }, (err) => {
    if (err) {
      console.error('Error creating user root folder:', err.message);
      return callback(err);
    }
    callback(null, userRoot);
  });
};

// Create a folder or file
const createItem = (userId, itemPath, isFolder, callback) => {
  ensureUserRoot(userId, (err, userRoot) => {
    if (err) return callback(err);

    const fullPath = path.join(userRoot, itemPath);

    if (isFolder) {
      fs.mkdir(fullPath, (err) => {
        if (err) {
          console.error('Error creating folder:', err.message);
          return callback(err);
        }
        callback(null);
      });
    } else {
      fs.writeFile(fullPath, '', (err) => {
        if (err) {
          console.error('Error creating file:', err.message);
          return callback(err);
        }
        callback(null);
      });
    }
  });
};

// List all items in a folder
const listItems = (userId, folderPath, callback) => {
  ensureUserRoot(userId, (err, userRoot) => {
    if (err) return callback(err);

    const fullPath = path.join(userRoot, folderPath || '');

    fs.readdir(fullPath, { withFileTypes: true }, (err, items) => {
      if (err) {
        console.error('Error listing items:', err.message);
        return callback(err);
      }
      const result = items.map((item) => ({
        name: item.name,
        type: item.isDirectory() ? 'folder' : 'file',
      }));
      callback(null, result);
    });
  });
};

// Delete a file or folder
const deleteItem = (userId, itemPath, callback) => {
  ensureUserRoot(userId, (err, userRoot) => {
    if (err) return callback(err);

    const fullPath = path.join(userRoot, itemPath);

    fs.lstat(fullPath, (err, stats) => {
      if (err) {
        console.error('Error getting item stats:', err.message);
        return callback(err);
      }

      if (stats.isDirectory()) {
        fs.readdir(fullPath, (err, contents) => {
          if (err) {
            console.error('Error reading folder contents:', err.message);
            return callback(err);
          }

          if (contents.length > 0) {
            return callback(new Error('Folder is not empty'));
          }

          fs.rmdir(fullPath, (err) => {
            if (err) {
              console.error('Error deleting folder:', err.message);
              return callback(err);
            }
            callback(null);
          });
        });
      } else {
        fs.unlink(fullPath, (err) => {
          if (err) {
            console.error('Error deleting file:', err.message);
            return callback(err);
          }
          callback(null);
        });
      }
    });
  });
};

module.exports = {
  createItem,
  listItems,
  deleteItem,
};
