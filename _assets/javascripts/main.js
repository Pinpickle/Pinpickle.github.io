//= require jquery/dist/jquery.min

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


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
        if (!didScroll) {
            didScroll = true;
            scrollTimer = requestAnimationFrame(scrollFunction);
        }
    });

    $window.resize(function() {
        didResize = true;
    });

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
