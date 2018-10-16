// Points of interest that will be shown to user
let locations = [
    {title: 'Bradley University', location: {lat: 40.697827, lng: -89.615298}},
    {title: 'Sigma Chi Fraternity', location: {lat: 40.695225, lng: -89.615009}},
    {title: 'Chick Fil A', location: {lat: 40.698760, lng: -89.615093}},
    {title: 'Peoria Civic Center', location: {lat: 40.692055, lng: -89.593948}},
    {title: 'Peoria Riverfront Museum', location: {lat: 40.689378, lng: -89.589869}},
    {title: 'One World', location: {lat: 40.7002132, lng: -89.6132427}}
];

let map;
let largeInfowindow;

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

    ko.applyBindings(new myViewModel());

}

let Marker = function (info) {

    let self = this;
    // pulling location and title from info
    this.position = info.location;
    this.title = info.title;
    this.map = map;

    // creating visible observable. Will be used for filtering
    this.visible = ko.observable(true);

    // creating new google maps Marker object
    this.marker = new google.maps.Marker({
        position: this.position,
        title: this.title,
        animation: google.maps.Animation.DROP,
        map: this.map
    });

    // client id and secret for foursquare
    let clientID = 'R4BRRTRVV4HJWS1IA0RPRQFSEGKWYHGDV554WA52C15IDZC1';
    let clientSecret = '2CO1SV0COTDB51LQQLL4LWQOGRIIQLV3BN4M1ATXZNFV1AJ4';

    // request to get venue information from foursquare based on location lat and lng, with a query of the location name
    let venueRequest = 'https://api.foursquare.com/v2/venues/search?ll=' + this.position.lat + ',' + this.position.lng +
        '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20181015' + '&query=' + this.title;
    let venueID = '';
    var getVenues;

    // using jQuery to get the json that the request returned. Pulling out the address, city, and country for each
    // location and saving it as an attribute on the marker
    $.getJSON(venueRequest, function (data) {
        getVenues = data;

        // pulling out data to make accessing JSON easier
        let venues = getVenues['response']['venues'][0];

        // setting marker's address, city, state, zip, and country information
        self.address = venues['location']['formattedAddress'][0];
        self.cityStateZip = venues['location']['formattedAddress'][1];
        self.country = venues['location']['formattedAddress'][2];

        // pull out venue id for next api call
        venueID = getVenues['response']['venues'][0]['id'];

        // creating GET request for venue images based on venue id
        let pictureRequest = 'https://api.foursquare.com/v2/venues/' + venueID + '/photos?client_id=' + clientID +
            '&client_secret=' + clientSecret + '&v=20181015';

        // using jQuery to get json returned from venue image request. Will catch error of image not existing.
        $.getJSON(pictureRequest, function (data) {

            // building image url
            let pictureUrlPrefix = data['response']['photos']['items'][0]['prefix'];

            let pictureUrlSuffix = data['response']['photos']['items'][0]['suffix'];

            // saving image uri with size of 200x200
            self.venueImage = pictureUrlPrefix + '200' + 'x' + '200' + pictureUrlSuffix;

        }).fail(function () {
            // checks to see if this error message already exists, if it does then don't display it.
            // produces an error message for the user saying that foursquare images will not be loaded.
            if (!document.getElementById('image-error')) {
                let tag = document.createElement("p");
                tag.setAttribute('id', 'image-error');
                tag.style.color = 'red';
                let node = document.createTextNode("Foursquare could not load images at this time. (Most likely due to " +
                    "premium daily request limit of 50)");
                tag.appendChild(node);
                let header = document.getElementById('header');
                header.appendChild(tag);
            } else {
                return;
            }

        });

    }).fail(function () {
        // checks to see if this error message already exists, if it does then don't display it.
        // produces an error message for the user saying that foursquare venue information will not be loaded.
        if (!document.getElementById('venue-error')) {
            let tag = document.createElement("p");
            tag.setAttribute('id', 'venue-error');
            tag.style.color = 'red';
            let node = document.createTextNode("Foursquare could not load venue information at this time.");
            tag.appendChild(node);
            let header = document.getElementById('header');
            header.appendChild(tag);
        } else {
            return;
        }
    });


    // Add onclick event listener to each marker on the map
    this.marker.addListener('click', function() {
        // bounce when clicked
        toggleBounce(this);
        // passing in marker, as well as the marker's address, city, image, and country form foursquare
        populateInfoWindow(this, self.address, self.cityStateZip, self.country, self.venueImage, largeInfowindow);
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
function populateInfoWindow(marker, address, city, country, image, infowindow) {

    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;

        // checking to see if the image was pulled from foursquare
        // this is a premium feature of the foursquare API so there is a 50 request limit per day
        // if the image is not there, then don't show it
        if (image === undefined) {
            infowindow.setContent('<div>' + '<br><strong>' + marker.title + '</strong><br><br>' + address + '<br>' +
                city + '<br>' + country + '</div>');
        } else {
            infowindow.setContent('<div>' + '<br><strong>' + marker.title + '</strong><br><br>' + address + '<br>' +
                city + '<br>' + country + '<br>' + '<img src=\"' + image + '\">' + '</div>');
        }
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
