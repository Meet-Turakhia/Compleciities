// flexslider js
// Can also be used with $(document).ready()


$(window).on("load", function () {
    $('.flexslider').flexslider({
        animation: "slide",
        smoothHeight: true,
        slideshow: false,
        before: function (slider) {
            pauseAllVideos();
        }
    });
});


function pauseAllVideos() {
    let allVids = $("#brief-flexslider").find('.flexslider-item');
    allVids.each(function (index, el) {
        if (index !== 0) {
            $(allVids).find('video')[0].pause();
        }
    });
}


// copy url function
function copyUrl() {
    var Url = document.getElementById("box");
    Url.value = window.location.href;
    Url.focus();
    Url.select();
    document.getElementById("custom-tooltip").style.display = "inline";
    document.execCommand("copy");
    setTimeout(function () {
        document.getElementById("custom-tooltip").style.display = "none";
    }, 1000);

};