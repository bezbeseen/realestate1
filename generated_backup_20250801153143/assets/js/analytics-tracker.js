/**
 * Comprehensive Analytics Tracker for BeSeen Website
 * Tracks user interactions, engagement metrics, and conversion events
 */

class AnalyticsTracker {
    constructor() {
        this.sessionStart = Date.now();
        this.scrollDepthThresholds = [25, 50, 75, 90, 100];
        this.scrollDepthReached = [];
        this.timeOnPageIntervals = [];
        this.engagementEvents = [];
        this.lastScrollPosition = 0;
        this.isEngaged = false;
        this.pageLoadTime = null;
        this.userAgent = navigator.userAgent;
        this.referrer = document.referrer;
        this.utmParams = this.getUtmParameters();
        
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupTracking());
        } else {
            this.setupTracking();
        }
    }

    setupTracking() {
        console.log('🔥 Analytics Tracker Initialized');
        
        // Track page load performance
        this.trackPageLoad();
        
        // Set up all event listeners
        this.setupNavigationTracking();
        this.setupButtonTracking();
        this.setupFormTracking();
        this.setupScrollTracking();
        this.setupEngagementTracking();
        this.setupEcommerceTracking();
        this.setupMobileInteractions();
        this.setupContactTracking();
        this.setupDownloadTracking();
        this.setupVideoTracking();
        this.setupErrorTracking();
        this.setupVisibilityTracking();
        
        // Track initial page view with enhanced data
        this.trackPageView();
        
        // Set up periodic engagement tracking
        this.startEngagementTimer();
        
        // Track when user leaves the page
        this.setupUnloadTracking();
    }

    // Enhanced page view tracking
    trackPageView() {
        const pageData = {
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname,
            page_referrer: this.referrer,
            user_agent: this.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`,
            connection_type: navigator.connection ? navigator.connection.effectiveType : 'unknown',
            device_memory: navigator.deviceMemory || 'unknown',
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            utm_source: this.utmParams.utm_source,
            utm_medium: this.utmParams.utm_medium,
            utm_campaign: this.utmParams.utm_campaign,
            utm_term: this.utmParams.utm_term,
            utm_content: this.utmParams.utm_content
        };

        this.trackEvent('page_view', 'engagement', pageData);
    }

    // Track page load performance
    trackPageLoad() {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                this.pageLoadTime = perfData.loadEventEnd - perfData.loadEventStart;
                
                this.trackEvent('page_load_performance', 'performance', {
                    load_time: this.pageLoadTime,
                    dom_content_loaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    dns_lookup: perfData.domainLookupEnd - perfData.domainLookupStart,
                    tcp_connection: perfData.connectEnd - perfData.connectStart,
                    server_response: perfData.responseEnd - perfData.requestStart,
                    page_size: perfData.transferSize || 0
                });
            }
        });
    }

    // Navigation tracking with detailed analytics
    setupNavigationTracking() {
        // Track main navigation clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            const text = link.textContent.trim();
            const isExternal = href && (href.startsWith('http') && !href.includes(window.location.hostname));
            const isDownload = href && (href.includes('.pdf') || href.includes('.doc') || href.includes('.xls') || href.includes('.zip'));
            
            // Determine navigation type
            let navType = 'internal_link';
            if (isExternal) navType = 'external_link';
            if (isDownload) navType = 'download_link';
            if (href && href.startsWith('mailto:')) navType = 'email_link';
            if (href && href.startsWith('tel:')) navType = 'phone_link';

            // Get navigation context
            const section = this.getElementSection(link);
            const isMainNav = link.closest('.main_menu') !== null;
            const isFooter = link.closest('footer') !== null;
            const isMobileNav = link.closest('.sidebar-menu-wrapper') !== null;

            this.trackEvent('navigation_click', 'navigation', {
                link_text: text,
                link_url: href,
                link_type: navType,
                navigation_section: section,
                is_main_navigation: isMainNav,
                is_footer_navigation: isFooter,
                is_mobile_navigation: isMobileNav,
                click_position_x: e.clientX,
                click_position_y: e.clientY
            });

            // Track submenu interactions
            if (link.closest('.submenu')) {
                this.trackEvent('submenu_click', 'navigation', {
                    submenu_item: text,
                    parent_menu: link.closest('.has_child')?.querySelector('a')?.textContent?.trim(),
                    link_url: href
                });
            }
        });

        // Track menu hover interactions (engagement indicator)
        const menuItems = document.querySelectorAll('.main_menu .has_child');
        menuItems.forEach(item => {
            let hoverTimer;
            item.addEventListener('mouseenter', () => {
                hoverTimer = setTimeout(() => {
                    this.trackEvent('menu_hover_engaged', 'engagement', {
                        menu_item: item.querySelector('a').textContent.trim(),
                        hover_duration: 1000
                    });
                }, 1000);
            });
            
            item.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimer);
            });
        });
    }

    // Button and CTA tracking
    setupButtonTracking() {
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button, .btn, .custom_btn, input[type="submit"]');
            if (!button) return;

            const buttonText = button.textContent.trim() || button.value || button.title;
            const buttonClass = button.className;
            const section = this.getElementSection(button);
            
            // Special handling for specific buttons
            if (button.classList.contains('login')) {
                this.trackEvent('login_button_click', 'user_interaction', {
                    button_text: buttonText,
                    section: section
                });
            } else if (button.classList.contains('cart_btn')) {
                this.trackEvent('cart_button_click', 'ecommerce', {
                    button_text: buttonText,
                    section: section,
                    cart_items: this.getCartItemCount()
                });
            } else if (button.classList.contains('mobile_menu_btn')) {
                this.trackEvent('mobile_menu_toggle', 'mobile_interaction', {
                    action: 'open',
                    section: section
                });
            } else {
                this.trackEvent('button_click', 'user_interaction', {
                    button_text: buttonText,
                    button_class: buttonClass,
                    section: section,
                    click_position_x: e.clientX,
                    click_position_y: e.clientY
                });
            }
        });
    }

    // Form tracking with detailed analytics
    setupFormTracking() {
        // Track form starts
        document.addEventListener('focusin', (e) => {
            if (e.target.matches('input, textarea, select')) {
                const form = e.target.closest('form');
                if (form && !form.dataset.trackingStarted) {
                    form.dataset.trackingStarted = 'true';
                    this.trackEvent('form_start', 'form_interaction', {
                        form_id: form.id || 'unnamed',
                        form_class: form.className,
                        first_field: e.target.name || e.target.id || 'unnamed',
                        section: this.getElementSection(form)
                    });
                }
            }
        });

        // Track form field interactions
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.trackEvent('form_field_interaction', 'form_interaction', {
                    field_name: e.target.name || e.target.id,
                    field_type: e.target.type,
                    field_value_length: e.target.value.length,
                    form_id: e.target.closest('form')?.id || 'unnamed'
                });
            }
        });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const formData = new FormData(form);
            const fields = {};
            
            for (let [key, value] of formData.entries()) {
                fields[key] = typeof value === 'string' ? value.length : 'file';
            }

            this.trackEvent('form_submit', 'form_interaction', {
                form_id: form.id || 'unnamed',
                form_class: form.className,
                form_method: form.method,
                form_action: form.action,
                field_count: Object.keys(fields).length,
                fields: Object.keys(fields),
                section: this.getElementSection(form)
            });
        });
    }

    // Advanced scroll tracking
    setupScrollTracking() {
        let ticking = false;
        
        const trackScroll = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.round((scrollTop / docHeight) * 100);
            
            // Track scroll depth milestones
            this.scrollDepthThresholds.forEach(threshold => {
                if (scrollPercent >= threshold && !this.scrollDepthReached.includes(threshold)) {
                    this.scrollDepthReached.push(threshold);
                    this.trackEvent('scroll_depth', 'engagement', {
                        scroll_depth: threshold,
                        time_to_depth: Date.now() - this.sessionStart,
                        scroll_direction: scrollTop > this.lastScrollPosition ? 'down' : 'up'
                    });
                }
            });

            // Track rapid scrolling (possible bot behavior)
            const scrollSpeed = Math.abs(scrollTop - this.lastScrollPosition);
            if (scrollSpeed > 1000) {
                this.trackEvent('rapid_scroll', 'behavior', {
                    scroll_speed: scrollSpeed,
                    scroll_position: scrollPercent
                });
            }

            this.lastScrollPosition = scrollTop;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(trackScroll);
                ticking = true;
            }
        });
    }

    // Engagement tracking
    setupEngagementTracking() {
        // Track mouse movement (engagement indicator)
        let mouseMovements = 0;
        document.addEventListener('mousemove', () => {
            mouseMovements++;
            if (mouseMovements === 10 && !this.isEngaged) {
                this.isEngaged = true;
                this.trackEvent('user_engaged', 'engagement', {
                    time_to_engagement: Date.now() - this.sessionStart,
                    engagement_type: 'mouse_movement'
                });
            }
        });

        // Track keyboard activity
        document.addEventListener('keydown', () => {
            if (!this.isEngaged) {
                this.isEngaged = true;
                this.trackEvent('user_engaged', 'engagement', {
                    time_to_engagement: Date.now() - this.sessionStart,
                    engagement_type: 'keyboard_activity'
                });
            }
        });

        // Track copy/paste events
        document.addEventListener('copy', (e) => {
            this.trackEvent('content_copied', 'engagement', {
                copied_text_length: window.getSelection().toString().length,
                section: this.getElementSection(e.target)
            });
        });
    }

    // E-commerce tracking
    setupEcommerceTracking() {
        // Track product views
        if (window.location.pathname.includes('/products/')) {
            this.trackEvent('product_view', 'ecommerce', {
                product_category: this.getProductCategory(),
                product_name: document.title,
                product_url: window.location.pathname
            });
        }

        // Track add to cart events (if cart functionality exists)
        document.addEventListener('click', (e) => {
            if (e.target.matches('.add-to-cart, [data-action="add-to-cart"]')) {
                this.trackEvent('add_to_cart', 'ecommerce', {
                    product_name: this.getProductNameFromPage(),
                    product_category: this.getProductCategory(),
                    button_location: this.getElementSection(e.target)
                });
            }
        });
    }

    // Mobile-specific interactions
    setupMobileInteractions() {
        // Track mobile menu interactions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.mobile_menu_btn')) {
                this.trackEvent('mobile_menu_open', 'mobile_interaction', {
                    viewport_width: window.innerWidth,
                    is_mobile_device: this.isMobileDevice()
                });
            }
            
            if (e.target.closest('.close_btn')) {
                this.trackEvent('mobile_menu_close', 'mobile_interaction', {
                    viewport_width: window.innerWidth
                });
            }
        });

        // Track touch interactions on mobile
        if ('ontouchstart' in window) {
            document.addEventListener('touchstart', (e) => {
                this.trackEvent('touch_interaction', 'mobile_interaction', {
                    element_type: e.target.tagName.toLowerCase(),
                    viewport_width: window.innerWidth,
                    touch_count: e.touches.length
                });
            }, { passive: true });
        }

        // Track orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.trackEvent('orientation_change', 'mobile_interaction', {
                    new_orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
                    viewport_size: `${window.innerWidth}x${window.innerHeight}`
                });
            }, 100);
        });
    }

    // Contact information tracking
    setupContactTracking() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a');
            if (!target) return;

            const href = target.getAttribute('href');
            
            if (href && href.startsWith('tel:')) {
                this.trackEvent('phone_click', 'contact', {
                    phone_number: href.replace('tel:', ''),
                    link_text: target.textContent.trim(),
                    section: this.getElementSection(target)
                });
            }
            
            if (href && href.startsWith('mailto:')) {
                this.trackEvent('email_click', 'contact', {
                    email_address: href.replace('mailto:', ''),
                    link_text: target.textContent.trim(),
                    section: this.getElementSection(target)
                });
            }
        });
    }

    // Download tracking
    setupDownloadTracking() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (href && this.isDownloadLink(href)) {
                this.trackEvent('file_download', 'download', {
                    file_url: href,
                    file_type: this.getFileExtension(href),
                    link_text: link.textContent.trim(),
                    section: this.getElementSection(link)
                });
            }
        });
    }

    // Video tracking (if videos are present)
    setupVideoTracking() {
        const videos = document.querySelectorAll('video');
        videos.forEach((video, index) => {
            video.addEventListener('play', () => {
                this.trackEvent('video_play', 'media', {
                    video_id: video.id || `video_${index}`,
                    video_src: video.currentSrc,
                    section: this.getElementSection(video)
                });
            });

            video.addEventListener('pause', () => {
                this.trackEvent('video_pause', 'media', {
                    video_id: video.id || `video_${index}`,
                    current_time: video.currentTime,
                    duration: video.duration
                });
            });

            video.addEventListener('ended', () => {
                this.trackEvent('video_complete', 'media', {
                    video_id: video.id || `video_${index}`,
                    duration: video.duration
                });
            });
        });
    }

    // Error tracking
    setupErrorTracking() {
        window.addEventListener('error', (e) => {
            this.trackEvent('javascript_error', 'error', {
                error_message: e.message,
                error_source: e.filename,
                error_line: e.lineno,
                error_column: e.colno,
                user_agent: navigator.userAgent
            });
        });

        // Track 404 and other HTTP errors
        if (document.title.includes('404') || document.title.includes('Error')) {
            this.trackEvent('page_error', 'error', {
                error_type: '404',
                requested_url: window.location.href,
                referrer: document.referrer
            });
        }
    }

    // Page visibility tracking
    setupVisibilityTracking() {
        let visibilityStart = Date.now();
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                const visibleTime = Date.now() - visibilityStart;
                this.trackEvent('page_hidden', 'visibility', {
                    visible_time: visibleTime,
                    scroll_depth: Math.max(...this.scrollDepthReached, 0)
                });
            } else {
                visibilityStart = Date.now();
                this.trackEvent('page_visible', 'visibility', {
                    return_visit: true
                });
            }
        });
    }

    // Enhanced engagement timer
    startEngagementTimer() {
        // Track every 30 seconds for the first 5 minutes, then every minute
        const intervals = [30, 60, 120, 180, 300]; // seconds
        
        intervals.forEach(interval => {
            setTimeout(() => {
                if (!document.hidden) {
                    this.trackEvent('time_on_page', 'engagement', {
                        time_seconds: interval,
                        scroll_depth: Math.max(...this.scrollDepthReached, 0),
                        is_engaged: this.isEngaged,
                        engagement_events: this.engagementEvents.length
                    });
                }
            }, interval * 1000);
        });

        // Continue tracking every minute after 5 minutes
        setInterval(() => {
            if (!document.hidden) {
                const timeOnPage = Math.floor((Date.now() - this.sessionStart) / 1000);
                if (timeOnPage > 300 && timeOnPage % 60 === 0) {
                    this.trackEvent('extended_time_on_page', 'engagement', {
                        time_seconds: timeOnPage,
                        scroll_depth: Math.max(...this.scrollDepthReached, 0),
                        is_engaged: this.isEngaged
                    });
                }
            }
        }, 60000);
    }

    // Page unload tracking
    setupUnloadTracking() {
        window.addEventListener('beforeunload', () => {
            const sessionTime = Date.now() - this.sessionStart;
            
            // Use sendBeacon for reliable tracking on page unload
            this.trackEvent('page_unload', 'session', {
                session_duration: sessionTime,
                scroll_depth_max: Math.max(...this.scrollDepthReached, 0),
                engagement_events: this.engagementEvents.length,
                was_engaged: this.isEngaged
            }, true);
        });
        
        // Backup using pagehide event
        window.addEventListener('pagehide', () => {
            const sessionTime = Date.now() - this.sessionStart;
            
            this.trackEvent('session_end', 'session', {
                session_duration: sessionTime,
                final_scroll_position: window.pageYOffset,
                page_interactions: this.engagementEvents.length
            }, true);
        });
    }

    // Core tracking function
    trackEvent(eventName, category, parameters = {}, useBeacon = false) {
        // Add timestamp and session info to all events
        const eventData = {
            ...parameters,
            timestamp: new Date().toISOString(),
            session_id: this.getSessionId(),
            page_url: window.location.href,
            page_title: document.title,
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`
        };

        // Track with Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: category,
                custom_parameters: eventData
            });
        }

        // Console logging for debugging
        console.log(`📊 Analytics Event: ${eventName}`, eventData);

        // Store event for analysis
        this.engagementEvents.push({
            event: eventName,
            category: category,
            data: eventData,
            timestamp: Date.now()
        });

        // Send to custom analytics endpoint if needed
        if (useBeacon && navigator.sendBeacon) {
            navigator.sendBeacon('/api/analytics', JSON.stringify({
                event: eventName,
                category: category,
                data: eventData
            }));
        }
    }

    // Utility functions
    getUtmParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            utm_source: urlParams.get('utm_source'),
            utm_medium: urlParams.get('utm_medium'),
            utm_campaign: urlParams.get('utm_campaign'),
            utm_term: urlParams.get('utm_term'),
            utm_content: urlParams.get('utm_content')
        };
    }

    getElementSection(element) {
        // Determine which section of the page the element is in
        const sections = ['header', 'nav', 'main', 'aside', 'footer'];
        let currentElement = element;
        
        while (currentElement && currentElement !== document.body) {
            if (sections.includes(currentElement.tagName?.toLowerCase())) {
                return currentElement.tagName.toLowerCase();
            }
            
            // Check for common section classes
            const classList = currentElement.classList;
            if (classList?.contains('header')) return 'header';
            if (classList?.contains('footer')) return 'footer';
            if (classList?.contains('sidebar')) return 'sidebar';
            if (classList?.contains('main')) return 'main';
            if (classList?.contains('hero')) return 'hero';
            
            currentElement = currentElement.parentElement;
        }
        
        return 'unknown';
    }

    getProductCategory() {
        const path = window.location.pathname;
        if (path.includes('/prints/')) return 'prints';
        if (path.includes('/signs/')) return 'signs';
        if (path.includes('/promotional/')) return 'promotional';
        return 'unknown';
    }

    getProductNameFromPage() {
        return document.querySelector('h1')?.textContent?.trim() || document.title;
    }

    getCartItemCount() {
        const cartCounter = document.querySelector('.cart_counter');
        return cartCounter ? parseInt(cartCounter.textContent) || 0 : 0;
    }

    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    isDownloadLink(href) {
        const downloadExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.zip', '.rar', '.png', '.jpg', '.jpeg', '.gif'];
        return downloadExtensions.some(ext => href.toLowerCase().includes(ext));
    }

    getFileExtension(href) {
        return href.split('.').pop().toLowerCase();
    }

    getSessionId() {
        if (!sessionStorage.getItem('analytics_session_id')) {
            sessionStorage.setItem('analytics_session_id', 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
        }
        return sessionStorage.getItem('analytics_session_id');
    }
}

// Initialize analytics when script loads
document.addEventListener('DOMContentLoaded', () => {
    window.analyticsTracker = new AnalyticsTracker();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState !== 'loading') {
    window.analyticsTracker = new AnalyticsTracker();
} 