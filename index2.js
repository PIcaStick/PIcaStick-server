var express = require('express');
const mainRouter = require('./src/controllers');

const initChannelPush = require('./src/services/channel-push');

var app = express();
var http = require( "http" ).createServer( app );

app.use(express.static('public'));
app.use(express.static('uploaded-files'));

app.use(mainRouter);

initChannelPush(http);
http.listen(3000);
