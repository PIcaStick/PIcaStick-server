const express = require('express');
const bodyParser = require('body-parser');
const uploadRouter = require('./upload');
const changeImageRouter = require('./change-image');
const router = express.Router();

router.use(bodyParser.json());

router.use('/upload', uploadRouter);
router.use('/change-image', changeImageRouter);

module.exports = router;