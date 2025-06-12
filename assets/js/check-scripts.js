// Function to check if a page has the required scripts
function checkScripts() {
    // Check for include.js
    const hasIncludeJS = document.querySelector('script[src="/assets/js/include.js"]');
    
    // Check for includeHTML() call
    const scripts = document.getElementsByTagName('script');
    let hasIncludeHTMLCall = false;
    for (let script of scripts) {
        if (script.textContent.includes('includeHTML()')) {
            hasIncludeHTMLCall = true;
            break;
        }
    }
    
    // Log the results
    console.log('Script Check Results:');
    console.log('include.js present:', !!hasIncludeJS);
    console.log('includeHTML() call present:', hasIncludeHTMLCall);
    
    if (!hasIncludeJS || !hasIncludeHTMLCall) {
        console.log('This page needs script updates!');
    }
}

// Run the check when the script loads
checkScripts(); 