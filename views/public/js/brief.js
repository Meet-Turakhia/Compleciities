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