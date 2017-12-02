window.onload = initToggle();

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var google = L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
    attribution: 'google'
});

var solar_ann = L.tileLayer('http://api.solar.padayon.ph/tiles/{z}/{x}/{y}.png', {
    attribution: 'REMap-SOLAR',
    opacity: 0.65,
    tms: true
});

var basemaps = {
    "OSM": osm,
    "Google": google
}

var overlaymaps = {
    "Solar Energy (GHI)": solar_ann,
}

var map = L.map('map', {
    center: [14.56, 120.05],
    zoom: 11,
    minZoom: 8,
    maxZoom: 18,
    zoomControl: false,
    maxBounds: [[14.3, 120.9], [14.9, 121.2]],
    maxBoundsViscosity: 0.5,
    layers: [google, solar_ann]
});

L.control.layers(basemaps, overlaymaps).addTo(map);
L.control.scale({position:'bottomleft', maxWidth:100}).addTo(map);

// GEOCODE SEARCH
var arcgisOnline = L.esri.Geocoding.arcgisOnlineProvider({
    countries: 'PHL'
});

var searchControl = L.esri.Geocoding.geosearch({
    providers: [
        arcgisOnline,
        L.esri.Geocoding.featureLayerProvider({
            url: 'https://services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/gisday/FeatureServer/0/',
            bufferRadius: 5000
        })
    ],
    expanded: false,
    position: 'topright',
    collapseAfterResult: true
}).addTo(map);

var results = L.layerGroup().addTo(map);

searchControl.on('results', function(data){
    results.clearLayers();
});

var zoom_bar = new L.Control.ZoomBar({position: 'topleft'}).addTo(map);

function initToggle(){
    window.toggle = false;
};
