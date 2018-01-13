var express = require('express');
const mainRouter = require('./src/controllers');

const initChannelPush = require('./src/services/channel-push');

var app = express();
var http = require( "http" ).createServer( app );

var tmpdir = './upload/';

app.use(express.static('public'));
app.use('/fileUploaded', express.static(tmpdir));

app.use(mainRouter);

initChannelPush(http);
http.listen(3000);
