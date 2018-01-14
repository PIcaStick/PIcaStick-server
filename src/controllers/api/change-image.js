const express = require('express');
const fs = require('fs');
const config = require('../../../config.json');

const socketStorage = require('../../services/channel-push/socket-storage');

const router = express.Router();

const uploadedFilesConf = config['uploaded-files'];

// TODO-REFACTO: Store the hash with file path on the server associated with the user token for security reason, for checking only in the user images list and not retrieve those of other users
// => or create a subdirectory for each user token to delete after each session

router.post('/', (req, res) => {
  // TODO-REFACTO: Define a middleware to automatically check if user can access the route and give the socket and hash to the controller
  // TODO-REFACTO: Define the token into the header or whatever (outside the body, uniformly for all http method)
  const { token, hash } = req.body;
  const socket = socketStorage.get(token);
  if (!socket) {
    res.status(401)
      .send('bullshit');
    return;
  }

  (new Promise((resolve, reject) => {
    fs.readdir(uploadedFilesConf['folder'], (err, files) => {
      if (err) reject({
        status: 500,
        message: "Internal error",
        errorMessage: err,
      });
      else resolve(files);
    });
  }))
  .then(files => {
    const file = files.find(file => file.includes(hash));

    if (!file) {
      throw {
        status: 400,
        message: `The hash requested '${hash}' doesn't have a image file associated for the user corresponding to the token '${token}'`,
        errorMessage: null,
      }
    }
    return file;
  })
  .then(fileName => {
    const dataToSend = {
      path: `${uploadedFilesConf['mounting-path']}/${fileName}`,
    };
  
    socket.emit('change-image', dataToSend);

    res.send();
  })
  .catch(({ status, message, errorMessage }) => {
    console.error(errorMessage || message);
    res.status(status)
      .send(message);
  });
});

module.exports = router;