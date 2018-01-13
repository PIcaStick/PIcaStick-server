const express = require('express');
const http = require('http');

const mainRouter = require('./src/controllers');
const initChannelPush = require('./src/services/channel-push');

const app = express();
const httpServer = http.createServer(app);

app.use(express.static('public'));
app.use('/uploaded-files', express.static('uploaded-files'));

app.use(mainRouter);

initChannelPush(httpServer);
httpServer.listen(3000);
