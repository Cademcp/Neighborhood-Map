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

// Function to initialize the map within the map div
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        // initial center is Peoria, Il coordinates
        center: {lat: 40.6936, lng: -89.5890},
        zoom: 14
    });

    // Created a single marker to display on the map in the location selected from
    // locations array
    var marker = new google.maps.Marker({
        position: locations[0]['location'],
        map: map,
        title: locations[0]['title']
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
            id: i
        });
        // Add marker to array
        markers.push(marker);
        // Put onclick in the loop so that each marker has it applied
        marker.addListener('click', function () {
            populateInfoWindow(this, largeInfowindow);
        });
        bounds.extend(markers[i].position);
    }
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
    showMarkerList(markers);
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

// Event listener to show the InfoWindow when the marker is clicked
// marker.addListener('click', function () {
//     populateInfoWindow(this, largeInfowindow);
// });

function showMarkerList(markerList) {
    for (var i = 0; i < markerList.length; i++) {
        var node = document.createElement('LI');
        var textnode = document.createTextNode(markerList[i].title);
        node.appendChild(textnode);
        document.getElementById('marker-name').appendChild(node);
    }
}


