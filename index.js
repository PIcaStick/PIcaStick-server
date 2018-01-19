const express = require('express');
const http = require('http');
const config = require('./config.json');
const bodyParser = require('body-parser')

const mainRouter = require('./src/controllers');
const channelPush = require('./src/services/channel-push');
const clearUploadedFiles = require('./src/services/upload-management/clear-files');

const app = express();
const httpServer = http.createServer(app);

app.use(express.static('public'));

const uploadedFilesConf = config['uploaded-files'];
app.use(`/${uploadedFilesConf['mounting-path']}`, express.static(uploadedFilesConf['folder']));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(mainRouter);

// TODO-DEBUG: Add a debug config with a permanent debug token not removed

channelPush.init(httpServer);

console.log('clearing uploaded files...')
clearUploadedFiles()
  .then(() => {
    httpServer.listen(3000);
  })
  .catch(console.error);
