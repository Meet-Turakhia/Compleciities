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
});
var setLocationUsed = false;
var globalLatitude;
var globalLongitude;

function setLocation() {

    if (setLocationOn == false) {
        setLocationOn = true;
        dblClickZoomDisable();
        draggableMarker.addTo(map);
        draggableMarker.on('dragend', function (e) {
            updateLatLng(draggableMarker.getLatLng().lat, draggableMarker.getLatLng().lng);
            setLocationUsed = true;
        });

        function updateLatLng(lat, lng, reverse) {
            if (reverse) {
                marker.setLatLng([lat, lng]);
                map.panTo([lat, lng]);
            } else {
                map.panTo([lat, lng]);
                globalLatitude = draggableMarker.getLatLng().lat;
                globalLongitude = draggableMarker.getLatLng().lng;
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
    var latlabel = document.getElementById("latlabel");
    var langlabel = document.getElementById("langlabel");
    var latitude = document.getElementById("latitude");
    var longitude = document.getElementById("longitude");
    var zoom = document.getElementById("zoom");
    var description = document.getElementById("description");
    var markerOptionsModalLabel = document.getElementById("markerOptionsModalLabel");
    var markerOptionsSubmitButton = document.getElementById("marker-options-submit-button");
    var togglePasteSetLocationWrapper = document.getElementById("paste-set-location-wrapper");

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
        zoom.readOnly = false;
        togglePasteSetLocationWrapper.hidden = false;
        description.readOnly = false;
        latitude.value = null;
        longitude.value = null;
        zoom.value = null;
        $("#paste-set-location").prop('checked', false);
        latlabel.style.color = "black";
        langlabel.style.color = "black";
        description.value = null;
        markerOptionsSubmitButton.innerHTML = "Add";
        removeConfirmValidateMarkerDelete();
        removeValidateMarkerEdit();
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
        zoom.readOnly = false;
        togglePasteSetLocationWrapper.hidden = false;
        description.readOnly = false;
        latitude.value = null;
        longitude.value = null;
        zoom.value = null;
        $("#paste-set-location").prop('checked', false);
        latlabel.style.color = "black";
        langlabel.style.color = "black";
        description.value = null;
        markerOptionsSubmitButton.innerHTML = "Edit";
        setSelectTitleData();
        removeConfirmValidateMarkerDelete();
        addValidateMarkerEdit();
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
        zoom.readOnly = true;
        togglePasteSetLocationWrapper.hidden = true;
        description.readOnly = true;
        latitude.value = null;
        longitude.value = null;
        zoom.value = null;
        $("#paste-set-location").prop('checked', false);
        latlabel.style.color = "black";
        langlabel.style.color = "black";
        description.value = null;
        markerOptionsSubmitButton.innerHTML = "Delete";
        setSelectTitleData();
        removeValidateMarkerEdit();
        addConfirmValidateMarkerDelete();
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
    var latlabel = document.getElementById("latlabel");
    var langlabel = document.getElementById("langlabel");

    $("#paste-set-location").prop('checked', false);
    latlabel.style.color = "black";
    langlabel.style.color = "black";

    markerData.forEach(marker => {
        if (marker.title == selectedTitle) {
            zoom.value = marker.zoom_level;
            description.value = marker.description;
            markerId.value = marker._id;
            latitude.value = marker.latitude;
            longitude.value = marker.longitude;
        }
    });
}


// paste set location function
var previousLatitude;
var previousLongitude;

$("#paste-set-location").change(function () {
    var latlabel = document.getElementById("latlabel");
    var langlabel = document.getElementById("langlabel");

    if (this.checked) {
        previousLatitude = document.getElementById('latitude').value;
        previousLongitude = document.getElementById('longitude').value;
        document.getElementById('latitude').value = globalLatitude;
        document.getElementById('longitude').value = globalLongitude;
        if (setLocationUsed == true) {
            latlabel.style.color = "green";
            langlabel.style.color = "green";
        }
    } else {
        document.getElementById('latitude').value = previousLatitude;
        document.getElementById('longitude').value = previousLongitude;
        latlabel.style.color = "black";
        langlabel.style.color = "black";
    }
});


// marker options and marker brief desired settings
function markerOptionsModalOptions() {
    document.getElementById("add").click();
    mapScrollDragDisable();
}


function markerBriefModalOptions() {
    document.getElementById("brief-add").click();
    mapScrollDragDisable();
}


// confirm and validate marker delete function
function confirmValidateMarkerDelete() {
    var markerId = document.getElementById("marker-id");
    if (markerId.value == "") {
        alert("Select a valid marker to delete (choose a marker title from the suggested list rather than entering the marker title manually!)");
        return false;
    } else {
        var selectedTitle = document.getElementById("select-title").value;
        if (selectedTitle != "") {
            return confirm("Are you sure you want to delete '" + selectedTitle + "' marker, deleting this marker will also delete its brief, Do you want to proceed?");
        } else {
            return confirm("Are you sure you want to delete this marker, deleting this marker will also delete its brief, Do you want to proceed?");
        }
    }
}


function addConfirmValidateMarkerDelete() {
    var markerOptionsSubmitButton = document.getElementById("marker-options-submit-button");
    markerOptionsSubmitButton.onclick = confirmValidateMarkerDelete;
}


function removeConfirmValidateMarkerDelete() {
    var markerOptionsSubmitButton = document.getElementById("marker-options-submit-button");
    markerOptionsSubmitButton.onclick = null;
}


// validate marker edit function
function validateMarkerEdit() {
    var markerId = document.getElementById("marker-id");
    if (markerId.value == "") {
        alert("Select a valid marker to edit (choose a marker title from the suggested list rather than entering the marker title manually!)");
        return false;
    }
}


function addValidateMarkerEdit() {
    var markerOptionsSubmitButton = document.getElementById("marker-options-submit-button");
    markerOptionsSubmitButton.onclick = validateMarkerEdit;
}


function removeValidateMarkerEdit() {
    var markerOptionsSubmitButton = document.getElementById("marker-options-submit-button");
    markerOptionsSubmitButton.onclick = null;
}


// initializing ckeditor
let ckeditor;
ClassicEditor
    .create(document.querySelector('#ckeditor'))
    .then(editor => {
        // console.log(editor);
        window.editor = editor;
        ckeditor = editor;
    })
    .catch(error => {
        console.error(error);
    });


// map dragging enable disable functions 
function mapScrollDragEnable() {
    map.scrollWheelZoom.enable();
    map.dragging.enable();
    dblClickZoomEnable();
}


function mapScrollDragDisable() {
    map.scrollWheelZoom.disable();
    map.dragging.disable();
    dblClickZoomDisable();
}


// map double click zoom enable disable functions 
function dblClickZoomEnable() {
    map.doubleClickZoom.enable();
}


function dblClickZoomDisable() {
    map.doubleClickZoom.disable();
}



// set select marker function
function setSelectMarkerTitle(briefFormOption) {
    var selectMarker = document.getElementById("select-marker-title");
    var markerData = document.getElementById("markerData").value;
    var briefData = document.getElementById("briefData").value;
    var length = selectMarker.options.length;
    for (i = length - 1; i > 0; i--) {
        selectMarker.options[i] = null;
    }
    markerData = JSON.parse(markerData);
    briefData = JSON.parse(briefData);
    var briefDataMarkerIds = briefData.map(b => b.marker_id);
    markerData.forEach(marker => {
        if (briefFormOption == "add") {
            if (!briefDataMarkerIds.includes(marker._id)) {
                var option = document.createElement("option");
                option.text = marker.title;
                option.value = marker.title;
                selectMarker.appendChild(option);
            }
        } else {
            if (briefDataMarkerIds.includes(marker._id)) {
                var option = document.createElement("option");
                option.text = marker.title;
                option.value = marker.title;
                selectMarker.appendChild(option);
            }
        }
    });
}


// set selected marker's id  function
function setSelectMarkerTitleId() {
    var selectedMarkerId = document.getElementById("selected-marker-id");
    var selectMarkerValue = document.getElementById("select-marker-title").value;
    var titleBrief = document.getElementById("title-brief");
    var titleLabelBrief = document.getElementById("title-label-brief");
    var markerData = document.getElementById("markerData").value;
    markerData = JSON.parse(markerData);

    $("#copy-marker-title").prop('checked', false);
    titleBrief.value = null;
    titleLabelBrief.style.color = "black";

    markerData.forEach(marker => {
        if (marker.title == selectMarkerValue) {
            selectedMarkerId.value = marker._id;
        }
    });
    setMarkerBriefFormData(selectedMarkerId);
}


// set brief title same as marker title function
var previousTitleBrief;

$("#copy-marker-title").change(function () {
    var selectMarkerValue = document.getElementById("select-marker-title").value;
    var titleBrief = document.getElementById("title-brief");
    var titleLabelBrief = document.getElementById("title-label-brief");

    if (this.checked) {
        if (selectMarkerValue != "Select Marker") {
            previousTitleBrief = titleBrief.value;
            titleBrief.value = selectMarkerValue;
            titleLabelBrief.style.color = "green";
        }
    } else {
        if (previousTitleBrief == undefined) {
            previousTitleBrief = "";
        }
        titleBrief.value = previousTitleBrief;
        titleLabelBrief.style.color = "black";
    }
});


// get upload progress and display using progress bar on home page
function displayUploadProgress() {
    const markerBriefCrossButton = document.getElementById("marker-brief-cross-button");
    const hideWhileUploadWrapper = document.getElementById("hide-while-upload-wrapper");
    const uploadMessage = document.getElementById("upload-message");
    const progressWrapper = document.getElementById("progress-wrapper");
    const briefProgressBar = document.getElementById("brief-progress-bar");
    const modalfooterWrapper = document.getElementById("modal-footer-wrapper");
    markerBriefCrossButton.hidden = true;
    hideWhileUploadWrapper.hidden = true;
    modalfooterWrapper.hidden = true;
    uploadMessage.hidden = false;
    progressWrapper.hidden = false;
    setInterval(async function getUploadProgress() {
        var result = await fetch("/get-upload-progress");
        result.json().then(result => {
            briefProgressBar.style.width = Math.round(result.percentage).toString() + "%";
            briefProgressBar.innerHTML = Math.round(result.percentage).toString() + "%";
            if (result.percentage == 100) {
                return
            }
        });
    }, 10);
}


// toggle marker brief forms
function toggleMarkerBriefForms(option) {
    const markerBriefModalLabel = document.getElementById("markerBriefModalLabel");
    const markerBriefSubmitButton = document.getElementById("marker-brief-submit-button");
    const titleBrief = document.getElementById("title-brief");
    var titleLabelBrief = document.getElementById("title-label-brief");
    const uploadNewMediaWrapper = document.getElementById("upload-new-media-wrapper");
    const copyMarkerTitleWrapper = document.getElementById("copy-marker-title-wrapper");
    const mediaLabel = document.getElementById("media-label");

    if (option == "add") {
        document.getElementById("markerBriefForm").action = "/add-brief";
        markerBriefModalLabel.innerHTML = "Add Marker Brief";
        markerBriefSubmitButton.innerHTML = "Add";
        copyMarkerTitleWrapper.hidden = false;
        titleBrief.value = "";
        titleLabelBrief.style.color = "black";
        $("#copy-marker-title").prop('checked', false);
        ckeditor.setData("Enter Brief for your Marker!");
        $('#media').val('');
        $("#upload-new-media").prop('checked', false);
        mediaLabel.style.color = "black";
        uploadNewMediaWrapper.hidden = true;
        setSelectMarkerTitle(option);
    }

    if (option == "edit") {
        document.getElementById("markerBriefForm").action = "/edit-brief/off";
        markerBriefModalLabel.innerHTML = "Edit Marker Brief";
        markerBriefSubmitButton.innerHTML = "Edit";
        copyMarkerTitleWrapper.hidden = false;
        titleBrief.value = "";
        titleLabelBrief.style.color = "black";
        $("#copy-marker-title").prop('checked', false);
        ckeditor.setData("Enter Brief for your Marker!");
        $('#media').val('');
        $("#upload-new-media").prop('checked', false);
        mediaLabel.style.color = "black";
        uploadNewMediaWrapper.hidden = false;
        setSelectMarkerTitle(option);
    }

    if (option == "delete") {
        document.getElementById("markerBriefForm").action = "/delete-brief";
        markerBriefModalLabel.innerHTML = "Delete Marker Brief";
        markerBriefSubmitButton.innerHTML = "Delete";
        copyMarkerTitleWrapper.hidden = true;
        titleBrief.value = "";
        titleLabelBrief.style.color = "black";
        $("#copy-marker-title").prop('checked', false);
        ckeditor.setData("Enter Brief for your Marker!");
        $('#media').val('');
        $("#upload-new-media").prop('checked', false);
        mediaLabel.style.color = "black";
        uploadNewMediaWrapper.hidden = true;
        setSelectMarkerTitle(option);
    }

}


// set marker brief form data
function setMarkerBriefFormData(selectedMarkerId) {
    const titleBrief = document.getElementById("title-brief");
    var markerData = document.getElementById("markerData").value;
    var briefData = document.getElementById("briefData").value;
    var briefId = document.getElementById("brief-id");
    var currentMedia = document.getElementById("current-media");
    markerData = JSON.parse(markerData);
    briefData = JSON.parse(briefData);
    briefData.forEach(brief => {
        if (brief.marker_id == selectedMarkerId.value) {
            titleBrief.value = brief.title;
            ckeditor.setData(brief.brief);
            briefId.value = brief._id;
            allfilepath = brief.media.map(b => b.path);
            currentMedia.value = allfilepath;
        }
    });
}


// function for new media toggle to send information through action
$("#upload-new-media").change(function () {
    const media = document.getElementById("media");
    const mediaLabel = document.getElementById("media-label");

    if (this.checked) {
        if (media.value == "") {
            alert("Please select images/videos to upload, media field empty!");
            $("#upload-new-media").prop('checked', false);
            mediaLabel.style.color = "black";
        } else {
            document.getElementById("markerBriefForm").action = "/edit-brief/on";
            mediaLabel.style.color = "green";
        }
    } else {
        document.getElementById("markerBriefForm").action = "/edit-brief/off";
        mediaLabel.style.color = "black";
    }
});