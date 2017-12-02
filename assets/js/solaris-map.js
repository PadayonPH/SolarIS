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

var drawn_feature = L.featureGroup()

var basemaps = {
    "OSM": osm,
    "Google": google
}

var overlaymaps = {
    "Solar Energy (GHI)": solar_ann,
    "Drawn Feature": drawn_feature
}

var map = L.map('map', {
    center: [14.56, 120.05],
    zoom: 11,
    minZoom: 8,
    maxZoom: 18,
    zoomControl: true,
    maxBounds: [[14.3, 120.9], [14.9, 121.2]],
    maxBoundsViscosity: 0.5,
    layers: [google, solar_ann, drawn_feature]
});

L.control.layers(basemaps, overlaymaps, {collapsed: false}).addTo(map);
L.control.scale({position:'bottomright', maxWidth:100}).addTo(map);

// SIDEBAR
// var sidebar = L.control.sidebar('sidebar').addTo(map);

// EASYBUTTON ZOOM TO EXTENT
L.easyButton({
    states: [{
        icon: 'fa-globe',
        onClick: function(){
            map.setView([14.56, 120.05], 11);},
        title: 'Zoom to Extent'
    }]
}).addTo(map);

// ZOOM BAR
var options = {
    modal: true,
    title: "Zoom to Bounding Box"
};
var zoom_box = L.control.zoomBox(options);
map.addControl(zoom_box);

// DRAW
var draw_control = new L.Control.Draw({
    edit: {
        featureGroup: drawn_feature,
        allowIntersection: false,
    },
    draw: {
        polygon: {
            allowIntersection: false,
            showArea: true
        },
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
    }
});

map.addControl(draw_control);

// map.on(L.Draw.Event.CREATED, function (event) {
//     var layer = event.layer;
//
//     drawn_feature.addLayer(layer);
// });

map.on(L.Draw.Event.CREATED, function (event) {
    var layer = event.layer;

    console.log(JSON.stringify(layer.toGeoJSON()));

    drawn_feature.addLayer(layer);
});

// EASYBUTTON CALCULATE
L.easyButton({
    states: [{
        icon: 'fa-sun-o',
        onClick: function (){
            // map.setView([14.56, 120.05], 11)
            var drawn_features = drawn_feature.getLayers();
            if(drawn_features.length == 1) {
                var coords = drawn_features[0].toGeoJSON()['geometry']['coordinates'][0];
                // console.log(JSON.stringify(drawn_features[0].toGeoJSON()));
                console.log(JSON.stringify(coords));
            }
            ;},
        title: 'GoSOLAR'
    }]
}).addTo(map);

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

function initToggle(){
    window.toggle = false;
};
