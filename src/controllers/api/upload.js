const express = require('express');
const formidable = require('formidable');

const router = express.Router();

const maxPhotoSizeMB = 2;

router.post('/', (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = "./upload";
  form.keepExtensions = true;
  form.type = 'multipart';
  form.maxFieldsSize = maxPhotoSizeMB * 1024 * 1024;
  form.multiples = false;

  form.parse(req, (err, fields, files) => {
    const filePath = files.file.path;
    console.log(filePath);
    // TODO: Emit the new path of uploaded file

    res.set({
      'Content-Type': 'text/plain'
    });
    res.send("Upload file received!");
  });
});

module.exports = router;