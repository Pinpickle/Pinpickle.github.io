//= require jquery/dist/jquery.min
$(document).ready(function() {
    var resize = function () {
        $('.video-big').each(function() {
            $(this).height($(this).width() / 16 * 9);
        });
    };
    resize();
    $(window).resize(resize);
});
