// Function to update SEO include method
function updateSEOInclude() {
    // Find all elements with w3-include-html attribute
    const includes = document.querySelectorAll('[w3-include-html="/includes_new/seo.html"]');
    
    includes.forEach(include => {
        // Create new script element
        const script = document.createElement('script');
        script.textContent = `
            fetch('/includes_new/seo.html')
                .then(response => response.text())
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const seoContent = doc.querySelector('head').innerHTML;
                    document.head.insertAdjacentHTML('beforeend', seoContent);
                })
                .catch(error => console.error('Error loading SEO content:', error));
        `;
        
        // Replace the include div with the script
        include.parentNode.replaceChild(script, include);
    });
}

// Run the update when the DOM is loaded
document.addEventListener('DOMContentLoaded', updateSEOInclude); 