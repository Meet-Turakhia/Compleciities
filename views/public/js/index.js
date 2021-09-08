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
            <a href = "${marker.properties.link}">Learn More</a>
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
        duration: 1.5,
    });
    setTimeout(() => {
        L.popup({ closeButton: false, offset: L.point(0, -8) }).setLatLng([lat, lng]).setContent(makePopupContent(this.feature)).openOn(map);
    }, 1500);
}


// get location logic
var setLocationOn = false;
var draggableMarker = L.marker([0, 0], {
    draggable: true,
})
var setLocationUsed = false;

function setLocation() {
    var latlabel = document.getElementById("latlabel");
    var langlabel = document.getElementById("langlabel");

    if (setLocationOn == false) {
        setLocationOn = true;
        dblClickZoomDisable();
        draggableMarker.addTo(map);
        draggableMarker.on('dragend', function (e) {
            updateLatLng(draggableMarker.getLatLng().lat, draggableMarker.getLatLng().lng);
            setLocationUsed = true;
            latlabel.style.color = "green";
            langlabel.style.color = "green";
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
        dblClickZoomEnable();
    }
}


// tooltip activation
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
});


// toggle marker option forms
function toggleMarkerOptionForms(option) {
    var title = document.getElementById("title");
    var titleLabel = document.getElementById("title-label");
    var selectTitle = document.getElementById("select-title");
    var selectTitleLabel = document.getElementById("select-title-label");
    var zoom = document.getElementById("zoom");
    var description = document.getElementById("description");
    var latlabel = document.getElementById("latlabel");
    var langlabel = document.getElementById("langlabel");
    var markerOptionsModalLabel = document.getElementById("markerOptionsModalLabel");
    var markerOptionsSubmitButton = document.getElementById("marker-options-submit-button");

    if (option == "add") {
        document.getElementById("markerOptionsForm").action = "/";
        markerOptionsModalLabel.innerHTML = "Add a Marker";
        zoom.value = "";
        title.value = "";
        selectTitle.value = "";
        description.value = "";
        selectTitleLabel.hidden = true;
        selectTitle.hidden = true;
        selectTitle.disabled = true;
        titleLabel.hidden = false;
        title.hidden = false;
        title.disabled = false;
        zoom.value = null;
        description.value = null;
        latlabel.style.color = "black";
        langlabel.style.color = "black";
        markerOptionsSubmitButton.innerHTML = "Add";
        removeConfirmMarkerDelete();
    }
    if (option == "edit") {
        document.getElementById("markerOptionsForm").action = "/edit-marker";
        markerOptionsModalLabel.innerHTML = "Edit a Marker";
        zoom.value = "";
        title.value = "";
        selectTitle.value = "";
        description.value = "";
        titleLabel.hidden = true;
        title.hidden = true;
        title.disabled = true;
        selectTitleLabel.hidden = false;
        selectTitle.hidden = false;
        selectTitle.disabled = false;
        zoom.value = null;
        description.value = null;
        markerOptionsSubmitButton.innerHTML = "Edit";
        if (setLocationUsed == true) {
            latlabel.style.color = "green";
            langlabel.style.color = "green";
        }
        setSelectTitleData();
        removeConfirmMarkerDelete();
    }
    if (option == "delete") {
        document.getElementById("markerOptionsForm").action = "/delete-marker";
        markerOptionsModalLabel.innerHTML = "Delete a Marker";
        zoom.value = "";
        title.value = "";
        selectTitle.value = "";
        description.value = "";
        titleLabel.hidden = true;
        title.hidden = true;
        title.disabled = true;
        selectTitleLabel.hidden = false;
        selectTitle.hidden = false;
        selectTitle.disabled = false;
        zoom.value = null;
        description.value = null;
        markerOptionsSubmitButton.innerHTML = "Delete";
        if (setLocationUsed == true) {
            latlabel.style.color = "black";
            langlabel.style.color = "black";
        }
        setSelectTitleData();
        addConfirmMarkerDelete();
    }
}


function setSelectTitleData() {
    var datalist = document.getElementById("select-title-datalist");
    datalist.innerHTML = "";
    var markerData = document.getElementById("markerData").value;
    markerData = JSON.parse(markerData);
    markerData.forEach(marker => {
        var option = document.createElement("option");
        option.value = marker.title;
        datalist.appendChild(option);
    });
}


// set marker options form data
function setMarkerOptionsFormData() {
    var markerData = document.getElementById("markerData").value;
    markerData = JSON.parse(markerData);
    var selectedTitle = document.getElementById("select-title").value;
    var zoom = document.getElementById("zoom");
    var description = document.getElementById("description");
    var latitude = document.getElementById("latitude");
    var longitude = document.getElementById("longitude");
    var markerId = document.getElementById("marker-id");
    markerData.forEach(marker => {
        if (marker.title == selectedTitle) {
            zoom.value = marker.zoom_level;
            description.value = marker.description;
            markerId.value = marker._id;
            if (setLocationUsed == false) {
                latitude.value = marker.latitude;
                longitude.value = marker.longitude;
            }
        }
    });
}


// marker options and marker brief desired settings
function markerOptionsModalOptions() {
    document.getElementById("add").click();
    mapScrollDragDisable();
}


function markerBriefModalOptions() {
    mapScrollDragDisable();
}


// confirm marker delete function
function confirmMarkerDelete() {
    var selectedTitle = document.getElementById("select-title").value;
    if (selectedTitle != "") {
        return confirm("Are you sure you want to delete '" + selectedTitle + "' marker, deleting this marker will also delete its brief, Do you want to proceed?");
    }
}


function addConfirmMarkerDelete() {
    var markerOptionsSubmitButton = document.getElementById("marker-options-submit-button");
    markerOptionsSubmitButton.onclick = confirmMarkerDelete;
}


function removeConfirmMarkerDelete() {
    var markerOptionsSubmitButton = document.getElementById("marker-options-submit-button");
    markerOptionsSubmitButton.onclick = null;
}


// initializing ckeditor
ClassicEditor
    .create(document.querySelector('#ckeditor'))
    .then(editor => {
        // console.log(editor);
    })
    .catch(error => {
        console.error(error);
    });


// map dragging enable disable functions 
function mapScrollDragEnable() {
    map.scrollWheelZoom.enable();
    map.dragging.enable();
}


function mapScrollDragDisable() {
    map.scrollWheelZoom.disable();
    map.dragging.disable();
}


// map double click zoom enable disable functions 
function dblClickZoomEnable() {
    map.doubleClickZoom.enable();
}


function dblClickZoomDisable() {
    map.doubleClickZoom.disable();
}


