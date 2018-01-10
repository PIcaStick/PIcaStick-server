const express = require('express');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const util = require('util');

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(bodyParser.json());

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
    res.end(util.inspect({fields: fields, files: files}));
  });

  return;

  const { stuff } = req.body;
  if (typeof stuff === 'string' && stuff) {
    console.log(`Upload: ${stuff}`);
    res.send('ok!');
  }
  else {
    res.status(400).send('bad bad BAAAD!');
  }
});

app.listen(3000, () => {
  console.log('Super server listening on port 3000!');
});
