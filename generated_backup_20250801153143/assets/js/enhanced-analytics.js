/**
 * Enhanced Analytics for BeSeen - Printing Business Specific Tracking
 * Extends the base analytics tracker with business-specific events
 */

class BeSeenAnalytics {
    constructor() {
        this.heatmapData = [];
        this.productInteractions = {};
        this.leadScoringEvents = [];
        this.conversionFunnelData = {};
        this.competitorAnalysis = [];
        this.seasonalTrends = {};
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupBusinessTracking());
        } else {
            this.setupBusinessTracking();
        }
    }

    setupBusinessTracking() {
        console.log('🎯 BeSeen Enhanced Analytics Initialized');
        
        // Business-specific tracking
        this.setupProductInterestTracking();
        this.setupQuoteRequestTracking();
        this.setupServiceInquiryTracking();
        this.setupCompetitiveAnalysis();
        this.setupLeadScoringTracking();
        this.setupPrintingSpecificEvents();
        this.setupBusinessHoursTracking();
        this.setupLocationBasedTracking();
        this.setupHeatmapTracking();
        this.setupConversionFunnelTracking();
        this.setupReturningCustomerTracking();
        this.setupPrintJobCalculatorTracking();
        this.setupBusinessCardDesignerTracking();
        this.setupBulkOrderTracking();
        this.setupUrgentOrderTracking();
        this.setupCustomizationTracking();
        this.setupPriceComparisonTracking();
        
        // Set up real-time analytics dashboard if in development
        if (window.location.hostname === 'localhost' || window.location.hostname.includes('dev')) {
            this.setupAnalyticsDashboard();
        }
    }

    // Track specific product interest and engagement
    setupProductInterestTracking() {
        // Track time spent on product pages
        if (window.location.pathname.includes('/products/')) {
            const productCategory = this.getProductCategory();
            const productName = this.getProductName();
            let timeSpent = 0;
            const startTime = Date.now();

            // Track detailed product viewing behavior
            const trackProductEngagement = () => {
                timeSpent = Date.now() - startTime;
                this.trackBusinessEvent('product_deep_engagement', {
                    product_category: productCategory,
                    product_name: productName,
                    time_spent_seconds: Math.floor(timeSpent / 1000),
                    scroll_depth: this.getCurrentScrollDepth(),
                    interactions: this.getProductPageInteractions()
                });
            };

            // Track after 30 seconds of engagement
            setTimeout(trackProductEngagement, 30000);
            
            // Track on page exit
            window.addEventListener('beforeunload', trackProductEngagement);
        }

        // Track product comparison behavior
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-product-compare], .compare-product')) {
                this.trackBusinessEvent('product_comparison_started', {
                    primary_product: this.getProductName(),
                    comparison_type: e.target.dataset.compareType || 'general'
                });
            }
        });

        // Track product image interactions
        document.addEventListener('click', (e) => {
            if (e.target.matches('.product-image, .gallery-image, [data-product-image]')) {
                this.trackBusinessEvent('product_image_engagement', {
                    product_name: this.getProductName(),
                    image_type: e.target.alt || 'product_image',
                    image_position: this.getImagePosition(e.target)
                });
            }
        });

        // Track product specifications viewing
        document.addEventListener('click', (e) => {
            if (e.target.matches('.specs-tab, .specifications, [data-specs]')) {
                this.trackBusinessEvent('product_specifications_viewed', {
                    product_name: this.getProductName(),
                    specs_section: e.target.textContent.trim()
                });
            }
        });
    }

    // Track quote requests and lead generation
    setupQuoteRequestTracking() {
        // Track quote button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.quote-btn, .get-quote, [data-action="quote"]')) {
                this.trackBusinessEvent('quote_request_initiated', {
                    product_category: this.getProductCategory(),
                    product_name: this.getProductName(),
                    page_location: window.location.pathname,
                    time_on_site: this.getTimeOnSite(),
                    previous_pages: this.getPreviousPages()
                });

                // Start tracking quote funnel
                this.startQuoteFunnelTracking();
            }
        });

        // Track quote form interactions
        document.addEventListener('input', (e) => {
            if (e.target.closest('.quote-form, [data-form="quote"]')) {
                const formData = this.getQuoteFormData(e.target.closest('form'));
                this.trackBusinessEvent('quote_form_progress', {
                    field_name: e.target.name,
                    completion_percentage: this.calculateFormCompletion(formData),
                    product_interest: formData.product || this.getProductName(),
                    quantity_range: formData.quantity || 'unknown'
                });
            }
        });

        // Track quote form abandonment
        document.addEventListener('focusout', (e) => {
            if (e.target.closest('.quote-form')) {
                setTimeout(() => {
                    if (!document.querySelector('.quote-form:focus-within')) {
                        this.trackBusinessEvent('quote_form_abandoned', {
                            completion_percentage: this.calculateFormCompletion(
                                this.getQuoteFormData(e.target.closest('form'))
                            ),
                            last_field: e.target.name,
                            time_spent: this.getFormTimeSpent(e.target.closest('form'))
                        });
                    }
                }, 5000);
            }
        });
    }

    // Track service inquiry patterns
    setupServiceInquiryTracking() {
        const servicePages = ['/services/', '/commercial-signage', '/graphic-design', '/web-design'];
        
        if (servicePages.some(page => window.location.pathname.includes(page))) {
            this.trackBusinessEvent('service_page_visit', {
                service_type: this.getServiceType(),
                referrer_type: this.getReferrerType(),
                time_of_day: new Date().getHours(),
                day_of_week: new Date().getDay()
            });

            // Track service-specific interactions
            document.addEventListener('click', (e) => {
                if (e.target.matches('.service-cta, .learn-more, [data-service-action]')) {
                    this.trackBusinessEvent('service_inquiry_action', {
                        service_type: this.getServiceType(),
                        action_type: e.target.dataset.serviceAction || 'learn_more',
                        cta_text: e.target.textContent.trim()
                    });
                }
            });
        }
    }

    // Competitive analysis tracking
    setupCompetitiveAnalysis() {
        // Track if users came from competitor searches
        const referrer = document.referrer.toLowerCase();
        const competitors = ['vistaprint', 'staples', 'fedex', 'ups', 'printful', 'printify'];
        
        competitors.forEach(competitor => {
            if (referrer.includes(competitor)) {
                this.trackBusinessEvent('competitor_referral', {
                    competitor_name: competitor,
                    landing_page: window.location.pathname,
                    search_terms: this.getSearchTermsFromReferrer(referrer)
                });
            }
        });

        // Track price comparison behavior
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-price], .price, .pricing')) {
                this.trackBusinessEvent('price_interest', {
                    product_type: this.getProductName(),
                    price_element: e.target.textContent.trim(),
                    page_context: this.getPageContext()
                });
            }
        });
    }

    // Lead scoring based on behavior
    setupLeadScoringTracking() {
        let leadScore = 0;
        const scoreEvents = {
            'product_view': 1,
            'service_page_visit': 2,
            'quote_request_initiated': 10,
            'contact_info_click': 5,
            'multiple_products_viewed': 3,
            'return_visitor': 2,
            'business_hours_visit': 1,
            'urgent_order_interest': 8,
            'bulk_order_interest': 6
        };

        // Calculate and track lead score
        const updateLeadScore = (eventType) => {
            leadScore += scoreEvents[eventType] || 0;
            
            if (leadScore >= 15) { // High-intent threshold
                this.trackBusinessEvent('high_intent_lead', {
                    lead_score: leadScore,
                    key_events: this.leadScoringEvents,
                    time_to_high_intent: this.getTimeOnSite(),
                    pages_visited: this.getUniquePageViews()
                });
            }
        };

        // Override the original track event to include lead scoring
        const originalTrackEvent = window.analyticsTracker?.trackEvent;
        if (originalTrackEvent) {
            window.analyticsTracker.trackEvent = function(eventName, category, parameters, useBeacon) {
                updateLeadScore(eventName);
                return originalTrackEvent.call(this, eventName, category, parameters, useBeacon);
            };
        }
    }

    // Printing business specific events
    setupPrintingSpecificEvents() {
        // Track file upload intentions
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-upload], .upload-file, .file-upload')) {
                this.trackBusinessEvent('file_upload_initiated', {
                    product_context: this.getProductName(),
                    upload_type: e.target.dataset.uploadType || 'general'
                });
            }
        });

        // Track quantity selector interactions
        document.addEventListener('change', (e) => {
            if (e.target.matches('[name="quantity"], .quantity-selector')) {
                const quantity = parseInt(e.target.value);
                let orderType = 'small';
                if (quantity > 100) orderType = 'medium';
                if (quantity > 500) orderType = 'large';
                if (quantity > 1000) orderType = 'bulk';

                this.trackBusinessEvent('quantity_selection', {
                    product_name: this.getProductName(),
                    quantity: quantity,
                    order_type: orderType,
                    estimated_value: this.estimateOrderValue(quantity)
                });
            }
        });

        // Track material/finish selections
        document.addEventListener('change', (e) => {
            if (e.target.matches('[name*="material"], [name*="finish"], [name*="paper"]')) {
                this.trackBusinessEvent('material_selection', {
                    product_name: this.getProductName(),
                    material_type: e.target.value,
                    premium_option: this.isPremiumOption(e.target.value)
                });
            }
        });

        // Track turnaround time preferences
        document.addEventListener('click', (e) => {
            if (e.target.matches('.turnaround-option, [data-turnaround]')) {
                const turnaround = e.target.dataset.turnaround || e.target.textContent;
                this.trackBusinessEvent('turnaround_preference', {
                    product_name: this.getProductName(),
                    turnaround_time: turnaround,
                    rush_order: turnaround.includes('rush') || turnaround.includes('24')
                });
            }
        });
    }

    // Track business hours behavior
    setupBusinessHoursTracking() {
        const currentHour = new Date().getHours();
        const isBusinessHours = currentHour >= 8 && currentHour <= 18;
        const dayOfWeek = new Date().getDay();
        const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

        this.trackBusinessEvent('visit_timing', {
            hour: currentHour,
            is_business_hours: isBusinessHours,
            is_weekday: isWeekday,
            timing_category: this.getTimingCategory(currentHour, isWeekday)
        });

        // Track after-hours contact attempts
        if (!isBusinessHours || !isWeekday) {
            document.addEventListener('click', (e) => {
                if (e.target.matches('[href^="tel:"], [href^="mailto:"], .contact-btn')) {
                    this.trackBusinessEvent('after_hours_contact_attempt', {
                        contact_method: e.target.getAttribute('href')?.split(':')[0] || 'unknown',
                        hour: currentHour,
                        day: dayOfWeek
                    });
                }
            });
        }
    }

    // Location-based tracking
    setupLocationBasedTracking() {
        // Track local business searches
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('q') || urlParams.get('search');
        
        if (searchQuery && this.isLocalSearchQuery(searchQuery)) {
            this.trackBusinessEvent('local_search_visit', {
                search_query: searchQuery,
                location_terms: this.extractLocationTerms(searchQuery)
            });
        }

        // Get user's approximate location (if permissions allow)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const distance = this.calculateDistanceToSantaClara(
                    position.coords.latitude, 
                    position.coords.longitude
                );
                
                this.trackBusinessEvent('location_context', {
                    distance_to_store: distance,
                    is_local_customer: distance < 50, // within 50 miles
                    coordinates_provided: true
                });
            }, () => {
                this.trackBusinessEvent('location_context', {
                    coordinates_provided: false
                });
            });
        }
    }

    // Heat mapping for click tracking
    setupHeatmapTracking() {
        document.addEventListener('click', (e) => {
            const rect = e.target.getBoundingClientRect();
            const heatmapPoint = {
                x: e.clientX,
                y: e.clientY,
                elementType: e.target.tagName.toLowerCase(),
                elementClass: e.target.className,
                elementText: e.target.textContent.slice(0, 50),
                timestamp: Date.now(),
                page: window.location.pathname,
                viewport: `${window.innerWidth}x${window.innerHeight}`
            };

            this.heatmapData.push(heatmapPoint);

            // Send heatmap data periodically
            if (this.heatmapData.length >= 10) {
                this.trackBusinessEvent('heatmap_batch', {
                    clicks: this.heatmapData.splice(0, 10)
                });
            }
        });

        // Send remaining heatmap data on page unload
        window.addEventListener('beforeunload', () => {
            if (this.heatmapData.length > 0) {
                this.trackBusinessEvent('heatmap_final', {
                    clicks: this.heatmapData
                });
            }
        });
    }

    // Conversion funnel tracking
    setupConversionFunnelTracking() {
        const funnelSteps = {
            'landing': 1,
            'product_view': 2,
            'customization': 3,
            'quote_request': 4,
            'contact_info': 5,
            'order_placed': 6
        };

        Object.keys(funnelSteps).forEach(step => {
            if (this.isInFunnelStep(step)) {
                this.trackBusinessEvent('funnel_progression', {
                    step: step,
                    step_number: funnelSteps[step],
                    time_to_step: this.getTimeOnSite(),
                    session_pages: this.getSessionPageCount()
                });
            }
        });
    }

    // Track returning customer behavior
    setupReturningCustomerTracking() {
        const visitCount = this.getVisitCount();
        const lastVisit = this.getLastVisitDate();
        
        if (visitCount > 1) {
            this.trackBusinessEvent('returning_customer', {
                visit_count: visitCount,
                days_since_last_visit: this.getDaysSinceLastVisit(lastVisit),
                customer_type: this.getCustomerType(visitCount),
                previous_orders: this.getPreviousOrderHistory()
            });
        }

        // Track loyalty indicators
        if (visitCount >= 5) {
            this.trackBusinessEvent('loyal_customer_visit', {
                visit_count: visitCount,
                engagement_level: this.calculateEngagementLevel()
            });
        }
    }

    // Print job calculator tracking
    setupPrintJobCalculatorTracking() {
        document.addEventListener('input', (e) => {
            if (e.target.closest('.calculator, [data-calculator]')) {
                const calculatorData = this.getCalculatorInputs(e.target.closest('.calculator, [data-calculator]'));
                
                this.trackBusinessEvent('calculator_usage', {
                    calculator_type: calculatorData.type,
                    inputs: calculatorData.inputs,
                    estimated_cost: calculatorData.estimatedCost,
                    field_changed: e.target.name
                });
            }
        });
    }

    // Business card designer tracking
    setupBusinessCardDesignerTracking() {
        if (window.location.pathname.includes('business-cards') || 
            document.querySelector('.card-designer, [data-designer]')) {
            
            document.addEventListener('click', (e) => {
                if (e.target.matches('.design-template, .template-option')) {
                    this.trackBusinessEvent('template_selection', {
                        template_id: e.target.dataset.templateId,
                        template_style: e.target.dataset.style,
                        is_premium: e.target.dataset.premium === 'true'
                    });
                }

                if (e.target.matches('.color-option, .font-option, .layout-option')) {
                    this.trackBusinessEvent('design_customization', {
                        customization_type: e.target.dataset.type,
                        customization_value: e.target.dataset.value,
                        design_session_time: this.getDesignSessionTime()
                    });
                }
            });
        }
    }

    // Bulk order tracking
    setupBulkOrderTracking() {
        document.addEventListener('change', (e) => {
            if (e.target.matches('[name="quantity"]')) {
                const quantity = parseInt(e.target.value);
                if (quantity >= 500) {
                    this.trackBusinessEvent('bulk_order_interest', {
                        product_name: this.getProductName(),
                        quantity: quantity,
                        bulk_tier: this.getBulkTier(quantity),
                        potential_revenue: this.estimateRevenue(quantity)
                    });
                }
            }
        });
    }

    // Urgent order tracking
    setupUrgentOrderTracking() {
        const urgentKeywords = ['rush', 'urgent', 'asap', '24 hour', 'same day', 'emergency'];
        
        document.addEventListener('input', (e) => {
            if (e.target.matches('textarea, input[type="text"]')) {
                const inputText = e.target.value.toLowerCase();
                const hasUrgentKeywords = urgentKeywords.some(keyword => 
                    inputText.includes(keyword)
                );

                if (hasUrgentKeywords) {
                    this.trackBusinessEvent('urgent_order_indicated', {
                        keywords_used: urgentKeywords.filter(keyword => 
                            inputText.includes(keyword)
                        ),
                        field_type: e.target.type,
                        product_context: this.getProductName()
                    });
                }
            }
        });
    }

    // Customization tracking
    setupCustomizationTracking() {
        const customizationEvents = [
            'change', 'input', 'click'
        ];

        customizationEvents.forEach(eventType => {
            document.addEventListener(eventType, (e) => {
                if (e.target.matches('.customize, [data-customize], .option-selector')) {
                    this.trackBusinessEvent('product_customization', {
                        customization_type: e.target.name || e.target.dataset.customize,
                        customization_value: e.target.value || e.target.textContent,
                        product_name: this.getProductName(),
                        customization_step: this.getCustomizationStep()
                    });
                }
            });
        });
    }

    // Price comparison tracking
    setupPriceComparisonTracking() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.price-compare, [data-compare-price]')) {
                this.trackBusinessEvent('price_comparison_interest', {
                    product_name: this.getProductName(),
                    comparison_type: e.target.dataset.comparePrice || 'general',
                    current_price_visible: document.querySelector('.price')?.textContent || 'unknown'
                });
            }
        });

        // Track time spent looking at pricing sections
        const priceElements = document.querySelectorAll('.price, .pricing, [data-price]');
        priceElements.forEach(element => {
            let viewStartTime;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        viewStartTime = Date.now();
                    } else if (viewStartTime) {
                        const viewTime = Date.now() - viewStartTime;
                        if (viewTime > 3000) { // More than 3 seconds
                            this.trackBusinessEvent('price_section_engagement', {
                                view_time: viewTime,
                                price_element: entry.target.textContent.trim(),
                                product_context: this.getProductName()
                            });
                        }
                    }
                });
            });
            
            observer.observe(element);
        });
    }

    // Real-time analytics dashboard (for development)
    setupAnalyticsDashboard() {
        const dashboard = document.createElement('div');
        dashboard.id = 'analytics-dashboard';
        dashboard.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 300px;
            max-height: 400px;
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            overflow-y: auto;
            display: none;
        `;

        const toggle = document.createElement('button');
        toggle.textContent = '📊';
        toggle.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 10001;
            background: #007cba;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
        `;

        toggle.addEventListener('click', () => {
            dashboard.style.display = dashboard.style.display === 'none' ? 'block' : 'none';
        });

        document.body.appendChild(dashboard);
        document.body.appendChild(toggle);

        // Update dashboard with real-time data
        setInterval(() => {
            if (dashboard.style.display === 'block') {
                dashboard.innerHTML = this.generateDashboardHTML();
            }
        }, 2000);

        // Add keyboard shortcut (Ctrl+Alt+A)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.altKey && e.key === 'a') {
                dashboard.style.display = dashboard.style.display === 'none' ? 'block' : 'none';
            }
        });
    }

    // Generate dashboard HTML
    generateDashboardHTML() {
        const analytics = window.analyticsTracker?.engagementEvents || [];
        const recentEvents = analytics.slice(-10);
        
        return `
            <h3>🎯 BeSeen Analytics Dashboard</h3>
            <div><strong>Total Events:</strong> ${analytics.length}</div>
            <div><strong>Session Time:</strong> ${Math.floor((Date.now() - this.getSessionStart()) / 1000)}s</div>
            <div><strong>Page:</strong> ${window.location.pathname}</div>
            <div><strong>Lead Score:</strong> ${this.calculateCurrentLeadScore()}</div>
            
            <h4>Recent Events:</h4>
            ${recentEvents.map(event => `
                <div style="margin: 5px 0; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 3px;">
                    <strong>${event.event}</strong><br>
                    <small>${event.category} • ${new Date(event.timestamp).toLocaleTimeString()}</small>
                </div>
            `).join('')}
        `;
    }

    // Core business event tracking
    trackBusinessEvent(eventName, parameters = {}) {
        // Enhance with business context
        const businessData = {
            ...parameters,
            business_context: {
                is_business_hours: this.isBusinessHours(),
                customer_type: this.getCustomerType(),
                lead_score: this.calculateCurrentLeadScore(),
                session_value: this.calculateSessionValue(),
                geographic_context: this.getGeographicContext()
            }
        };

        // Use the main analytics tracker
        if (window.analyticsTracker) {
            window.analyticsTracker.trackEvent(eventName, 'business', businessData);
        }

        // Also log to console for debugging
        console.log(`🎯 Business Event: ${eventName}`, businessData);
    }

    // Utility functions for business tracking
    getProductCategory() {
        const path = window.location.pathname;
        if (path.includes('/prints/')) return path.split('/prints/')[1]?.split('/')[0] || 'prints';
        if (path.includes('/signs/')) return path.split('/signs/')[1]?.split('/')[0] || 'signs';
        if (path.includes('/promotional/')) return path.split('/promotional/')[1]?.split('/')[0] || 'promotional';
        return 'unknown';
    }

    getProductName() {
        return document.querySelector('h1')?.textContent?.trim() || 
               document.title.split('|')[0]?.trim() || 
               'Unknown Product';
    }

    getServiceType() {
        const path = window.location.pathname;
        if (path.includes('/commercial-signage')) return 'commercial_signage';
        if (path.includes('/graphic-design')) return 'graphic_design';
        if (path.includes('/web-design')) return 'web_design';
        if (path.includes('/mailing')) return 'mailing';
        return 'general_service';
    }

    getCurrentScrollDepth() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        return Math.round((scrollTop / docHeight) * 100);
    }

    getTimeOnSite() {
        return Date.now() - this.getSessionStart();
    }

    getSessionStart() {
        return window.analyticsTracker?.sessionStart || Date.now();
    }

    calculateCurrentLeadScore() {
        // Implement lead scoring logic
        return Math.floor(Math.random() * 50); // Placeholder
    }

    calculateSessionValue() {
        // Calculate potential session value based on products viewed and actions taken
        const events = window.analyticsTracker?.engagementEvents || [];
        let value = 0;
        
        events.forEach(event => {
            if (event.event.includes('product_view')) value += 5;
            if (event.event.includes('quote_request')) value += 50;
            if (event.event.includes('contact')) value += 25;
            if (event.event.includes('bulk_order')) value += 100;
        });
        
        return value;
    }

    isBusinessHours() {
        const hour = new Date().getHours();
        const day = new Date().getDay();
        return day >= 1 && day <= 5 && hour >= 8 && hour <= 18;
    }

    getCustomerType() {
        const visitCount = this.getVisitCount();
        if (visitCount === 1) return 'new';
        if (visitCount <= 3) return 'returning';
        return 'loyal';
    }

    getVisitCount() {
        const visits = localStorage.getItem('beseen_visit_count') || '1';
        const count = parseInt(visits) + 1;
        localStorage.setItem('beseen_visit_count', count.toString());
        return count;
    }

    getGeographicContext() {
        // Placeholder for geographic context
        return {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language
        };
    }

    // Additional utility methods would continue here...
    // (Implementing remaining utility methods for completeness)
    
    getProductPageInteractions() {
        return document.querySelectorAll('.product-option:checked, .selected').length;
    }

    getImagePosition(img) {
        const allImages = Array.from(document.querySelectorAll('img'));
        return allImages.indexOf(img) + 1;
    }

    startQuoteFunnelTracking() {
        sessionStorage.setItem('quote_funnel_start', Date.now().toString());
    }

    getQuoteFormData(form) {
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        return data;
    }

    calculateFormCompletion(formData) {
        const totalFields = Object.keys(formData).length;
        const filledFields = Object.values(formData).filter(val => val && val.trim()).length;
        return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
    }

    getReferrerType() {
        const referrer = document.referrer.toLowerCase();
        if (referrer.includes('google')) return 'google_search';
        if (referrer.includes('bing')) return 'bing_search';
        if (referrer.includes('facebook')) return 'facebook';
        if (referrer.includes('instagram')) return 'instagram';
        return referrer ? 'other_website' : 'direct';
    }

    isLocalSearchQuery(query) {
        const localTerms = ['santa clara', 'san jose', 'bay area', 'california', 'near me', 'local'];
        return localTerms.some(term => query.toLowerCase().includes(term));
    }

    extractLocationTerms(query) {
        const localTerms = ['santa clara', 'san jose', 'bay area', 'california', 'near me', 'local'];
        return localTerms.filter(term => query.toLowerCase().includes(term));
    }

    calculateDistanceToSantaClara(lat, lon) {
        // Santa Clara coordinates (approximate)
        const santaClaraLat = 37.3541;
        const santaClaraLon = -121.9552;
        
        const R = 3959; // Earth's radius in miles
        const dLat = (santaClaraLat - lat) * Math.PI / 180;
        const dLon = (santaClaraLon - lon) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat * Math.PI / 180) * Math.cos(santaClaraLat * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return Math.round(R * c);
    }
}

// Initialize enhanced analytics
document.addEventListener('DOMContentLoaded', () => {
    window.beSeenAnalytics = new BeSeenAnalytics();
});

if (document.readyState !== 'loading') {
    window.beSeenAnalytics = new BeSeenAnalytics();
} 