const express = require('express');
const fs = require('fs');
const config = require('../../../config.json');
// TODO-REFACTO: To delete
const usersStorage = require('../../services/users-storage');

// TODO-REFACTO: To delete
const socketStorage = require('../../services/channel-push/socket-storage');

const router = express.Router();

const uploadedFilesConf = config['uploaded-files'];

// TODO-REFACTO: Store the hash with file path on the server associated with the user token for security reason, for checking only in the user images list and not retrieve those of other users
// => or create a subdirectory for each user token to delete after each session

router.post('/', (req, res) => {
  //const { userStorage } = req.custom;

  const { hash } = req.body;
  //const { token } = userStorage;
  // TODO-REFACTO: Delete this and access it directly from the header when the front is ready
  const { token } = req.body;
  // TODO-REFACTO: To delete
  const userStorage = usersStorage.get(token);

  // TODO-REFACTO: Access the socket from the userstorage
  const socket = socketStorage.get(token);

  // TODO-SECURITY: Delete this when the security middleware is terminated
  if (!socket) {
    res.status(401)
      .send('bullshit');
    return;
  }

  const image = userStorage.images.get(hash);

  if (!image) {
    const errorMessage = `The hash requested '${hash}' doesn't have a image file associated for the user corresponding to the token '${token}'`;
    console.error(errorMessage);
    res.status(400)
      .send(errorMessage)
    return;
  }

  const { mountingPath } = image;

  const dataToSend = {
    path: mountingPath,
  };

  // TODO-REFACTO: Create a utility to avoid manipulating directly the socket object
  socket.emit('change-image', dataToSend);

  res.send();
});

module.exports = router;