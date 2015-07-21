/* Import node's http module: */
var handler = require("./request-handler");
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var parseData;
var read = function() { 
  fs.readFile('chats.json', 'utf-8', function(err, data){
    parseData = JSON.parse(data).results;
  });
};
read();
// Every server needs to listen on a port with a unique number. The
// standard port for HTTP servers is port 80, but that port is
// normally already claimed by another server and/or not accessible
// so we'll use a standard testing port like 3000, other common development
// ports are 8080 and 1337.

var port = 3000;

// For now, since you're running this server on your local machine,
// we'll have it listen on the IP address 127.0.0.1, which is a
// special address that always refers to localhost.
var ip = "127.0.0.1";

// We use node's http module to create a server.
//
// The function we pass to http.createServer will be used to handle all
// incoming requests.
//
// After creating the server, we will tell it to listen on the given port and IP. */
// var server = http.createServer(handler.requestHandler);
// console.log("Listening on http://" + ip + ":" + port);
// server.listen(port, ip);
app.use(bodyParser.json());
app.use(express.static('../client'));


app.get(/c/, function(req, res) {
  read();
  res.json({results: parseData});
});

app.post(/c/, function(req, res){
  read();
  parseData.push(req.body);
  var newString = JSON.stringify({results: parseData})
  fs.writeFile('chats.json', newString, 'utf-8', function(err){
    if(err) throw err;
  });
  res.send(newString);

})

var server = app.listen(3000, '127.0.0.1', function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening at http://%s:%s', host, port);
});

// To start this server, run:
//
//   node basic-server.js
//
// on the command line.
//
// To connect to the server, load http://127.0.0.1:3000 in your web
// browser.
//
// server.listen() will continue running as long as there is the
// possibility of serving more requests. To stop your server, hit
// Ctrl-C on the command line.