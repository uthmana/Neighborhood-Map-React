import React, {Component} from 'react';
import LocationList from './LocationList';

class App extends Component {
    /**
     * Constructor
     */
    constructor(props) {
        super(props);
        this.state = {
            'alllocations': [
                {
                    'name': "Turkish Restaurant",
                    'type': "Restaurant",
                    'latitude': 37.76425077984924,
                    'longitude': 30.5556434629882,
                    'streetAddress': "Kutlubey Mahallesi, 1031. Sk. No:2, 32100"
                },
                {
                    'name': "Iyaşpark Hotel",
                    'type': "Hotel",
                    'latitude': 37.76341958378422,
                    'longitude': 30.555107021185222,
                    'streetAddress': "Çelebiler Mahallesi, Hastane Cd. No:1, 32040"
                },
                {
                    'name': "Kebapçi Kadir",
                    'type': "Restaurant",
                    'latitude': 37.76346199197288,
                    'longitude': 30.55612626061088,
                    'streetAddress': "Hasan Fehmi Cd. No:5, 32100"
                },
                {
                    'name': "McDonald's",
                    'type': "Restaurant",
                    'latitude': 37.763999513656586,
                    'longitude': 30.55397378787643,
                    'streetAddress': "1754. Sk. No:8, 32100"
                },
                {
                    'name': "Halkbank",
                    'type': "Bank",
                    'latitude': 37.76402283798048,
                    'longitude': 30.551954618380933,
                    'streetAddress': " Cumhuriyet Cd. No:21, 32100"
                },
                {
                    'name': "Artan Hotel",
                    'type': "3-Star Hotel",
                    'latitude': 37.765427849878,
                    'longitude': 30.55570468185988,
                    'streetAddress': "Cengiz Topel Cd. No:12, 32100"
                },
                {
                    'name': "Atatürk Stadyumu",
                    'type': "Stadium",
                    'latitude': 37.7682120852969,
                    'longitude': 30.56105669467297,
                    'streetAddress': "Kepeci Mahallesi, 1201. Sk. No:9, 32300"
                },
                {
                    'name': "Özel Isparta Hastanesi",
                    'type': "Hospital",
                    'latitude': 37.77321151916819,
                    'longitude': 30.551349780248074,
                    'streetAddress': "Sanayi Mahallesi, Altın Sk. No:5, 32200"
                },
                {
                    'name': "Isparta Alışveriş Merkez",
                    'type': "Mall",
                    'latitude': 37.77139666622503,
                    'longitude': 30.550856253789334,
                    'streetAddress': "Bahçelievler Mahallesi, Süleyman Demirel Cd. No:7, 32200"
                },
                {
                    'name': "AnadoluMeslek Lisesi",
                    'type': "Technical School",
                    'latitude': 37.76814476660999,
                    'longitude': 30.554667337523256,
                    'streetAddress': "İstiklal Mahallesi, Hacı İbrahim Parlar Cd. No:48, 32300"
                }
            ],
            'map': '',
            'infowindow': '',
            'prevmarker': ''
        };

        // retain object instance when used in the function
        this.initMap = this.initMap.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
    }

    componentDidMount() {
        // Connect the initMap() function within this class to the global window context,
        // so Google Maps can invoke it
        window.initMap = this.initMap;
        // Asynchronously load the Google Maps script, passing in the callback reference
        loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyCPi0o_tjNjKYYDe_6nYg82r0leI7kKlOE&callback=initMap')
    }

    /**
     * Initialise the map once the google map script is loaded
     */
    initMap() {
        var self = this;

        var mapview = document.getElementById('map');
        mapview.style.height = window.innerHeight + "px";
        var map = new window.google.maps.Map(mapview, {
            center: {lat: 37.76785004785777, lng: 30.559777280972753},
            zoom: 15,
            mapTypeControl: false
        });

        var InfoWindow = new window.google.maps.InfoWindow({});

        window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
            self.closeInfoWindow();
        });

        this.setState({
            'map': map,
            'infowindow': InfoWindow
        });

        window.google.maps.event.addDomListener(window, "resize", function () {
            var center = map.getCenter();
            window.google.maps.event.trigger(map, "resize");
            self.state.map.setCenter(center);
        });

        window.google.maps.event.addListener(map, 'click', function () {
            self.closeInfoWindow();
        });

        var alllocations = [];
        this.state.alllocations.forEach(function (location) {
            var longname = location.name + ' - ' + location.type;
            var marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(location.latitude, location.longitude),
                animation: window.google.maps.Animation.DROP,
                map: map
            });

            marker.addListener('click', function () {
                self.openInfoWindow(marker);
            });

            location.longname = longname;
            location.marker = marker;
            location.display = true;
            alllocations.push(location);
        });
        this.setState({
            'alllocations': alllocations
        });
    }

    /**
     * Open the infowindow for the marker
     * @param {object} location marker
     */
    openInfoWindow(marker) {
        this.closeInfoWindow();
        this.state.infowindow.open(this.state.map, marker);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({
            'prevmarker': marker
        });
        this.state.infowindow.setContent('Loading Data...');
        this.state.map.setCenter(marker.getPosition());
        this.state.map.panBy(0, -200);
        this.getMarkerInfo(marker);
    }

    /**
     * Retrive the location data from the foursquare api for the marker and display it in the infowindow
     * @param {object} location marker
     */
    getMarkerInfo(marker) {
        var self = this;
        var clientId = "TPIDDHBKB2QFBWEV2MPDOFGUSWXCXGAA5IVOWEMN5ASR3UJW";
        var clientSecret = "4HB1ZZJBVXC3F0BREBPSGXYK0VZ5ALS4XRNJZSBP1JROG0DE";
        var url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
        fetch(url)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        self.state.infowindow.setContent("Sorry data can't be loaded");
                        return;
                    }

                    // Examine the text in the response
                    response.json().then(function (data) {
                        var location_data = data.response.venues[0];
                        var verified = '<b>Verified Location: </b>' + (location_data.verified ? 'Yes' : 'No') + '<br>';
                        var checkinsCount = '<b>Number of CheckIn: </b>' + location_data.stats.checkinsCount + '<br>';
                        var usersCount = '<b>Number of Users: </b>' + location_data.stats.usersCount + '<br>';
                        var tipCount = '<b>Number of Tips: </b>' + location_data.stats.tipCount + '<br>';
                        var readMore = '<a href="https://foursquare.com/v/'+ location_data.id +'" target="_blank">Read More on Foursquare Website</a>'
                        self.state.infowindow.setContent(checkinsCount + usersCount + tipCount + verified + readMore);
                    });
                }
            )
            .catch(function (err) {
                self.state.infowindow.setContent("Sorry data can't be loaded");
            });
    }

    /**
     * Close the infowindow for the marker
     * @param {object} location marker
     */
    closeInfoWindow() {
        if (this.state.prevmarker) {
            this.state.prevmarker.setAnimation(null);
        }
        this.setState({
            'prevmarker': ''
        });
        this.state.infowindow.close();
    }

    /**
     * Render function of App
     */
    render() {
        return (
            <div>
                <LocationList key="100" alllocations={this.state.alllocations} openInfoWindow={this.openInfoWindow}
                              closeInfoWindow={this.closeInfoWindow}/>
                <div id="map"></div>
            </div>
        );
    }
}

export default App;

/**
 * Load the google maps Asynchronously
 * @param {url} url of the google maps script
 */
function loadMapJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = function () {
        document.write("Google Maps can't be loaded");
    };
    ref.parentNode.insertBefore(script, ref);
}
