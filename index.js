const express = require('express');
const http = require('http');
const config = require('./config.json');

const mainRouter = require('./src/controllers');
const channelPush = require('./src/services/channel-push');

const app = express();
const httpServer = http.createServer(app);

app.use(express.static('public'));

const uploadedFilesConf = config['uploaded-files'];
app.use(`/${uploadedFilesConf['mounting-path']}`, express.static(uploadedFilesConf['folder']));

app.use(mainRouter);

channelPush.init(httpServer);
httpServer.listen(3000);
