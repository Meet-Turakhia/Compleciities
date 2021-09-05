// fetching all markers data from index.hbs
var markerData =document.getElementById("markerData").value;
markerData = JSON.parse(markerData);


// assigning the markers data for rendering
var marker = [];
markerData.forEach(element => {
    marker.push({
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [element.latitude, element.longitude],
            "zoom": element.zoom_level,
        },
        "properties": {
            "title": element.title,
            "description": element.description,
            "link": "google.com",
        }
    });
});