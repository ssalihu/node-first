/*
 * Simply nodejs. First attempt. 
 * 1.  Client connects to the server
 * 2.  Subscribe to redis for messages
 * 3. If message received send it to the connected clients
 * 
 * All the processing will happen at the client side based on the payload sent
 * 
 */
const PORT = 3003;
const HOST = 'localhost';

/*
 * Need to move to configuration file. 
 * Tell puppet master!
 */ 
var express = require('express')
  , http = require('http');
var redis = require("redis");


/*
 * Need to move to configuration file. 
 * Tell puppet master!
 */ 
var REDIS_URL = 'localhost';
var REDIS_PORT = 6379;


var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(PORT); 

var s;
// .. Process every client connection request ..
console.log("connection listening on "+PORT+" ...");
io.on('connection', function (socket) {

	console.log("connection accepted and now forking business features for connected client...");
	s=socket;

	var redisClient = redis.createClient( REDIS_PORT, REDIS_URL );

	redisClient.on("message", function (channel, message) {

		//console.log("client channel => " + channel + "; message => " + message + ";");
		if(message!='clear') 
                {
                        data = JSON.parse(message);
                        console.log('when '+ data.when);
			socket.emit(data.client_id, {payload: message});
		} else 
                {
			socket.emit('feed', {payload: message});
		}
	});
	redisClient.subscribe("chat_channel");

  	socket.on('client_messsage', function (data) {
    		console.log(data);
  	});

});
