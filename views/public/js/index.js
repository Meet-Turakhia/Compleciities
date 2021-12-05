// initialize map
const map = L.map("map", {

    attributionControl: false,

}).setView([0, 0], 0);
const tileUrl = "/images/sketch/{z}/{x}/{y}.png";
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
        img.src = "/images/complecities_logo.png";
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


// page on load map animation
map.flyTo([0, 0], 1, {
    duration: 1.5,
});


// marker functionalities
function makePopupContent(marker) {
    return `
    <div>

        <h4 class = 'head-font marker-popup'>${marker.properties.title}</h4>
        <p class = 'para-font marker-popup'>${marker.properties.description}</p>
        <p class = 'para-font marker-popup'>${marker.properties.category}</p>
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
    iconUrl: "/images/marker.png",
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


// marker title used validation function
var globalMarkerTitleUsed;

function markerTitleUsed() {
    globalMarkerTitleUsed = false;
    const markerTitleUsedLabel = document.getElementById("marker-title-used");
    var titleValue = document.getElementById("title").value;
    var markerData = document.getElementById("markerData").value;
    markerData = JSON.parse(markerData);

    markerData.forEach(marker => {
        if (titleValue == marker.title) {
            globalMarkerTitleUsed = true;
        }
    });

    if (titleValue != "") {
        if (globalMarkerTitleUsed == true) {
            markerTitleUsedLabel.innerHTML = "Title already in use, try something else!";
            markerTitleUsedLabel.style.color = "red";
            markerTitleUsedLabel.hidden = false;
        } else {
            markerTitleUsedLabel.innerHTML = "Title not in use, accepted!";
            markerTitleUsedLabel.style.color = "green";
            markerTitleUsedLabel.hidden = false;
        }
    } else {
        markerTitleUsedLabel.innerHTML = "";
        markerTitleUsedLabel.style.color = "black";
        markerTitleUsedLabel.hidden = true;
    }
}


// toggle marker option forms
function toggleMarkerOptionForms(option) {
    var title = document.getElementById("title");
    var titleLabel = document.getElementById("title-label");
    var categoryDropdown = document.getElementById("category-dropdown");
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
    const markerTitleUsedLabel = document.getElementById("marker-title-used");

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
        categoryDropdown.value = "";
        categoryDropdown.disabled = false;
        markerTitleUsedLabel.innerHTML = "";
        markerTitleUsedLabel.style.color = "black";
        markerTitleUsedLabel.hidden = true;
        globalMarkerTitleUsed = false;
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
        addValidateMarkerAdd();
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
        categoryDropdown.value = "";
        categoryDropdown.disabled = false;
        markerTitleUsedLabel.innerHTML = "";
        markerTitleUsedLabel.style.color = "black";
        markerTitleUsedLabel.hidden = true;
        globalMarkerTitleUsed = false;
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
        removeValidateMarkerAdd();
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
        categoryDropdown.value = "";
        categoryDropdown.disabled = true;
        markerTitleUsedLabel.innerHTML = "";
        markerTitleUsedLabel.style.color = "black";
        markerTitleUsedLabel.hidden = true;
        globalMarkerTitleUsed = false;
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
        removeValidateMarkerAdd();
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
    var categoryrelationData = document.getElementById("categoryrelationData").value;
    categoryrelationData = JSON.parse(categoryrelationData);
    var categoryDropdown = document.getElementById("category-dropdown");
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
    var categoryDropdownOptions = categoryDropdown.options;
    Array.from(categoryDropdownOptions).forEach(option => {
        option.selected = null;
    });

    markerData.forEach(marker => {
        if (marker.title == selectedTitle) {
            zoom.value = marker.zoom_level;
            description.value = marker.description;
            markerId.value = marker._id;
            latitude.value = marker.latitude;
            longitude.value = marker.longitude;
        }
    });

    categoryrelationData.forEach(categoryrelation => {
        if (categoryrelation.marker_title == selectedTitle) {
            var categoryDropdownOptions = categoryDropdown.options;
            Array.from(categoryDropdownOptions).forEach(option => {
                if (option.value == categoryrelation.category_id) {
                    option.selected = "selected";
                }
            });
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
        if (globalLatitude == "") {
            globalLatitude = "";
            globalLongitude = "";
        }
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


// marker options, category options and marker brief desired settings
var markerOptionsModalOptionsCalledOnce = false;
function markerOptionsModalOptions() {
    if (markerOptionsModalOptionsCalledOnce == false) {
        setCategoryDropdown();
    }

    document.getElementById("add").click();
    mapScrollDragDisable();
    markerOptionsModalOptionsCalledOnce = true;
}

function categoryOptionsModalOptions() {
    document.getElementById("addCategory").click();
    mapScrollDragDisable();
}


function markerBriefModalOptions() {
    document.getElementById("brief-add").click();
    mapScrollDragDisable();
}


function filterOptionModalOptions() {
    mapScrollDragDisable();
}


function markerBriefUserOptions() {
    // fill user options form if document present
    const userImage = document.getElementById("user-image");
    const userImageLabel = document.getElementById("user-image-label");
    var userData = document.getElementById("userData").value;

    $("#upload-new-user-image").prop('checked', false);
    userImage.value = "";
    userImageLabel.style.color = "black";

    userData = JSON.parse(userData);
    if (userData.length != 0) {
        fillUserOptionsForm(userData);
    } else {
        noUserFormSet();
    }

    mapScrollDragDisable();
}


// validate marker add function
function validateMarkerAdd() {
    var titleValue = document.getElementById("title").value;

    if (globalMarkerTitleUsed == true) {
        alert("The marker title '" + titleValue + "' is already in use, please try something else!");
        return false;
    }
}


function addValidateMarkerAdd() {
    var markerOptionsSubmitButton = document.getElementById("marker-options-submit-button");
    markerOptionsSubmitButton.onclick = validateMarkerAdd;
}


function removeValidateMarkerAdd() {
    var markerOptionsSubmitButton = document.getElementById("marker-options-submit-button");
    markerOptionsSubmitButton.onclick = null;
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
ckeditor = CKEDITOR.replace('ckeditor', {
    removePlugins: 'about, a11yhelp, dialogadvtab, elementspath, flash, save, sourcearea',
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
    var selectedMarkerTitle = document.getElementById("selected-marker-title");
    markerData = JSON.parse(markerData);

    $("#copy-marker-title").prop('checked', false);
    titleBrief.value = null;
    titleLabelBrief.style.color = "black";

    markerData.forEach(marker => {
        if (marker.title == selectMarkerValue) {
            selectedMarkerId.value = marker._id;
            selectedMarkerTitle.value = marker.title;
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
    if (document.getElementById("markerBriefForm").action.split("/")[3] == "add-brief" || (document.getElementById("markerBriefForm").action.split("/")[3] == "edit-brief" && document.getElementById("markerBriefForm").action.split("/")[4] == "on")) {
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
}


// toggle marker brief forms
function toggleMarkerBriefForms(option) {
    const markerBriefModalLabel = document.getElementById("markerBriefModalLabel");
    const markerBriefSubmitButton = document.getElementById("marker-brief-submit-button");
    const titleBrief = document.getElementById("title-brief");
    var titleLabelBrief = document.getElementById("title-label-brief");
    const uploadNewMediaWrapper = document.getElementById("upload-new-media-wrapper");
    const copyMarkerTitleWrapper = document.getElementById("copy-marker-title-wrapper");
    const media = document.getElementById("media");
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
        media.required = true;
        $("#upload-new-media").prop('checked', false);
        mediaLabel.style.color = "black";
        uploadNewMediaWrapper.hidden = true;
        titleBrief.readOnly = false;
        ckeditor.setReadOnly(false);
        $('#media').css('pointer-events', '');
        setSelectMarkerTitle(option);
        addValidateMarkerSelectBriefDelete();
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
        media.required = false;
        $("#upload-new-media").prop('checked', false);
        mediaLabel.style.color = "black";
        uploadNewMediaWrapper.hidden = false;
        titleBrief.readOnly = false;
        ckeditor.setReadOnly(false);
        $('#media').css('pointer-events', '');
        setSelectMarkerTitle(option);
        addValidateMarkerSelectBriefDelete();
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
        media.required = false;
        $("#upload-new-media").prop('checked', false);
        mediaLabel.style.color = "black";
        uploadNewMediaWrapper.hidden = true;
        titleBrief.readOnly = true;
        ckeditor.setReadOnly(true);
        $('#media').css('pointer-events', 'none');
        setSelectMarkerTitle(option);
        addValidateMarkerSelectBriefDelete();
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


// media change function
$("#media").change(function () {
    const mediaLabel = document.getElementById("media-label");

    if (media.value == "") {
        $("#upload-new-media").prop('checked', false);
        mediaLabel.style.color = "black";
    }
});


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


// validate marker select and confirm brief delete function for brief form
function validateMarkerSelectBriefDelete() {
    const markerBriefSubmitButton = document.getElementById("marker-brief-submit-button");
    var selectMarkerValue = document.getElementById("select-marker-title").value;
    const titleBrief = document.getElementById("title-brief");

    if (markerBriefSubmitButton.innerHTML == "Delete") {
        if (selectMarkerValue != "Select Marker") {
            if (ckeditor.getData() == "") {
                alert("Please write brief for your marker, the brief field is empty!");
                return false;
            } else {
                return confirm("Are you sure you want to delete '" + titleBrief.value + "' brief of '" + selectMarkerValue + "' marker?");
            }
        } else {
            alert("Select a valid brief to delete!");
            return false;
        }
    } else {
        if (selectMarkerValue == "Select Marker") {
            alert("Please select a valid marker to proceed!");
            return false;
        } else {
            if (ckeditor.getData() == "") {
                alert("Please write brief for your marker, the brief field is empty!");
                return false;
            }
        }
    }
}


function addValidateMarkerSelectBriefDelete() {
    var markerBriefSubmitButton = document.getElementById("marker-brief-submit-button");
    markerBriefSubmitButton.onclick = validateMarkerSelectBriefDelete;
}


function removeValidateMarkerSelectBriefDelete() {
    var markerBriefSubmitButton = document.getElementById("marker-brief-submit-button");
    markerBriefSubmitButton.onclick = null;
}


// fill user options form function
function fillUserOptionsForm(userData) {
    const name = document.getElementById("name");
    const linkedin = document.getElementById("linkedin");
    const twitter = document.getElementById("twitter");
    const facebook = document.getElementById("facebook");
    const instagram = document.getElementById("instagram");
    const pinterest = document.getElementById("pinterest");
    const gmail = document.getElementById("gmail");
    const footerDescription = document.getElementById("footer-description");
    const userImage = document.getElementById("user-image");
    const uploadNewUserImageWrapper = document.getElementById("upload-new-user-image-wrapper");
    const userOptionsForm = document.getElementById("userOptionsForm");
    const userId = document.getElementById("user-id");
    const currentUserImage = document.getElementById("current-user-image");
    const userOptionsSubmitButton = document.getElementById("user-options-submit-button");

    userData.forEach(user => {
        userId.value = user._id;
        currentUserImage.value = user.image.map(i => i.path);
        name.value = user.name;
        linkedin.value = user.linkedin;
        twitter.value = user.twitter;
        facebook.value = user.facebook;
        instagram.value = user.instagram;
        pinterest.value = user.pinterest;
        gmail.value = user.gmail;
        footerDescription.value = user.footer_description;
    });

    userImage.required = false;
    uploadNewUserImageWrapper.hidden = false;
    userOptionsForm.action = "/edit-user-data/off";
    userOptionsSubmitButton.innerHTML = "Edit";

}


// form setting if no user data present
function noUserFormSet() {
    const userImage = document.getElementById("user-image");
    const uploadNewUserImageWrapper = document.getElementById("upload-new-user-image-wrapper");
    const userOptionsForm = document.getElementById("userOptionsForm");
    const userOptionsSubmitButton = document.getElementById("user-options-submit-button");

    userImage.required = true;
    uploadNewUserImageWrapper.hidden = true;
    userOptionsForm.action = "/add-user-data";
    userOptionsSubmitButton.innerHTML = "Add";
}


// upload new user image toggle
$("#upload-new-user-image").change(function () {
    const userOptionsForm = document.getElementById("userOptionsForm");
    const userImage = document.getElementById("user-image");
    const userImageLabel = document.getElementById("user-image-label");

    if (this.checked) {
        userOptionsForm.action = "/edit-user-data/on";
        if (userImage.value != "") {
            userImage.required = true;
            userImageLabel.style.color = "green";
        } else {
            userImage.required = false;
            $("#upload-new-user-image").prop('checked', false);
            userImage.value = "";
            userImageLabel.style.color = "black";
            alert("Please select an image to upload, user image field empty!");
        }
    } else {
        userOptionsForm.action = "/edit-user-data/off";
        userImage.required = false;
        userImage.value = "";
        userImageLabel.style.color = "black";
    }

});


// user options form validation
function userOptionsFormValidation() {
    const uploadNewUserImage = document.getElementById("upload-new-user-image");
    const userImage = document.getElementById("user-image");
    const userOptionsSubmitButton = document.getElementById("user-options-submit-button");

    if (userOptionsSubmitButton.innerHTML != "Add") {

        if (!uploadNewUserImage.checked) {
            if (userImage.value != "") {
                var imageName = userImage.value;
                userImage.value = "";
                return confirm("You have selected '" + imageName + "' image but havent checked the upload new user image field, hence the image wont be uploaded, do you want to proceed?");
            }
        }

    }
}


// toggle category options form
function toggleCategoryOptionForms(option) {
    const categoryOptionsModalLabel = document.getElementById("categoryOptionsModalLabel");
    const selectCategoryLabel = document.getElementById("select-category-label");
    const selectCategory = document.getElementById("select-category");
    const categoryLabel = document.getElementById("category-label");
    const category = document.getElementById("category");
    const categoryOptionsSubmitButton = document.getElementById("category-options-submit-button");

    if (option == "add") {
        document.getElementById("categoryOptionsForm").action = "/add-category";
        categoryOptionsModalLabel.innerHTML = "Add Category";
        categoryOptionsSubmitButton.innerHTML = "Add";
        selectCategoryLabel.hidden = true;
        selectCategory.hidden = true;
        selectCategory.disabled = true;
        categoryLabel.hidden = false;
        category.hidden = false;
        category.disabled = false;
    }

    if (option == "delete") {
        document.getElementById("categoryOptionsForm").action = "/delete-category";
        categoryOptionsModalLabel.innerHTML = "Delete Category";
        categoryOptionsSubmitButton.innerHTML = "Delete";
        selectCategoryLabel.hidden = false;
        selectCategory.hidden = false;
        selectCategory.disabled = false;
        categoryLabel.hidden = true;
        category.hidden = true;
        category.disabled = true;
        setSelectCategoryValues();
    }

}


// check if category is already present
var globalCategoryUsed;
function categoryUsed() {
    globalCategoryUsed = false;
    var categoryValue = document.getElementById("category").value;
    var categoryData = document.getElementById("categoryData").value;
    var categoryUsedLabel = document.getElementById("category-used-label");
    categoryData = JSON.parse(categoryData);
    if (categoryValue == "") {
        categoryUsedLabel.hidden = true;
        return;
    }

    categoryData.forEach(category => {
        if (categoryValue.toLowerCase() == category.category.toLowerCase()) {
            globalCategoryUsed = true;
        }
    });

    if (globalCategoryUsed == true) {
        categoryUsedLabel.innerHTML = "Category already in use, try something else!";
        categoryUsedLabel.style.color = "red";
        categoryUsedLabel.hidden = false;
    } else {
        categoryUsedLabel.innerHTML = "Category not in use, accepted!";
        categoryUsedLabel.style.color = "green";
        categoryUsedLabel.hidden = false;
    }
}


// set category values for select category in category delete
function setSelectCategoryValues() {
    var categoryData = document.getElementById("categoryData").value;
    var selectCategory = document.getElementById("select-category");
    categoryData = JSON.parse(categoryData);
    var length = selectCategory.options.length;
    for (i = length - 1; i > 0; i--) {
        selectCategory.options[i] = null;
    }

    categoryData.forEach(category => {
        var option = document.createElement("option");
        option.text = category.category;
        option.value = category.category;
        selectCategory.appendChild(option);
    });
}


// set select category id
function setSelectCategoryId() {
    var selectCategoryValue = document.getElementById("select-category").value;
    var categoryId = document.getElementById("category-id");
    var categoryData = document.getElementById("categoryData").value;
    categoryData = JSON.parse(categoryData);

    categoryData.forEach(category => {
        if (selectCategoryValue == category.category) {
            categoryId.value = category._id;
        }
    });
}


// category options submit button verification
function categoryOptionsSubmitVerification() {
    const categoryOptionsSubmitButton = document.getElementById("category-options-submit-button");
    var selectCategoryValue = document.getElementById("select-category").value;
    var category = document.getElementById("category");
    if (categoryOptionsSubmitButton.innerHTML == "Add") {
        if (globalCategoryUsed == true) {
            alert("The category '" + category.value + "' is already in use, try something else!");
            return false;
        }
    } else {
        if (selectCategoryValue == "Select Category") {
            alert("Select a valid category to delete!");
            return false;
        } else {
            return confirm("Are you sure you want to permanently delete '" + selectCategoryValue + "' category?");
        }
    }
}


// set category dropdown function
function setCategoryDropdown() {
    var categoryDropdown = document.getElementById("category-dropdown");
    var categoryData = document.getElementById("categoryData").value;
    categoryData = JSON.parse(categoryData);

    categoryData.forEach(category => {
        var option = document.createElement("option");
        option.text = category.category;
        option.value = category._id;
        categoryDropdown.appendChild(option);
    });
}


// execute all function
function executeAll(option) {
    if (option == "showall") {
        $("input[name = filterOptionsCategoryCheckboxes]").prop('checked', true);
    } else {
        $("input[name = filterOptionsCategoryCheckboxes]").prop('checked', false);
    }
}


// when selecting custom category
function customCategorySelect() {
    $("input[name = showRemoveAll]").prop('checked', false);
}