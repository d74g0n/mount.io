/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


//
//  Argus Server
//

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 3000;
var exec = require("child_process").exec; 
var file = "./logs."; 


app.get('/', function(req, res){ // clearly sends the html file.
  res.sendFile(__dirname + '/index.html');
});

app.get('//', function(req, res){ // clearly sends the html file.
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
        var d = new Date();
        console.log(d);
    console.log("connected " + io.engine.clientsCount );   
    console.log(' -- SOCKET CONNECTED -- ');

   socket.on('disconnect', function() {
       var d = new Date();
       console.log(d);
       console.log('Got disconnect!');
      console.log("connected " + io.engine.clientsCount );
   });

    socket.on('chat message', function(msg){
    io.emit('chat message', msg);
// Add a console log of the msg passed	
    console.log('-[msg: ' + msg + ']-');
  });
});

http.listen(port, function(){
  console.log('- io websocket port *:' + port);
});


  // Start up console output.
    console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
    console.log("-= -= -=[      Mount.io Server Console 	    ]=- =- =");
    console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
    console.log("- FILE LOGGING: OFF");
    console.log("- init.");
    console.log("- webserver ready!");