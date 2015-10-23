function renderMap(lat, lng) {
    var destination = {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
    };

    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        scrollwheel: false,
        center: destination
    });

    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
    });

    var marker = new google.maps.Marker({
        position: destination,
        map: map,
        title: 'Click to zoom',
        zIndex: 1000,
        icon: '../img/en-pointer_48.png'
    });

    map.addListener('resize', function() {
        map.panTo(marker.getPosition());
    });

    marker.addListener('click', function() {
        if (map.zoom >= 15)
            if (map.zoom >= 19)
                map.setZoom(13);
            else
                map.setZoom(19);
        else
            map.setZoom(15);
        map.setCenter(marker.getPosition());

    });

    marker.addListener('dblclick', function() {
        navigate();
    });

    $(window).resize(function(e) {
        // 3 seconds after the resize, pan back to the marker.
        window.setTimeout(function() {
            var $this = $(this);
            var width = $this.width();
            if ($this.data("last-width") != width) {
                $this.data("last-width", width);
                google.maps.event.trigger(map, 'resize');
            }
        }, 1000);
    });

    $("#navigate").click(function() {
        navigate();
    });

    function navigate() {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var userPos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                // Set destination, origin and travel mode.
                var request = {
                    destination: destination,
                    origin: userPos,
                    travelMode: google.maps.TravelMode.DRIVING
                };

                // Pass the directions request to the directions service.
                directionsService.route(request, function(response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        // Display the route on the map.
                        directionsDisplay.setDirections(response);
                    }
                });
            });
        }
    }
}

function getParByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(function() {
    renderMap(getParByName("lat"), getParByName("lng"));
});
