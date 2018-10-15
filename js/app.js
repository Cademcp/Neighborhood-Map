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

    // Add onclick event listener to each marker on the map
    this.marker.addListener('click', function() {
        // bounce when clicked
        toggleBounce(this);
        populateInfoWindow(this, largeInfowindow);
    });

    // Show the infowindow when a marker is selected from the list
    this.show = function(marker) {
        google.maps.event.trigger(self.marker, 'click');
    };

    // Filtering the map markers
    self.filter = ko.computed(function() {
        // Checking to see if the marker's visibility has changed
        // Visibility changes when the user is filtering the list
        if (self.visible() === true) {
            // If visible is true, put the marker on the map
            self.marker.setMap(map);
        } else {
            // If visible is false, do not put the marker on the map
            self.marker.setMap(null);
        }
    });

};

let myViewModel = function () {

    let self = this;

    this.searchKey = ko.observable('');

    // Creating observable array of markers. Will be used for displaying list of markers
    self.markerMap = ko.observableArray([]);

    // Add a marker on map for each location
    locations.forEach(function (location) {
        self.markerMap.push(new Marker(location));
    });

    // Filtering list of markers
    this.markerList = ko.computed(function() {

        // Taking in search criteria from textInput data-bind
       let filterKey = self.searchKey().toLowerCase();
       if (filterKey) {
           // using ko arrayFilter function to filter the observable array
           return ko.utils.arrayFilter(self.markerMap(), function(marker) {
               let str = marker.title.toLowerCase();
               // Determining if the search criteria is a substring of any of the marker titles
               let result = str.includes(filterKey);
               // Changes the visibility of the list element based on if the subset is found in the title
               marker.visible(result);
               return result;
           });
       }
       self.markerMap().forEach(function(marker) {
           marker.visible(true);
       });
       return self.markerMap();
    }, self);
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

// function to add animation to marker when they are clicked
// Provided by Google Maps JavaScript API documentation
function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            marker.setAnimation(null);
        }, 100);
    }
}


