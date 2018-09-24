// Points of interest that will be shown to user
var locations = [
    {title: 'Bradley University', location: {lat: 40.697827, lng: -89.615298}},
    {title: 'Sigma Chi Fraternity', location: {lat: 40.695225, lng: -89.615009}},
    {title: 'Chick Fil A', location: {lat: 40.698760, lng: -89.615093}},
    {title: 'Peoria Riverfront Museum', location: {lat: 40.689378, lng: -89.589869}},
    {title: '8 Bit Arcade Bar', location: {lat: 40.685497, lng: -89.595016}},
    {title: 'Peoria Civic Center', location: {lat: 40.692055, lng: -89.593948}}
];

var map;

var markers = [];

var Marker = function (data) {
    this.title = ko.obervable(data.title);
    this.location = ko.obervable(data.location);
};

var ViewModel = function () {
    var self = this;
    
    this.markerList = ko.observableArray([]);
    
    locations.forEach(function () {
        
    })
}

// Function to initialize the map within the map div
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        // initial center is Peoria, Il coordinates
        center: {lat: 40.6936, lng: -89.5890},
        zoom: 14
    });

    // Creating an info window to appear when the marker is clicked
    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    // A loop to put all of the markers into an array and display them
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i + 1
        });
        // Add marker to array
        markers.push(marker);
        // Put onclick in the loop so that each marker has it applied
        marker.addListener('click', function () {
            console.log(this.id);
            populateInfoWindow(this, largeInfowindow);
        });
        bounds.extend(markers[i].position);
    }
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
    // Show list of markers
    // showMarkerList(markers);
}

function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function () {
            infowindow.setMarker = null;
        });
    }
}

function getPlacesDetails(marker, infowindow) {
    var service = new google.maps.places.PlacesService(map);
    service.getDetails({
        placeId: marker.id
    }, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Set the marker property on this infowindow so it isn't created again.
            infowindow.marker = marker;
            var innerHTML = '<div>';
            if (place.name) {
                innerHTML += '<strong>' + place.name + '</strong>';
            }
            if (place.formatted_address) {
                innerHTML += '<br>' + place.formatted_address;
            }
            if (place.formatted_phone_number) {
                innerHTML += '<br>' + place.formatted_phone_number;
            }
            if (place.opening_hours) {
                innerHTML += '<br><br><strong>Hours:</strong><br>' +
                    place.opening_hours.weekday_text[0] + '<br>' +
                    place.opening_hours.weekday_text[1] + '<br>' +
                    place.opening_hours.weekday_text[2] + '<br>' +
                    place.opening_hours.weekday_text[3] + '<br>' +
                    place.opening_hours.weekday_text[4] + '<br>' +
                    place.opening_hours.weekday_text[5] + '<br>' +
                    place.opening_hours.weekday_text[6];
            }
            if (place.photos) {
                innerHTML += '<br><br><img src="' + place.photos[0].getUrl(
                    {maxHeight: 100, maxWidth: 200}) + '">';
            }
            innerHTML += '</div>';
            infowindow.setContent(innerHTML);
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
        }
    });
}

// function showMarkerList(markerList) {
//     console.log(markerList);
//     var largeInfowindow = new google.maps.InfoWindow();
//     for (var i = 0; i < markerList.length; i++) {
//         var node = document.createElement('LI');
//         var textnode = document.createTextNode(markerList[i].title);
//         node.appendChild(textnode);
//         node.addEventListener('click', function () {
//             populateInfoWindow(markerList[i], largeInfowindow);
//             console.log(markerList[i] + " WAS CLICKED");
//         });
//         document.getElementById('marker-name').appendChild(node);
//     }
// }

var myViewModel = function () {

    var self = this;

    self.placeList = ko.observableArray([
        { title: 'Bradley University' },
        { title: 'Sigma Chi Fraternity' },
        { title: 'Chick Fil A' },
        { title: 'Peoria Riverfront Museum' },
        { title: '8 Bit Arcade Bar' },
        { title: 'Peoria Civic Center' }
    ]);

    self.showInfo = function () {
        populateInfoWindow()
    }
};

ko.applyBindings(new myViewModel);
