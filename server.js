#!/bin/env node

//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');




/**
 *  Define the sample application. 
 writing all function defs inside this giant function and assign the whole thing to variable 'SampleApp'
 */
var SampleApp = function() {

    //  Scope. 'This' means var 'self' refers to the SampleApp object
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     object 'self'('SampleApp') has method 'setupVariables' which does as the name implies

     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8000;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };


    /**
     *  Populate the cache.
     populateCache is a method of class SampleApp which caches data as user uses the web app
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */


    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() { //self.createRoutes is method of class SampleApp
        self.routes = { }; //creating all app's routes then saving them as data in object self.routes

        self.routes['/asciimo'] = function(req, res) {
            var link = "http://i.imgur.com/kmbjB.png";
            res.send("<html><body><img src='" + link + "'></body></html>");
        };

        self.routes['/'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('index.html') );
        };
        self.routes['/gmap.js']= function(req, res){
            fs.readFile('./gmap.js', 'utf-8', function (error, content){
                res.setHeader('Content-Type', 'text/plain');
                res.end(content)
            });   
        };
        self.routes['/engine.js']= function(req, res){
            fs.readFile('./engine.js', 'utf-8', function (error, content){
                res.setHeader('Content-Type', 'text/plain');
                res.end(content)
            });   
        };
        self.routes['/functions.js']= function(req, res){
            fs.readFile('./functions.js', 'utf-8', function (error, content){
                res.setHeader('Content-Type', 'text/plain');
                res.end(content)
            });   
        };

    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();
        self.app = express.createServer();

        //  Add handlers for the app (from the routes).
        for (var r in self.routes) { //this for loop is similar to routes handling i am used with app object created with express frmwk
            self.app.get(r, self.routes[r]);
        }
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        var server = self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
        return server;
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
var server = zapp.start();
var io = require('socket.io')(server);
io.on('connection', function (socket) {
    
    // upon receiving positions updates from Z group, broadcast data to all sockets connected to website
    socket.on('ZueyLRFUpdates', function(updates){
        socket.broadcast.emit('message', 'Updates from Z group received');
        socket.broadcast.emit('newZueyCoords', updates);
    });

    // upon receiving positions updates from Z group, broadcast data to all sockets connected to website
    socket.on('JMLRFUpdates', function(updates){
        socket.broadcast.emit('message', 'Updates from JM group received');
        socket.broadcast.emit('newJMCoords', updates);
    });

    // upon receiving positions updates from Other group, broadcast data to all sockets connected to website
    socket.on('OtherLRFUpdates', function(updates){
        socket.broadcast.emit('message', 'Updates from Other group received');
        socket.broadcast.emit('newOtherCoords', updates);
    });




    
    console.log('A client is connected');

    socket.emit('message', 'Welcome to Mapview! Awaiting coordinate updates...');
    socket.on('newClient', function (clientName) {
        socket.username = clientName;
        console.log(clientName + ' just joined');
        socket.broadcast.emit('message', socket.username + ' just joined the chat');
    });
    socket.on('message', function (message) {
        console.log('Message from a client: ' + message);

    });
    socket.on('groupChatMessage', function (chatMessage) {

        var chatMessageRelayed = '<b>' + socket.username + '</b> : ' + chatMessage;
        socket.broadcast.emit('relayMessage', chatMessageRelayed);
    });
    socket.on('pokeMessage', function (pokeMessage) {
        console.log(pokeMessage);
    });

    socket.on('lrfUpdateReq', function (requestText) {
        //socket.b1 = firstBearing;
        console.log('Client: ' + requestText);
        fs.readFile('./LRF_latlngupdates.txt', 'utf-8', function (error, content) {
            socket.emit('lrfUpdateRes', content);

        });

    });

    socket.on('gpsUpdateReq', function (requestText) {
        console.log('Client: ' + requestText);
        fs.readFile('./GPS_latlngupdates.txt', 'utf-8', function (error, content) {
            socket.emit('gpsUpdateRes', content);
        });
    });


    socket.on('newUpdateReq', function (requestText) {
        console.log('Client: ' + requestText);
        fs.readFile('./newCoordUpdates.txt', 'utf-8', function (error, content) {
            socket.emit('newUpdateRes', content);
        });
    });
    
    
    socket.on('newUpdates', function (updatesText) {
        //Creating a writable stream



        var writeStream = fs.createWriteStream('newCoordUpdates.txt');
        // Write received data to output file 'newCoordUpdates.txt' with utf-8 encoding

        writeStream.write(updatesText, 'UTF8');

        // Marking end of file
        writeStream.end();

        //Handling stream events : finish and error
        writeStream.on('finish', function () { // when finished writing, the 'writeStream' object emits 'finish event
        console.log('Write operation completed.');
        socket.emit('message', 'coord updates recorded');
        
        });

        writeStream.on('error', function (err) { // if there is an error during the write operation, the 'writeStream' object emits 'err' event
        console.log(err.stack);
        socket.emit('message', err.stack);
        
        });
});

});
