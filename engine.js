//Declaring top-level variables:

var socket = io('http://mapview-bootstrapps.rhcloud.com:8000');
var mapClickListener = null;
var updatesString = '';
var zPath = null;
var zStartMarker = null;
var jmPath = null;
var jmStartMarker = null;
var otherPath = null;
var otherStartMarker = null;

$(document).ready(function () {
    socket.on('newZueyCoords', function (updates) {

        console.log(updates);

        // Using server's response to generate a new Gmap point set 
        var newCoordSet = [];

        var obj = JSON.parse(updates);


        for (i = 0; i < obj.newCoords.length; i++) {
            var tempGmapPoint = new google.maps.LatLng(obj.newCoords[i].lat, obj.newCoords[i].lng);

            
            newCoordSet.push(tempGmapPoint);
        }

        console.log(newCoordSet);

        //Erase previous path if exists
        if (zPath != null) {
            zPath.setMap(null);
        }

        if (zStartMarker != null) {
            zStartMarker.setMap(null);
        }
        // Plotting new points on map
        drawPath_LRF_Z(newCoordSet);

    });

    //Upon receiving broadcast updates from JM Group
    socket.on('newJMCoords', function (updates) {

        console.log(updates);

        // Using server's response to generate a new Gmap point set 
        var newCoordSet = [];

        var obj = JSON.parse(updates);


        for (i = 0; i < obj.newCoords.length; i++) {
            var tempGmapPoint = new google.maps.LatLng(obj.newCoords[i].lat, obj.newCoords[i].lng);

            
            newCoordSet.push(tempGmapPoint);
        }

        console.log(newCoordSet);

        //Erase previous path if exists
        if (jmPath != null) {
            jmPath.setMap(null);
        }

        if (jmStartMarker != null) {
            jmStartMarker.setMap(null);
        }
        // Plotting new points on map
        drawPath_LRF_JM(newCoordSet);

    });

    //Upon receiving broadcast updates from JM Group
    socket.on('newOtherCoords', function (updates) {

        console.log(updates);

        // Using server's response to generate a new Gmap point set 
        var newCoordSet = [];

        var obj = JSON.parse(updates);


        for (i = 0; i < obj.newCoords.length; i++) {
            var tempGmapPoint = new google.maps.LatLng(obj.newCoords[i].lat, obj.newCoords[i].lng);

            
            newCoordSet.push(tempGmapPoint);
        }

        console.log(newCoordSet);

        //Erase previous path if exists
        if (otherPath != null) {
            otherPath.setMap(null);
        }

        if (otherStartMarker != null) {
            otherStartMarker.setMap(null);
        }
        // Plotting new points on map
        drawPath_LRF_Other(newCoordSet);

    });






    $('#chatDiv').hide();
    $('#buttonDiv').hide();

    $('#clientMessageForm').hide(); //hide the chat box

    $('#updateBtn').click(function () {
        //hiding this button for now
        $(this).hide();
        mapClickListener = new google.maps.event.addListener(map, 'click', function (event) {
            updatesString = newUpdates_writer(event.latLng, updatesString);
        });
    });

    $('#sendUpdateBtn').click(function () {
        //hiding the button for now
        $(this).hide();
        //disabling map clicks temporarily
        google.maps.event.removeListener(mapClickListener);

        socket.emit('newUpdates', updatesString);

        //resetting updatesString
        updatesString = '';
    });


    socket.on('message', function (message) {
        $('#serverMessage').text(message);
    });

    socket.on('relayMessage', function (message) {
        var aMessage = message + "<br>";
        $('#chatZone').append(aMessage);
    });

    $('#poke').click(function () {
        socket.emit('pokeMessage', 'Watzzup?');
    });

    $('#clientNameForm').submit(function () {
        var clientName = $('#clientName').val();
        socket.emit('newClient', clientName);

        $('#serverMessage').text(clientName + ' , thank you for joining us. You can use the text field below to begin chatting.');
        $('#clientNameForm').hide();
        $('#clientMessageForm').show(); //shows the chat box 
        return false; // blocks 'classic' form sending, without this line 'page not found' error will result
    });

    $('#clientMessageForm').submit(function () {
        var chatMessage = $('#messageFClient').val();
        var yourOwnMessage = '<b>You: </b> ' + chatMessage + '<br>';
        $('#chatZone').append(yourOwnMessage);
        socket.emit('groupChatMessage', chatMessage); //sends message to server
        $('#messageFClient').val('').focus(); //clears out the input form 
        return false; // blocks 'classic' form sending, without this line 'page not found' error will result

    });


    socket.on('newUpdates_m', function (message) {

        socket.emit('newUpdateReq', 'Please send the latest coord set');

    });


    // Sending request for LRF udpates to server when the LRF Updates Button is pressed

    $('#LRFUpdatesBtn').click(function () {
        //socket the req to server
        socket.emit('lrfUpdateReq', 'Please send the latest LRF coords');
        //Hiding the button
        $(this).hide();
    });

    // Once app has received valid response from server, it processes and plots new data
    socket.on('lrfUpdateRes', function (resText) {
        // Using server's response to generate a new Gmap point set 

        var newCoordSet = getPositionUpdates(resText);

        // Plotting new points on map
        drawPath_LRF(newCoordSet);

    });

    // Sending request for GPS updates to server when the GPS Updates Button is pressed

    $('#GPSUpdatesBtn').click(function () {
        //sending req to server via socket
        socket.emit('gpsUpdateReq', 'Please send the latest GPS coords');
        //Hiding the button
        $(this).hide();
    });

    // Once app has received valid response from server, it processes and plots the new data
    socket.on('gpsUpdateRes', function (resText) {

        // Using server's response to generate a new Gmap point set
        var newCoordSet = getPositionUpdates(resText);

        //Plotting new points on map
        drawPath_GPS(newCoordSet);
    });

    // Sending request for new updates to server when the 'Get New Updates' button is pressed

    $('#getNewUpdatesBtn').on('click', function () {
        //sending req to server via socket
        socket.emit('newUpdateReq', 'Please send the latest coord set');
        $(this).hide();
    });


    //Once app has received valid response from server, it processes and plots the data

    socket.on('newUpdateRes', function (resText) {
        // Using server's response to generate a new Gmap point set
        var newCoordSet = getPositionUpdates(resText);

        //Plotting new points on map
        drawPath(newCoordSet);
    })



});

       