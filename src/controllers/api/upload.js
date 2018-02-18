const express = require('express');
const formidable = require('formidable');
const config = require('../../../config.json');

const router = express.Router();

const maxPhotoSizeMB = 2;

const uploadedFilesConf = config['uploaded-files'];

router.post('/', (req, res) => {
  const { userStorage } = req.custom;

  const form = new formidable.IncomingForm();
  form.uploadDir = uploadedFilesConf['folder'];
  form.keepExtensions = true;
  form.type = 'multipart';
  form.maxFieldsSize = maxPhotoSizeMB * 1024 * 1024;
  form.multiples = false;

  form.parse(req, (err, fields, files) => {
    const { socket } = userStorage;

    // Replace backslash to slash because 'formidable' and 'windows'
    const defaultFilePath = files.file.path.replace('\\', '/');

    const re = /^.*_([A-Za-z0-9]+)\.[A-Za-z0-9]*$/i;
    const imageHash = defaultFilePath.match(re).pop();

    const fileName = defaultFilePath.split('/').pop();
    const mountingPath = `${uploadedFilesConf['mounting-path']}/${fileName}`;

    const image = {
      fileName,
      mountingPath,
    };
    userStorage.images.set(imageHash, image);

    const dataToSend = {
      path: mountingPath,
    };
    // TODO-REFACTO: Create a utility to avoid manipulating directly the socket object
    socket.emit('new-image', dataToSend);

    res.json({
      imageHash: imageHash,
      filePath: mountingPath
    });
  });
});

module.exports = router;
