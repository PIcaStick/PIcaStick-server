const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(bodyParser.json());

app.post('/file-upload', (req, res) => {
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