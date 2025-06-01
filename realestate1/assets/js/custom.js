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
  console.log('setProductBackground called');
  
  const breadcrumbSection = document.querySelector('.breadcrumb_section');  
  console.log('Found breadcrumb section:', breadcrumbSection); 
  
  if (!breadcrumbSection) {
    console.log('No breadcrumb section found');   
    return;
  }
 
  // Get current page path and extract the page name
  const path = window.location.pathname;
  console.log('Current path:', path);
  
  // Split path and get the last segment
  const pathSegments = path.split('/').filter(segment => segment.length > 0);
  console.log('Path segments:', pathSegments);
  
  // Get the last segment and remove .html
  const pageName = pathSegments[pathSegments.length - 1].replace('.html', '');
  console.log('Page name:', pageName);

  // Find matching background or use default
  const backgroundImage = productBackgrounds[pageName] || productBackgrounds.default;
  console.log('Selected background:', backgroundImage);
  
  // Set the background image and styles
  breadcrumbSection.style.backgroundImage = `url(${backgroundImage})`;
  breadcrumbSection.style.backgroundSize = 'cover';
  breadcrumbSection.style.backgroundPosition = 'center';
  breadcrumbSection.style.position = 'relative';
  breadcrumbSection.style.minHeight = '400px';
  breadcrumbSection.style.display = 'flex';
  breadcrumbSection.style.alignItems = 'center';
  breadcrumbSection.style.zIndex = '1';
  
  // Remove any existing overlay
  const existingOverlay = breadcrumbSection.querySelector('.overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }

  // Add new overlay
  console.log('Adding overlay');
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.style.position = 'absolute';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.right = '0';
  overlay.style.bottom = '0';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
  overlay.style.zIndex = '-1';
  breadcrumbSection.insertBefore(overlay, breadcrumbSection.firstChild);

  // Ensure content is above overlay
  const container = breadcrumbSection.querySelector('.container');
  if (container) {
    container.style.position = 'relative';
    container.style.zIndex = '2';
  }

  console.log('Background setup complete');
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, setting up background and mobile menu');
  setProductBackground();
  initializeMobileMenu();
});

// Initialize mobile menu functionality
function initializeMobileMenu() {
  console.log('Initializing mobile menu');
  
  const mobileMenuBtn = document.querySelector('.mobile_menu_btn');
  const sidebarMenu = document.querySelector('.sidebar_mobile_menu');
  const menuWrapper = document.querySelector('.sidebar-menu-wrapper');
  const closeBtn = document.querySelector('.close_btn');
  const overlay = document.querySelector('.overlay');
  
  console.log('Mobile menu elements:', {
    mobileMenuBtn,
    sidebarMenu,
    menuWrapper,
    closeBtn,
    overlay
  });

  // Ensure mobile menu button is visible
  if (mobileMenuBtn) {
    mobileMenuBtn.style.display = 'block';
    mobileMenuBtn.style.position = 'relative';
    mobileMenuBtn.style.zIndex = '1000';
    
    mobileMenuBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Mobile menu button clicked');
      openMobileMenu();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Close button clicked');
      closeMobileMenu();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Overlay clicked');
      closeMobileMenu();
    });
  }

  function openMobileMenu() {
    console.log('Opening mobile menu');
    if (sidebarMenu) {
      sidebarMenu.classList.add('active');
      if (overlay) {
        overlay.classList.add('active');
        overlay.style.display = 'block';
      }
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileMenu() {
    console.log('Closing mobile menu');
    if (sidebarMenu) {
      sidebarMenu.classList.remove('active');
    }
    if (overlay) {
      overlay.classList.remove('active');
      overlay.style.display = 'none';
    }
    document.body.style.overflow = '';
  }

  // Handle dropdown menus
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  console.log('Found dropdown toggles:', dropdownToggles.length);
  
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Dropdown toggle clicked');
      
      const dropdownMenu = this.nextElementSibling;
      if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
        // Close other open dropdowns first
        const otherDropdowns = document.querySelectorAll('.dropdown-menu.show');
        otherDropdowns.forEach(menu => {
          if (menu !== dropdownMenu) {
            menu.classList.remove('show');
            menu.previousElementSibling.classList.remove('active');
          }
        });
        
        // Toggle current dropdown
        dropdownMenu.classList.toggle('show');
        this.classList.toggle('active');
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
      const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
      openDropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
        const toggle = dropdown.previousElementSibling;
        if (toggle) {
          toggle.classList.remove('active');
        }
      });
    }
  });
}

// Remove the jQuery mobile menu initialization since we're using vanilla JS
function initJQueryFeatures() {
  if (typeof jQuery === 'undefined') {
    setTimeout(initJQueryFeatures, 50);
    return;
  }

  (function($) {
    // nice select - start
    $(document).ready(function () {
      if ($('select').length > 0) {
        $('select').niceSelect();
      }
    });
    // nice select - end

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

    // Initialize functions
    stickyHeader();
  })(jQuery);
}

// Start checking for jQuery
initJQueryFeatures();  
