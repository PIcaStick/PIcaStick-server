var express = require('express');
var app = express();
var http = require( "http" ).createServer( app );
var io = require( "socket.io" )( http );

var formidable = require('formidable');
var util = require('util');
var randomstring = require("randomstring");
var fs = require('fs');
var path = require('path');

const mainRouter = require('./src/controllers');

let sockets = {};

var tmpdir = './upload/';

app.use ('/fileUploaded', express.static(tmpdir));

app.use(express.static('public'));

app.use(mainRouter);

app.post('/upload', (req, res) => {

  let form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files){
    if (!sockets.hasOwnProperty(fields.token)){
      res.end("bullshit");
      return;
    }

    sockets[fields.token].emit('updateImage', {src: fields.url});
    res.end(fields.url);
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});


io.on('connection', (client) => {
  let token = "";
  do {
    token = randomstring.generate({
      length: 7,
      readable: true
    });
  } while(sockets.hasOwnProperty(token));
  sockets[token] = client;
  console.log(token);

  client.on('disconnect', () => {
    console.log('delete');
    delete sockets[token];
  })
});


http.listen(3000);
