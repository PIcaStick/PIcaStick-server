const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  // TODO: Move photo upload code here
  res.send('new upload route');
});

module.exports = router;