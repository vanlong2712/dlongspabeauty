function myMap() {
    var denver = new google.maps.LatLng(39.742043, -104.991531);
    var newYork = new google.maps.LatLng(40.730610, -73.935242);
    var washington = new google.maps.LatLng(38.889931, -77.009003);
    var chicago = new google.maps.LatLng(41.881832, -87.623177);

    var mapOptions = {
        center: chicago,
        scrollwheel: false,
        zoom: 5,
        styles:[
            {
                "featureType": "administrative",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 20
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 40
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "saturation": -10
                    },
                    {
                        "lightness": 30
                    }
                ]
            },
            {
                "featureType": "landscape.man_made",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    },
                    {
                        "saturation": -60
                    },
                    {
                        "lightness": 10
                    }
                ]
            },
            {
                "featureType": "landscape.natural",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    },
                    {
                        "saturation": -60
                    },
                    {
                        "lightness": 60
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    },
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 60
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    },
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 60
                    }
                ]
            }
        ]
    };
    var mapOptions2 = {
        center: denver,
        scrollwheel: false,
        zoom: 6
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    var map2 = new google.maps.Map(document.getElementById("map2"), mapOptions2);


    /*---------place path-------*/
    /*var flightPath = new google.maps.Polyline({
         path: [chicago, denver, washington, newYork],
         strokeColor: "#0000FF",
         strokeOpacity: 0.8,
         strokeWeight: 2
     });
     flightPath.setMap(map);*/

    /*-----map marker-----*/
    var marker = new google.maps.Marker({
        position: chicago,
        animation: google.maps.Animation.BOUNCE
    });
    var marker2 = new google.maps.Marker({
        position: washington,
        animation: google.maps.Animation.BOUNCE
    });
    var marker3 = new google.maps.Marker({
        position: denver,
        animation: google.maps.Animation.BOUNCE
    });
    var marker4 = new google.maps.Marker({
        position: newYork,
        animation: google.maps.Animation.BOUNCE
    });
    var marker5 = new google.maps.Marker({
        position: denver,
        animation: google.maps.Animation.BOUNCE
    });

    marker.setMap(map);
    marker2.setMap(map);
    marker3.setMap(map);
    marker4.setMap(map);
    marker5.setMap(map2);


    /*--------open and info window when clicking on marker-------*/
    google.maps.event.addListener(marker, 'click', function () {
        var infowindow = new google.maps.InfoWindow({
            content: "4 Goldfield Rd.<br/>West Chicago, HI 96815"
        });
        infowindow.open(map, marker);
    });

    google.maps.event.addListener(marker2, 'click', function () {
        var infowindow = new google.maps.InfoWindow({
            content: "123 6th St.<br/>Washignton, FL 32904"
        });
        infowindow.open(map, marker2);
    });

    google.maps.event.addListener(marker3, 'click', function () {
        var infowindow = new google.maps.InfoWindow({
            content: "44 Shirley Ave.<br/>Denver, IL 60185"
        });
        infowindow.open(map, marker3);
    });

    google.maps.event.addListener(marker4, 'click', function () {
        var infowindow = new google.maps.InfoWindow({
            content: "70 Bowman St.<br/>New York, CT 06074"
        });
        infowindow.open(map, marker4);
    });

    google.maps.event.addListener(marker5, 'click', function () {
        var infowindow = new google.maps.InfoWindow({
            content: "514 S. Magnolia St.<br/>Denver, FL 32806"
        });
        infowindow.open(map2, marker5);
    });

}
