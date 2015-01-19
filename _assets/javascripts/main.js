//= require jquery/dist/jquery.min
var Pinpickle = function() {
    var self = this;

    this.scrolls = [];
    this.resizes = [];

    var $window = this.$window = $(window);

    this.scrollTop = $window.scrollTop();
    this.width = $window.width();
    this.height = $window.height();

    var scrollTimer, didScroll = false, resizeTimer, didResize = false,
        scrollFunction = function() {
            if (didScroll) {
                self.scrollTop = $window.scrollTop();

                self.scrolls.forEach(function(el) {
                    el();
                });
                didScroll = false;
            }
        },
        resizeFunction = function() {
            if (didResize) {
                self.width = $window.width();
                self.height = $window.height();

                self.resizes.forEach(function(el) {
                    el();
                });
                didResize = false;
            }
        };

    $window.scroll(function() {
        didScroll = true;
    });

    $window.resize(function() {
        didResize = true;
    });

    scrollTimer = setInterval(scrollFunction, 10);
    resizeTimer = setInterval(resizeFunction, 200);

    this.addScroll = function(fun, exec) {
        self.scrolls.push(fun);
        if (exec) {
            fun();
        }
    };

    this.addResize = function(fun, exec) {
        self.resizes.push(fun);
        if (exec) {
            fun();
        }
    };
};

$(document).ready(function() {
    var main = new Pinpickle();

    main.addResize(function () {
        $('.video-big').each(function() {
            $(this).height($(this).width() / 16 * 9);
        });
    }, true);

    var header = $('.site-header'), headerBG = $('.site-header .bg-container'), title = $('.title-container'), headerFixed = false, headerHeight = 50;

    var threshhold = $('.site-header').height() - headerHeight;

    headerBG.height(header.height() + threshhold * .2);

    if ($('body').hasClass('big-header')) {
        main.addScroll(function() {
            if (headerFixed) {
                if (main.scrollTop < threshhold) {
                    header.removeClass('sticky');
                    header.css('top', '');
                    headerFixed = false;
                }
            } else {
                headerBG.css('transform', 'translateY(' + (Math.min(main.scrollTop, threshhold) * .2) + 'px)');
                if (main.scrollTop >= threshhold) {
                    header.addClass('sticky');
                    header.css('top', -threshhold);
                    headerFixed = true;
                }
            }
        }, true);
    }
});
