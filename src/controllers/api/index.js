const express = require('express');
const bodyParser = require('body-parser');

const usersStorage = require('../../services/users-storage');

const uploadRouter = require('./upload');
const changeImageRouter = require('./change-image');
const router = express.Router();

router.use(bodyParser.json());

router.use((req, res, next) => {
  const token = req.headers['custom-token'];
  const userStorage = usersStorage.get(token);

  // TODO-SECURITY: Response with 401 if userStorage not found when the front is ready

  req.custom = {
    userStorage,
  };

  next();
});

router.use('/upload', uploadRouter);
router.use('/change-image', changeImageRouter);

module.exports = router;