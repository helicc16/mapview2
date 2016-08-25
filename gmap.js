// Creating google map
             var map = null;
        
            function initialize() {
                var mapProp = {
                    center: new google.maps.LatLng(39.049577, -85.529028),
                    zoom: 14,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
        
        
        
        
            }

            google.maps.event.addDomListener(window, 'load', initialize);


            var breadCrumbs = [];

       