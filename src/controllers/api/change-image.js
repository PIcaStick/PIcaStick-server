const express = require('express');
// TODO-REFACTO: To delete
const usersStorage = require('../../services/users-storage');

const router = express.Router();

router.post('/', (req, res) => {
  //const { userStorage } = req.custom;

  const { hash } = req.body;
  //const { token } = userStorage;
  // TODO-REFACTO: Delete this and access it directly from the header when the front is ready
  const { token } = req.body;
  // TODO-REFACTO: To delete
  const userStorage = usersStorage.get(token);

  // TODO-SECURITY: Delete this when the security middleware is terminated
  if (!userStorage) {
    res.status(401)
      .send('bullshit');
    return;
  }

  const socket = userStorage.socket;

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