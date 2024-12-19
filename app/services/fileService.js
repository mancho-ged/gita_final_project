const fs = require('fs-extra');
const path = require('path');

const uploadsDir = path.join(__dirname, '..', 'uploads');
const metadataDir = 'metadata';

const uploadFile = (req, res, next) => {
  const userDir = path.join(uploadsDir, req.userId.toString());
  console.log(req.file);
  const filePath = path.join(userDir, req.file.originalname);

  fs.moveSync(req.file.path, filePath);
  res.status(200).send({
    message: 'File uploaded successfully',
    file: req.file.originalname,
  });
};

const attachMeta = (req, res) => {
  const { fileName, meta } = req.body;
  const metaPath = path.join(metadataDir, `${fileName}.json`);

  fs.outputJsonSync(metaPath, meta);
  res.status(200).send({ message: 'Meta information saved' });
};

const getMeta = (req, res) => {
  const { fileName } = req.query;
  const metaPath = path.join(metadataDir, `${fileName}.json`);

  if (!fs.existsSync(metaPath))
    return res.status(404).send({ message: 'Meta information not found' });

  const meta = fs.readJsonSync(metaPath);
  res.status(200).send({ meta });
};

module.exports = { uploadFile, attachMeta, getMeta };
