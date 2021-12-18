// clear console to avoid meaningless 404 errors by leaflet.js
// var clearconsole = window.setInterval(function () {
//     console.clear();
// }, 5000);


// prevent user from accessing the code on the client side
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});


document.onkeydown = function (e) {
    if (event.keyCode == 123) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
        return false;
    }
}
