const express = require('express');
const bodyParser = require('body-parser');

const usersStorage = require('../../services/users-storage');

const uploadRouter = require('./upload');
const changeImageRouter = require('./change-image');
const router = express.Router();

router.use(bodyParser.json());

router.use((req, res, next) => {
  const token = req.headers['picastick-token'];
  const userStorage = usersStorage.get(token);

  if (!userStorage) {
    res.status(401)
      .send('bullshit');
    return;
  }

  req.custom = {
    userStorage,
  };

  next();
});

router.use('/upload', uploadRouter);
router.use('/change-image', changeImageRouter);

module.exports = router;