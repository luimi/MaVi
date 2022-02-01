var express = require('express');
var ParseServer = require('parse-server').ParseServer;
require('dotenv').config()

var app = express();

var api = new ParseServer({
  databaseURI: process.env.MONGODB,
  cloud: './cloud/main.js',
  appId: process.env.APPID,
  masterKey: process.env.MASTERKEY,
  javascriptKey:process.env.JSKEY,
  serverURL: `${process.env.URL}:${process.env.PORT}/parse`,
  liveQuery: {
    classNames: ['WallPostComment','ChatMessage'],
  }
});
app.use('/parse', api);
app.get('/', (req,res)=> {
  res.send("MaVi");
});

let httpServer = require('http').createServer(app);
httpServer.listen(process.env.PORT);
var parseLiveQueryServer = ParseServer.createLiveQueryServer(httpServer);