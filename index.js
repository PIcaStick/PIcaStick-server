const express = require('express');
const formidable = require('formidable');
const util = require('util');
const emitNewFile = require('./socket');

const app = express();

app.use(express.static('public'));
// TODO: whitelist for only uploaded files with prefix to ignore .gitgnore --'
app.use('/upload', express.static('upload'));

app.post('/file-upload', (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = "./upload";
  form.keepExtensions = true;
  form.type = 'multipart';
  const maxSizeMB = 2;
  form.maxFieldsSize = maxSizeMB * 1024 * 1024;
  form.multiples = false;

  form.parse(req, (err, fields, files) => {
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('received upload:\n\n');
    const filePath = files.file.path;
    emitNewFile(filePath);
    res.end(util.inspect({fields: fields, files: files}));
  });
});

app.listen(3000, () => {
  console.log('Super server listening on port 3000!');
});
