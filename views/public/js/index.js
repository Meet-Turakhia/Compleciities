// initialize map
const map = L.map("map", { 

    attributionControl: false, 

}).setView([0, 0], 0);
const tileUrl = "images/sketch/{z}/{x}/{y}.png";
const tileLayer = L.tileLayer(tileUrl, {
    minZoom: 0,
    maxZoom: 6,
    continuousWorld: false,
    noWrap: true,
});
L.featureGroup([tileLayer]).addTo(map);
map.setMaxBounds(map.getBounds());
map.doubleClickZoom.disable();


// logo watermark
L.Control.Watermark = L.Control.extend({
    onAdd: function (map) {
        var img = L.DomUtil.create("img");
        img.src = "images/complecities_logo.png";
        img.style.width = "200px";
        img.classList.add("complecities-logo");
        img.alt = "Complecities Logo";
        return img;
    },
    onRemove: function (map) { },
});


L.control.watermark = function (opts) {
    return new L.Control.Watermark(opts);
}


L.control.watermark({ position: "bottomleft" }).addTo(map);


// zoom controls
map.zoomControl.setPosition('topright');


// marker functionalities
function makePopupContent(marker) {
    return `
    <div>

        <h4 class = 'head-font marker-popup'>${marker.properties.title}</h4>
        <p class = 'para-font marker-popup'>${marker.properties.description}</p>
        <div class = "learn-more">
            <a herf = "${marker.properties.link}">Learn More</a>
        </div>

    </div>
    `;
}


function onEachFeature(feature, layer) {
    layer.on('click', flyToMarker);
}


var myIcon = L.icon({
    iconUrl: "images/marker.png",
    iconSize: [30, 35],
});


const markerLayer = L.geoJSON(marker, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: myIcon });
    }
});
markerLayer.addTo(map)


function flyToMarker() {
    const lat = this.feature.geometry.coordinates[1];
    const lng = this.feature.geometry.coordinates[0];
    const zoom = this.feature.geometry.zoom

    map.flyTo([lat, lng], zoom, {
        duration: 2,
    });
    setTimeout(() => {
        L.popup({ closeButton: false, offset: L.point(0, -8) }).setLatLng([lat, lng]).setContent(makePopupContent(this.feature)).openOn(map);
    }, 2000);
}


// get location logic
var setLocationOn = false;
var draggableMarker = L.marker([0, 0], {
    draggable: true,
})


function setLocation() {
    if (setLocationOn == false) {
        setLocationOn = true;
        draggableMarker.addTo(map);
        draggableMarker.on('dragend', function (e) {
            updateLatLng(draggableMarker.getLatLng().lat, draggableMarker.getLatLng().lng);
        });

        function updateLatLng(lat, lng, reverse) {
            if (reverse) {
                marker.setLatLng([lat, lng]);
                map.panTo([lat, lng]);
            } else {
                map.panTo([lat, lng]);
                document.getElementById('latitude').value = draggableMarker.getLatLng().lat;
                document.getElementById('longitude').value = draggableMarker.getLatLng().lng;
            }
        }
    }
    else {
        map.removeLayer(draggableMarker);
        setLocationOn = false;
    }
}


// tooltip activation
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
});