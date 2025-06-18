/**
 * BE SEEN Search Functionality
 * Comprehensive search system for products, services, and pages
 */

class BeSEENSearch {
    constructor() {
        this.searchData = {
            products: [],
            categories: [],
            services: [],
            pages: []
        };
        this.currentResults = [];
        this.isLoading = false;
        
        this.init();
    }

    async init() {
        await this.loadSearchData();
        this.bindEvents();
        this.handlePageLoad();
    }

    async loadSearchData() {
        try {
            // Load products data
            const productsResponse = await fetch('/data/products.json');
            if (productsResponse.ok) {
                this.searchData.products = await productsResponse.json();
            }

            // Load categories data
            const categoriesResponse = await fetch('/data/categories.json');
            if (categoriesResponse.ok) {
                this.searchData.categories = await categoriesResponse.json();
            }

            // Add static services data
            this.searchData.services = [
                {
                    id: 'commercial-signage',
                    name: 'Commercial Signage',
                    description: 'Professional outdoor and indoor signage solutions for businesses',
                    url: '/services/commercial-signage.html',
                    keywords: ['signs', 'outdoor', 'indoor', 'commercial', 'business', 'signage']
                },
                {
                    id: 'graphic-design',
                    name: 'Graphic Design',
                    description: 'Creative design services for logos, branding, and marketing materials',
                    url: '/services/graphic-design.html',
                    keywords: ['design', 'logo', 'branding', 'creative', 'graphics', 'marketing']
                },
                {
                    id: 'web-design',
                    name: 'Web Design',
                    description: 'Professional website design and development services',
                    url: '/services/web-design.html',
                    keywords: ['website', 'web', 'online', 'development', 'digital', 'internet']
                },
                {
                    id: 'mailing',
                    name: 'Direct Mail Marketing',
                    description: 'Targeted direct mail campaigns and every door delivery services',
                    url: '/services/mailing.html',
                    keywords: ['mail', 'direct mail', 'marketing', 'delivery', 'postcards', 'campaigns']
                }
            ];

            // Add static pages data
            this.searchData.pages = [
                {
                    id: 'home',
                    name: 'Home',
                    description: 'BE SEEN - Professional printing, design, and marketing services',
                    url: '/index.html',
                    keywords: ['home', 'printing', 'design', 'marketing', 'be seen']
                },
                {
                    id: 'about',
                    name: 'About Us',
                    description: 'Learn about BE SEEN and our commitment to quality printing services',
                    url: '/about.html',
                    keywords: ['about', 'company', 'team', 'story', 'quality']
                },
                {
                    id: 'contact',
                    name: 'Contact',
                    description: 'Get in touch with BE SEEN for quotes and inquiries',
                    url: '/contact.html',
                    keywords: ['contact', 'phone', 'email', 'address', 'quote', 'inquiry']
                },
                {
                    id: 'real-estate',
                    name: 'Real Estate Marketing',
                    description: 'Specialized printing and marketing solutions for real estate professionals',
                    url: '/industries/real-estate.html',
                    keywords: ['real estate', 'realtor', 'property', 'marketing', 'signs', 'yard signs']
                }
            ];

            console.log('Search data loaded successfully');
        } catch (error) {
            console.error('Error loading search data:', error);
        }
    }

    bindEvents() {
        // Search form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.matches('.search-form, form[role="search"]')) {
                e.preventDefault();
                this.handleSearch(e.target);
            }
        });

        // Search input changes (for live search)
        document.addEventListener('input', (e) => {
            if (e.target.matches('input[name="q"], input[data-track="search_input"]')) {
                // Debounced live search could go here
                this.updateSearchSuggestions(e.target.value);
            }
        });

        // Sort dropdown changes
        const sortSelect = document.getElementById('sort_results');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortResults(e.target.value);
            });
        }

        // Search button clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.search_btn')) {
                // Track search button click
                this.trackEvent('search_button_opened');
            }
        });
    }

    handlePageLoad() {
        // Check if we're on the search results page
        if (window.location.pathname.includes('search-results')) {
            const urlParams = new URLSearchParams(window.location.search);
            const query = urlParams.get('q');
            
            if (query) {
                this.performSearch(query);
                // Update sidebar search input
                const sidebarInput = document.getElementById('sidebar_search_input');
                if (sidebarInput) {
                    sidebarInput.value = query;
                }
            } else {
                this.showNoResults();
            }
        }
    }

    handleSearch(form) {
        const formData = new FormData(form);
        const query = formData.get('q');
        
        if (!query || query.trim() === '') {
            return;
        }

        // Track search event
        this.trackEvent('search_performed', { search_term: query });

        // If we're not on search results page, navigate there
        if (!window.location.pathname.includes('search-results')) {
            window.location.href = `/search-results.html?q=${encodeURIComponent(query)}`;
            return;
        }

        // Perform search on current page
        this.performSearch(query);
    }

    async performSearch(query) {
        this.showLoading();
        this.updateSearchTerm(query);

        try {
            // Simulate slight delay for better UX
            await new Promise(resolve => setTimeout(resolve, 300));

            const results = this.searchAll(query);
            this.currentResults = results;
            this.displayResults(results);
            this.updateURL(query);

            // Track search results
            this.trackEvent('search_results_displayed', {
                search_term: query,
                results_count: results.length
            });

        } catch (error) {
            console.error('Search error:', error);
            this.showError();
        }
    }

    searchAll(query) {
        const results = [];
        const searchTerm = query.toLowerCase().trim();

        // Search products
        this.searchData.products.forEach(product => {
            const score = this.calculateRelevanceScore(searchTerm, {
                name: product.product_name || product.name || '',
                description: product.seo_description || product.description_short || '',
                keywords: [product.category, ...(product.keywords || [])],
                content: `${product.product_name} ${product.seo_description} ${product.category}`
            });

            if (score > 0) {
                results.push({
                    type: 'product',
                    id: product.id,
                    title: product.product_name || product.name,
                    description: product.seo_description || product.description_short || '',
                    url: `/${product.path}` || `/products/${product.category}/${product.id}/`,
                    price: product.product_details?.price ? `Starting at $${product.product_details.price}` : '',
                    category: this.getCategoryName(product.category),
                    image: product.product_image || product.hero_image_url || '/assets/images/placeholder.jpg',
                    score: score
                });
            }
        });

        // Search categories
        this.searchData.categories.forEach(category => {
            const score = this.calculateRelevanceScore(searchTerm, {
                name: category.category_name || '',
                description: category.seo_description || '',
                keywords: [category.id],
                content: `${category.category_name} ${category.seo_description}`
            });

            if (score > 0) {
                results.push({
                    type: 'category',
                    id: category.id,
                    title: category.category_name,
                    description: category.seo_description || '',
                    url: `/${category.path}`,
                    category: 'Category',
                    image: category.hero_image_url || '/assets/images/placeholder.jpg',
                    score: score
                });
            }
        });

        // Search services
        this.searchData.services.forEach(service => {
            const score = this.calculateRelevanceScore(searchTerm, {
                name: service.name,
                description: service.description,
                keywords: service.keywords || [],
                content: `${service.name} ${service.description}`
            });

            if (score > 0) {
                results.push({
                    type: 'service',
                    id: service.id,
                    title: service.name,
                    description: service.description,
                    url: service.url,
                    category: 'Service',
                    image: '/assets/images/services/default.jpg',
                    score: score
                });
            }
        });

        // Search pages
        this.searchData.pages.forEach(page => {
            const score = this.calculateRelevanceScore(searchTerm, {
                name: page.name,
                description: page.description,
                keywords: page.keywords || [],
                content: `${page.name} ${page.description}`
            });

            if (score > 0) {
                results.push({
                    type: 'page',
                    id: page.id,
                    title: page.name,
                    description: page.description,
                    url: page.url,
                    category: 'Page',
                    image: '/assets/images/pages/default.jpg',
                    score: score
                });
            }
        });

        // Sort by relevance score (highest first)
        return results.sort((a, b) => b.score - a.score);
    }

    calculateRelevanceScore(searchTerm, item) {
        let score = 0;
        const terms = searchTerm.split(' ').filter(term => term.length > 0);

        terms.forEach(term => {
            // Exact title match (highest score)
            if (item.name.toLowerCase().includes(term)) {
                score += item.name.toLowerCase() === term ? 100 : 50;
            }

            // Description match
            if (item.description.toLowerCase().includes(term)) {
                score += 25;
            }

            // Keywords match
            item.keywords.forEach(keyword => {
                if (keyword.toLowerCase().includes(term)) {
                    score += keyword.toLowerCase() === term ? 40 : 20;
                }
            });

            // General content match
            if (item.content.toLowerCase().includes(term)) {
                score += 10;
            }
        });

        return score;
    }

    displayResults(results) {
        const resultsContainer = document.getElementById('search_results');
        const noResultsDiv = document.getElementById('no_results');
        const loadingDiv = document.getElementById('search_loading');

        if (loadingDiv) loadingDiv.style.display = 'none';

        if (results.length === 0) {
            this.showNoResults();
            return;
        }

        if (noResultsDiv) noResultsDiv.style.display = 'none';
        this.updateResultsCount(results.length);

        if (!resultsContainer) return;

        resultsContainer.innerHTML = results.map(result => `
            <div class="search_result_item mb_30 wow fadeInUp2" data-wow-delay=".1s">
                <div class="row align-items-center">
                    <div class="col-lg-3 col-md-4">
                        <div class="result_image">
                            <img src="${result.image}" alt="${result.title}" onerror="this.src='/assets/images/placeholder.jpg'">
                            <span class="result_type">${result.type}</span>
                        </div>
                    </div>
                    <div class="col-lg-9 col-md-8">
                        <div class="result_content">
                            <div class="result_meta mb_10">
                                <span class="result_category">${result.category}</span>
                                ${result.price ? `<span class="result_price">${result.price}</span>` : ''}
                            </div>
                            <h3 class="result_title">
                                <a href="${result.url}">${result.title}</a>
                            </h3>
                            <p class="result_description">${result.description}</p>
                            <div class="result_actions">
                                <a href="${result.url}" class="custom_btn btn_sm bg_default_blue">
                                    ${result.type === 'product' ? 'View Product' : 'Learn More'}
                                    <span><i class="fal fa-arrow-right"></i></span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Initialize animations
        if (typeof WOW !== 'undefined') {
            new WOW().sync();
        }
    }

    sortResults(sortBy) {
        if (!this.currentResults.length) return;

        let sortedResults = [...this.currentResults];

        switch (sortBy) {
            case 'name':
                sortedResults.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'category':
                sortedResults.sort((a, b) => a.category.localeCompare(b.category));
                break;
            case 'relevance':
            default:
                sortedResults.sort((a, b) => b.score - a.score);
                break;
        }

        this.currentResults = sortedResults;
        this.displayResults(sortedResults);
    }

    showLoading() {
        const loadingDiv = document.getElementById('search_loading');
        const resultsContainer = document.getElementById('search_results');
        const noResultsDiv = document.getElementById('no_results');

        if (loadingDiv) loadingDiv.style.display = 'block';
        if (resultsContainer) resultsContainer.innerHTML = '';
        if (noResultsDiv) noResultsDiv.style.display = 'none';
    }

    showNoResults() {
        const loadingDiv = document.getElementById('search_loading');
        const resultsContainer = document.getElementById('search_results');
        const noResultsDiv = document.getElementById('no_results');

        if (loadingDiv) loadingDiv.style.display = 'none';
        if (resultsContainer) resultsContainer.innerHTML = '';
        if (noResultsDiv) noResultsDiv.style.display = 'block';
        
        this.updateResultsCount(0);
    }

    showError() {
        const resultsContainer = document.getElementById('search_results');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="alert alert-danger text-center">
                    <h4>Search Error</h4>
                    <p>Sorry, there was an error performing your search. Please try again.</p>
                </div>
            `;
        }
    }

    updateSearchTerm(query) {
        const searchTermDisplay = document.querySelector('.search_term_display');
        if (searchTermDisplay) {
            searchTermDisplay.textContent = `Results for "${query}"`;
        }
    }

    updateResultsCount(count) {
        const resultsCountSpan = document.querySelector('.results_count');
        if (resultsCountSpan) {
            resultsCountSpan.textContent = count;
        }
    }

    updateURL(query) {
        const newURL = `${window.location.pathname}?q=${encodeURIComponent(query)}`;
        window.history.replaceState({}, '', newURL);
    }

    getCategoryName(categoryId) {
        const category = this.searchData.categories.find(cat => cat.id === categoryId);
        return category ? category.category_name : categoryId;
    }

    updateSearchSuggestions(query) {
        // Future enhancement: could add live search suggestions
        // For now, just a placeholder
        if (query.length > 2) {
            // Could show dropdown with suggestions
        }
    }

    trackEvent(eventName, data = {}) {
        // Google Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'search',
                ...data
            });
        }

        // Custom tracking
        if (window.trackCustomEvent) {
            window.trackCustomEvent(eventName, data);
        }

        console.log('Search Event:', eventName, data);
    }
}

// Initialize search functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.beSEENSearch = new BeSEENSearch();
    console.log('🔍 BE SEEN Search System Initialized');
}); 