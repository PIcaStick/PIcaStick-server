const express = require('express');
const formidable = require('formidable');
const config = require('../../../config.json');

const socketStorage = require('../../services/channel-push/socket-storage');

const router = express.Router();

const maxPhotoSizeMB = 2;

const uploadedFilesConf = config['uploaded-files'];

router.post('/', (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = uploadedFilesConf['folder'];
  form.keepExtensions = true;
  form.type = 'multipart';
  form.maxFieldsSize = maxPhotoSizeMB * 1024 * 1024;
  form.multiples = false;

  form.parse(req, (err, fields, files) => {
    const socket = socketStorage.get(fields.token);
    if (!socket) {
      res.status(401)
        .send('bullshit');
      return;
    }

    // Replace backslash to slash because 'formidable' and 'windows'
    const defaultFilePath = files.file.path.replace('\\', '/');
    const fileName = defaultFilePath.split('/').pop();

    const dataToSend = {
      path: `${uploadedFilesConf['mounting-path']}/${fileName}`,
    };

    // TODO: encapsulate the emission into specifics methods well defined (keep all eventName in the same place with the data emission format)
    socket.emit('new-image', dataToSend);

    res.send("Upload file received!");
  });
});

module.exports = router;