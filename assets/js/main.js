(function($) {
    "use strict";

    // Initialize when document is ready
    $(document).ready(function() {
        // Initialize custom scrollbar
        if ($.fn.mCustomScrollbar) {
            $(".custom_scroll").mCustomScrollbar({
                theme: "minimal"
            });
        }

        // Initialize WOW.js
        if (typeof WOW !== 'undefined') {
            new WOW().init();
        }

        // Initialize nice select
        if ($.fn.niceSelect) {
            $('select').niceSelect();
        }

        // Initialize magnific popup
        if ($.fn.magnificPopup) {
            $('.popup_video').magnificPopup({
                type: 'iframe',
                mainClass: 'mfp-fade',
                removalDelay: 160,
                preloader: false,
                fixedContentPos: false
            });
        }

        // Initialize owl carousel
        if ($.fn.owlCarousel) {
            $('.testimonial_carousel').owlCarousel({
                loop: true,
                margin: 30,
                nav: true,
                dots: false,
                autoplay: true,
                autoplayTimeout: 5000,
                autoplayHoverPause: true,
                navText: ['<i class="far fa-arrow-left"></i>', '<i class="far fa-arrow-right"></i>'],
                responsive: {
                    0: {
                        items: 1
                    },
                    768: {
                        items: 2
                    },
                    992: {
                        items: 3
                    }
                }
            });
        }

        // Back to top button
        $(window).on('scroll', function() {
            if ($(this).scrollTop() > 300) {
                $('#backtotop').fadeIn();
            } else {
                $('#backtotop').fadeOut();
            }
        });

        $('#backtotop').on('click', function() {
            $('html, body').animate({
                scrollTop: 0
            }, 800);
            return false;
        });

        // Mobile menu toggle
        $('.mobile_menu_btn').on('click', function() {
            $('.sidebar-menu-wrapper').addClass('active');
            $('.overlay').addClass('active');
        });

        $('.close_btn, .overlay').on('click', function() {
            $('.sidebar-menu-wrapper').removeClass('active');
            $('.overlay').removeClass('active');
        });
    });

})(jQuery); 