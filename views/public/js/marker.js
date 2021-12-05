// fetching all markers data from index.hbs
var markerData = document.getElementById("markerData").value;
markerData = JSON.parse(markerData);
var categoryData = document.getElementById("categoryData").value;
categoryData = JSON.parse(categoryData);
var categoryrelationData = document.getElementById("categoryrelationData").value;
categoryrelationData = JSON.parse(categoryrelationData);


var categoryDict = {}
categoryData.forEach(category => {
    categoryDict[category._id] = category.category;
});


// assigning the markers data for rendering
var marker = [];
markerData.forEach(element => {
    var categoryList = [];
    categoryrelationData.forEach(categoryrelation => {
        if (categoryrelation.marker_title == element.title) {
            categoryList.push(categoryDict[categoryrelation.category_id]);
        }
    });
    categoryString = categoryList.toString();
    categoryString = categoryString.replaceAll(",", ", ");

    marker.push({
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [element.longitude, element.latitude],
            "zoom": element.zoom_level,
        },
        "properties": {
            "title": element.title,
            "description": element.description,
            "category": "Category(s): " + categoryString,
            "link": "/brief/" + element.title.replace(/\s/g, "-"),
        }
    });
});