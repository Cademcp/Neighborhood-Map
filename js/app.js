// Points of interest that will be shown to user
let locations = [
    {title: 'Bradley University', location: {lat: 40.697827, lng: -89.615298}},
    {title: 'Sigma Chi Fraternity', location: {lat: 40.695225, lng: -89.615009}},
    {title: 'Chick Fil A', location: {lat: 40.698760, lng: -89.615093}},

    {title: 'Peoria Civic Center', location: {lat: 40.692055, lng: -89.593948}},
    {title: 'Peoria Riverfront Museum', location: {lat: 40.689378, lng: -89.589869}},
    {title: '8 Bit Arcade Bar', location: {lat: 40.685497, lng: -89.595016}}
];

let map;
let largeInfowindow;
let bounds;

// Function to initialize the map within the map div
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        // initial center is Peoria, Il coordinates
        center: {lat: 40.6936, lng: -89.5890},
        zoom: 14,
        mapTypeControl: false
    });

    // Creating an info window to appear when the marker is clicked
    largeInfowindow = new google.maps.InfoWindow();

    let bounds = new google.maps.LatLngBounds();

    ko.applyBindings(new myViewModel());

}

let Marker = function (info) {

    let self = this;
    this.position = info.location;
    this.title = info.title;
    this.map = map;

    this.visible = ko.observable(true);

    this.marker = new google.maps.Marker({
        position: this.position,
        title: this.title,
        animation: google.maps.Animation.DROP,
        map: this.map
    });
    this.marker.addListener('click', function() {
        console.log(this);
        populateInfoWindow(this, largeInfowindow);
    });

}
let myViewModel = function () {

    let self = this;

    self.markerList = ko.observableArray([]);

    locations.forEach(function (location) {
        self.markerList.push(new Marker(location));
    });

    let list = document.getElementById('marker-list');
    for (let i = 0; i < self.markerList().length; i++) {

        let node = document.createElement("button");
        let textnode = document.createTextNode(this.markerList()[i].marker.title);
        console.log(self.markerList()[i].marker);
        let temp = self.markerList()[i].marker;
        node.addEventListener('click', function () {
            populateInfoWindow(temp, largeInfowindow);
        });
        node.appendChild(textnode);
        list.appendChild(node);
    }

};

// function to populate infowindow provided by Udacity Google Maps API videos
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
