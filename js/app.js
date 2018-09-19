
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

// Function to initialize the map within the map div
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.6936, lng: -89.5890},
        zoom: 14
    });
    // Create a single latLng literal object.
    var singleLatLng = {lat: 40.698760, lng: -89.615093};
    // TODO: Create a single marker appearing on initialize -
    // Create it with the position of the singleLatLng,
    // on the map, and give it your own title!
    var marker = new google.maps.Marker({
        position: locations[0]['location'],
        map: map,
        title: locations[0]['title']
    });
    // TODO: create a single infowindow, with your own content.
    // It must appear on the marker
    var largeInfowindow = new google.maps.InfoWindow();

    function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div>' + marker.title + '</div>');
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick',function(){
                infowindow.setMarker = null;
            });
        }
    }

    // TODO: create an EVENT LISTENER so that the infowindow opens when
    // the marker is clicked!
    marker.addListener('click', function () {
        populateInfoWindow(this, largeInfowindow);
    });
}


