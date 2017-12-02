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
    expanded: true,
    position: 'topright',
    collapseAfterResult: false
}).addTo(map);

var results = L.layerGroup().addTo(map);

searchControl.on('results', function(data){
    results.clearLayers();
});


// SIDEBAR
// var sidebar = L.control.sidebar('sidebar').addTo(map);

// EASYBUTTON ZOOM TO EXTENT
L.easyButton({
    states: [{
        icon: 'fa-globe fa-lg',
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
            showArea: true,
             shapeOptions: {
                    clickable: false,
                    color:"#00ACC1",
                    weight:1,
                    opacity: 1,
                    fillColor:"#00ACC1",
                    fillOpacity:0.4,
                    dashArray:"3,3"
                }
        },
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
    }
});

map.addControl(draw_control);

var getPopupContent = function (layer) {
    var latlngs = layer._defaultShape ? layer._defaultShape() : layer.getLatLngs();
    var area = L.GeometryUtil.geodesicArea(latlngs);
    return "Area: "+L.GeometryUtil.readableArea(area, true);
};

map.on(L.Draw.Event.CREATED, function (event) {
    var layer = event.layer;
    console.log(JSON.stringify(layer.toGeoJSON()));

    var content = getPopupContent(layer);
    if (content != null) {
        layer.bindPopup(content);
    }

    drawn_feature.addLayer(layer);
});

map.on(L.Draw.Event.EDITED, function(event) {
    var layers = event.layers,
        content = null;
    layers.eachLayer(function(layer) {
        content = getPopupContent(layer);
        if (content !== null) {
            layer.setPopupContent(content);
        }
    });
});


// EASYBUTTON CALCULATE
L.easyButton({
    states: [{
        icon: 'fa-sun-o fa-lg',
        onClick: function (){
            // map.setView([14.56, 120.05], 11)
            var drawn_features = drawn_feature.getLayers();
            if(drawn_features.length == 1) {
                console.log(drawn_features[0].toGeoJSON())
                var geojson_tmpl = {};
                geojson_tmpl['type'] = "FeatureCollection";
                geojson_tmpl['features'] = [];
                var coords = drawn_features[0].toGeoJSON()['geometry']['coordinates'][0];
                geojson_tmpl['features'].push(drawn_features[0].toGeoJSON());
                // console.log(geojson_tmpl);
                var get_data = {"house_footprint": JSON.stringify(geojson_tmpl)}
                $.ajax({
                    url: "http://api.solar.padayon.ph/compute/",
                    // url: "http://127.0.0.1:8888/compute/",
                    data: get_data,
                    cache: false,
                    type: "GET",
                    success: function(response) {
                        console.log(response);
                        $('#powerModal').modal();
                        $('#annualPower').text((response['power_value']/1000).toFixed(3));
                        $('#area').text(response['area'].toFixed(2));
                    },
                    error: function(xhr) {

                    }
                });
            }
            ;},
        title: 'GoSOLAR'
    }]
}).addTo(map);

function initToggle(){
    window.toggle = false;
};


// 'name container'
name_container = L.control();

name_container.onAdd = function(map) {
    var container = L.DomUtil.create('div', 'name_container');
    container.id="name_container";

    container.innerHTML = '<div class="panel panel-default"><div class="panel-body"><h4>GoSolar</h4></div></div>';

    L.DomEvent.on(container, 'mouseover', function (ev) {
       map.dragging.disable();
    });

    L.DomEvent.on(container, 'mouseout', function (ev) {
        map.dragging.enable();
    });

    return container;
    
};

name_container.setPosition('bottomleft');
name_container.addTo(map);
