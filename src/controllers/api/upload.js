const express = require('express');
const formidable = require('formidable');
const config = require('../../../config.json');
// TODO-REFACTO: To delete
const usersStorage = require('../../services/users-storage');

const router = express.Router();

const maxPhotoSizeMB = 2;

const uploadedFilesConf = config['uploaded-files'];

router.post('/', (req, res) => {
  //const { userStorage } = req.custom;
  //const { token } = userStorage;

  const form = new formidable.IncomingForm();
  form.uploadDir = uploadedFilesConf['folder'];
  form.keepExtensions = true;
  form.type = 'multipart';
  form.maxFieldsSize = maxPhotoSizeMB * 1024 * 1024;
  form.multiples = false;

  form.parse(req, (err, fields, files) => {
    // TODO-REFACTO: Delete this and access it directly from the header when the front is ready
    const token = fields.token;
    // TODO-REFACTO: Delete when ready
    const userStorage = usersStorage.get(token);

    // TODO-SECURITY: Delete this when the security middleware is terminated
    if (!userStorage) {
      res.status(401)
        .send('bullshit');
      return;
    }

    const { socket } = userStorage;

    // Replace backslash to slash because 'formidable' and 'windows'
    const defaultFilePath = files.file.path.replace('\\', '/');

    const re = /^.*_([A-Za-z0-9]+)\.jpg$/i;
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
      hash: imageHash,
    });
  });
});

module.exports = router;