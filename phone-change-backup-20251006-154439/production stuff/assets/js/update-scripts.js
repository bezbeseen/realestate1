// Function to update scripts in a page
function updateScripts() {
    // Find all elements with w3-include-html for scripts
    const scriptIncludes = document.querySelectorAll('[w3-include-html="/includes_new/scripts.html"]');
    
    // Replace each include with direct scripts
    scriptIncludes.forEach(include => {
        const scripts = `
            <!-- Fraimwork - Jquery Include -->
            <script src="/assets/js/jquery-3.5.1.min.js"></script>
            <script src="/assets/js/bootstrap.bundle.min.js"></script>

            <!-- animation - js include -->
            <script src="/assets/js/wow.min.js"></script>

            <!-- carousel - js include -->
            <script src="/assets/js/owl.carousel.min.js"></script>

            <!-- magnific popup - js include -->
            <script src="/assets/js/magnific-popup.min.js"></script>

            <!-- isotope - js include -->
            <script src="/assets/js/isotope.pkgd.js"></script>

            <!-- custom - js include -->
            <script src="/assets/js/app-initializer.js"></script>

            <!-- Cart and App Initializer -->
            <script src="/assets/js/cart.js"></script>
            <script src="/assets/js/cart-display.js"></script>
            <script src="/includes_new/breadcrumb-init.js"></script>
            <script src="/assets/js/include.js"></script>
            <script>
                includeHTML();
            </script>
        `;
        
        // Replace the include with the scripts
        include.outerHTML = scripts;
    });
}

// Run the update when the script loads
updateScripts(); 