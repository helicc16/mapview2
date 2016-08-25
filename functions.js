function newUpdates_writer(gmapPoint, newUpdatesText) {
    if (newUpdatesText == ''){
        var newText = '[ \n' + '{"lat": "' + gmapPoint.lat() + '", "lng": "' + gmapPoint.lng() + '"}]';
        return newText;
    }

    
    else{
         var strLength = newUpdatesText.length;
         var originalText = newUpdatesText.replace(']', ',');
         var newText = '\n{"lat": "' + gmapPoint.lat() + '", "lng": "' + gmapPoint.lng() + '"}]';
         return  originalText + newText;
         
    }
    
   

}


function getPositionUpdates(responseText) {
                var obj = JSON.parse(responseText);

                var positions = [];
                for (i = 0; i < obj.length; i++) {
                    var tempGmapPoint = new google.maps.LatLng(obj[i].lat, obj[i].lng);

                    //console.log("tempPoint Lat is " + tempGmapPoint.lat());
                    positions.push(tempGmapPoint);
                }


                return positions;
}
   
function drawPath_LRF_Z(latLngSet) {
                
                
                
                zPath = new google.maps.Polyline({
                    path: latLngSet,
                    strokeColor: "#66d9ff",
                    strokeOpacity: 0.8,
                    strokeWeight: 2
                });

                

                zStartMarker = new google.maps.Marker({
                position: latLngSet[0],
                label: "S"
                });
            
                zStartMarker.setMap(map);
            
          
                
                var currentMarker = new google.maps.Marker({
           
                
                position: latLngSet[latLngSet.length-1],
                icon: {
                path:google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                fillColor: '#66d9ff',
                    fillOpacity: 0.2,
                    scale: 10,
                    strokeColor: '#66d9ff',
                    strokeWeight: 2
                }
            
                });
        
                currentMarker.setMap(map);

                zPath.setMap(map);
            
}   


function drawPath_LRF_JM(latLngSet) {
                
                
                
                jmPath = new google.maps.Polyline({
                    path: latLngSet,
                    strokeColor: "#1aff1a",
                    strokeOpacity: 0.8,
                    strokeWeight: 2
                });

                

                jmStartMarker = new google.maps.Marker({
                position: latLngSet[0],
                label: "S"
                });
            
                jmStartMarker.setMap(map);
            
          
                
                var currentMarker = new google.maps.Marker({
           
                
                position: latLngSet[latLngSet.length-1],
                icon: {
                path:google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                fillColor: '#1aff1a',
                    fillOpacity: 0.2,
                    scale: 10,
                    strokeColor: '#1aff1a',
                    strokeWeight: 2
                }
            
                });
        
                currentMarker.setMap(map);

                jmPath.setMap(map);
            
}      


function drawPath_LRF_Other(latLngSet) {
                
                
                
                otherPath = new google.maps.Polyline({
                    path: latLngSet,
                    strokeColor: "#ff00ff",
                    strokeOpacity: 0.8,
                    strokeWeight: 2
                });

                

                otherStartMarker = new google.maps.Marker({
                position: latLngSet[0],
                label: "S"
                });
            
                otherStartMarker.setMap(map);
            
          
                
                var currentMarker = new google.maps.Marker({
           
                
                position: latLngSet[latLngSet.length-1],
                icon: {
                path:google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                fillColor: '#ff00ff',
                    fillOpacity: 0.2,
                    scale: 10,
                    strokeColor: '#ff00ff',
                    strokeWeight: 2
                }
            
                });
        
                currentMarker.setMap(map);

                otherPath.setMap(map);
            
} 
            
//function to retrace LRF past positions with color blue
function drawPath_LRF(latLngSet) {
                
                
                
                zPath = new google.maps.Polyline({
                    path: latLngSet,
                    strokeColor: "#0000FF",
                    strokeOpacity: 0.8,
                    strokeWeight: 2
                });

                
                zStartMarker = new google.maps.Marker({
                position: latLngSet[0],
                label: "S"
                });
            
                zStartMarker.setMap(map);
                    
                
                var currentMarker = new google.maps.Marker({
           
                
                position: latLngSet[latLngSet.length-1],
                icon: {
                path:google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                fillColor: '#0000FF',
                    fillOpacity: 0.2,
                    scale: 10,
                    strokeColor: '#0000FF',
                    strokeWeight: 2
                }
            
                });
        
                currentMarker.setMap(map);

                zPath.setMap(map);
            
}


//function to draw associated GPS past positions  with orange color
function drawPath_GPS(latLngSet) {
                var myPath = new google.maps.Polyline({
                    path: latLngSet,
                    strokeColor: "#ff3300",
                    strokeOpacity: 0.8,
                    strokeWeight: 2
                });

                     var StartMarker = new google.maps.Marker({
                position: latLngSet[0],
                label: "S"
                });
            
                StartMarker.setMap(map);
            
          
                var StartInfoWindow = new google.maps.InfoWindow({
                content: 'Start Point'
                });
            
                StartInfoWindow.open(map,StartMarker);

                console.log(latLngSet.length);
                var currentMarker = new google.maps.Marker({
                           
                    position: latLngSet[latLngSet.length-1],
                    icon: {
                    path:google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                    fillColor: '#ff3300',
                        fillOpacity: 0.2,
                        scale: 10,
                        strokeColor: '#ff3300',
                        strokeWeight: 2
                    }
            
                });
        
                currentMarker.setMap(map);

                myPath.setMap(map);
}


function drawPath(latLngSet) {
                
                var myPath = new google.maps.Polyline({
                    path: latLngSet,
                    strokeColor: "#ff3300",
                    strokeOpacity: 0.8,
                    strokeWeight: 2
                });

                
                var StartMarker = new google.maps.Marker({
                    position: latLngSet[0],
                    label: "S"
                });
            
                StartMarker.setMap(map);
            
          
                var StartInfoWindow = new google.maps.InfoWindow({
                    content: 'Start Point'
                });
            
                StartInfoWindow.open(map,StartMarker);

                console.log(latLngSet.length);
                var currentMarker = new google.maps.Marker({
                           
                    position: latLngSet[latLngSet.length-1],
                
                    icon: {
                    path:google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                    fillColor: '#ccff66',
                    fillOpacity: 0.2,
                    scale: 10,
                    strokeColor: '#669900',
                    strokeWeight: 2
                    }
            
                    });
        
                currentMarker.setMap(map);

                myPath.setMap(map);
}


       
     