// Wait for document ready
jQuery(document).ready(function($) {
    'use strict';

    // Initialize Bootstrap components
    var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
    dropdownElementList.forEach(function(dropdownToggleEl) {
        new bootstrap.Dropdown(dropdownToggleEl);
    });

    // Sticky Header
    const stickyHeader = function() {
        const header = $('.header_section.sticky_header');
        if (!header.length) return;

        const headerHeight = header.outerHeight();
        $('body').css('padding-top', headerHeight + 'px');

        $(window).on('scroll', function() {
            if ($(window).scrollTop() > 50) {
                header.addClass('scrolled');
            } else {
                header.removeClass('scrolled');
            }
        });
    };

    // Mobile Menu
    const mobileMenuInit = function() {
        const mobileMenuBtn = $('.mobile_menu_btn');
        const sidebarMenu = $('.sidebar_mobile_menu');
        const closeBtn = $('.close_btn');
        const overlay = $('.overlay');

        mobileMenuBtn.on('click', function() {
            sidebarMenu.addClass('active');
            overlay.addClass('active');
        });

        closeBtn.on('click', function() {
            sidebarMenu.removeClass('active');
            overlay.removeClass('active');
        });

        overlay.on('click', function() {
            sidebarMenu.removeClass('active');
            overlay.removeClass('active');
        });
    };

    // Initialize functions
    stickyHeader();
    mobileMenuInit();

    // Initialize Owl Carousel
    const initCarousel = function() {
        if(typeof $.fn.owlCarousel !== 'undefined') {
            $('.owl-carousel').each(function() {
                $(this).owlCarousel({
                    items: $(this).data('items') || 1,
                    loop: true,
                    margin: $(this).data('margin') || 0,
                    nav: $(this).data('nav') || true,
                    dots: $(this).data('dots') || true,
                    autoplay: $(this).data('autoplay') || true,
                    autoplayTimeout: $(this).data('autoplay-timeout') || 5000,
                    responsive: {
                        0: { items: 1 },
                        576: { items: $(this).data('sm-items') || 2 },
                        768: { items: $(this).data('md-items') || 3 },
                        992: { items: $(this).data('lg-items') || 4 },
                        1200: { items: $(this).data('xl-items') || $(this).data('items') || 4 }
                    }
                });
            });
        }
    };

    // Initialize Nice Select
    const initNiceSelect = function() {
        if(typeof $.fn.niceSelect !== 'undefined') {
            $('select').niceSelect();
        }
    };

    // Initialize Magnific Popup
    const initMagnificPopup = function() {
        if(typeof $.fn.magnificPopup !== 'undefined') {
            $('.popup_video').magnificPopup({
                type: 'iframe',
                mainClass: 'mfp-fade',
                removalDelay: 160,
                preloader: false,
                fixedContentPos: false
            });

            $('.image-popup').magnificPopup({
                type: 'image',
                gallery: {
                    enabled: true
                }
            });
        }
    };

    // Initialize WOW.js
    const initWow = function() {
        if(typeof WOW !== 'undefined') {
            new WOW().init();
        }
    };

    // Initialize CountTo
    const initCountTo = function() {
        if(typeof $.fn.countTo !== 'undefined') {
            $('.counter').countTo();
        }
    };

    // Initialize all components
    const initAll = function() {
        stickyHeader();
        initCarousel();
        initNiceSelect();
        initMagnificPopup();
        initWow();
        initCountTo();
    };

    // Run initialization
    initAll();

    // Handle dynamic content loading
    const handleDynamicContent = function() {
        if(typeof includeHTML === 'function') {
            includeHTML();
        }
    };

    // Run after all content is loaded
    $(window).on('load', function() {
        handleDynamicContent();
    });

    // Background image mapping for product pages
    const productBackgrounds = {
        'business-cards': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2940&auto=format&fit=crop',
        'flags': 'https://images.unsplash.com/photo-1588771930296-88c2cb03f386?q=80&w=2940&auto=format&fit=crop',
        'signs': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2946&auto=format&fit=crop',
        'postcards': 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?q=80&w=2940&auto=format&fit=crop',
        'flyers': 'https://images.unsplash.com/photo-1626808642875-0aa545482dfb?q=80&w=2940&auto=format&fit=crop',
        'brochures': 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?q=80&w=2940&auto=format&fit=crop',
        'default': 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?q=80&w=2940&auto=format&fit=crop'
    };     

    // Function to set background image for breadcrumb section 
    function setProductBackground() {
        const breadcrumbSection = document.querySelector('.breadcrumb_section');  
        if (!breadcrumbSection) return;
        
        const path = window.location.pathname;
        const pathSegments = path.split('/').filter(segment => segment.length > 0);
        const pageName = pathSegments[pathSegments.length - 1].replace('.html', '');
        const backgroundImage = productBackgrounds[pageName] || productBackgrounds.default;
        
        breadcrumbSection.style.backgroundImage = `url(${backgroundImage})`;
    }

    // Run when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        setProductBackground();
    });
});
