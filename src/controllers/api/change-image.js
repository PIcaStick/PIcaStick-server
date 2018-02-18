const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
  const { userStorage } = req.custom;
  const { token } = userStorage;

  const { hash } = req.body;

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

  const socket = userStorage.socket;
  // TODO-REFACTO: Create a utility to avoid manipulating directly the socket object
  socket.emit('change-image', dataToSend);

  res.send({
    found: true
  });
});

module.exports = router;
