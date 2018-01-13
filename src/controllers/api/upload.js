const express = require('express');
const formidable = require('formidable');
const socketStorage = require('../../services/channel-push/socket-storage');
const path = require('path');

const router = express.Router();

const maxPhotoSizeMB = 2;

router.post('/', (req, res) => {
  const form = new formidable.IncomingForm();
  // TODO: create a config for this dir (same in the index for mounting the static ressources service)
  form.uploadDir = "./uploaded-files";
  form.keepExtensions = true;
  form.type = 'multipart';
  form.maxFieldsSize = maxPhotoSizeMB * 1024 * 1024;
  form.multiples = false;

  form.parse(req, (err, fields, files) => {
    //const filePath = files.file.path;
    //console.log(filePath);

    const socket = socketStorage.get(fields.token);
    if (!socket) {
      res.status(401)
        .send('bullshit');
      return;
    }

    const filePath = files.file.path.replace('\\', '/');

    const dataToSend = {
      src: 'http://localhost:3000/' + filePath
    };

    // TODO: change event name to kebab case
    socket.emit('updateImage', dataToSend);

    res.send("Upload file received!");
  });
});

module.exports = router;