// flexslider js
// Can also be used with $(document).ready()


$(window).on("load", function () {
    var swipe = true;

    if ($('.flexslider li').length <= 1) {
        swipe = false;
    }
    
    $('.flexslider').flexslider({
        animation: "slide",
        smoothHeight: true,
        slideshow: false,
        touch: swipe,
        before: function (slider) {
            pauseAllVideos();
        }
    });
});


function pauseAllVideos() {
    let allVids = $("#brief-flexslider").find('.flexslider-item');
    allVids.each(function (index, el) {
        if (index !== 0) {
            vid = $(allVids).find('video')[index];
            if (vid != undefined) {
                vid.pause();
            }
        } else {
            vid = $(allVids).find('video')[0];
            if (vid != undefined) {
                vid.pause();
            }
        }
    });
}


// copy url function
function copyUrl() {
    url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Copied Url: '" + url + "' to your clipboard!");
};