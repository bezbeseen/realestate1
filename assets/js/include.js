function includeHTML() {
    console.log("Starting includeHTML function");
    var z, i, elmnt, file, xhttp;
    z = document.getElementsByTagName("*");
    console.log("Found elements:", z.length);
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
            console.log("Found include:", file);
            if (file === "/includes_new/seo.html") {
                console.log("Processing SEO include");
                // Special handling for SEO content
                fetch(file)
                    .then(response => {
                        console.log("SEO fetch response:", response.status);
                        return response.text();
                    })
                    .then(html => {
                        console.log("SEO content received");
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        const seoContent = doc.querySelector('head').innerHTML;
                        console.log("SEO content parsed:", seoContent);
                        document.head.insertAdjacentHTML('beforeend', seoContent);
                        elmnt.remove(); // Remove the include div after processing
                        console.log("SEO content inserted");
                    })
                    .catch(error => console.error('Error loading SEO content:', error));
            } else {
                console.log("Processing regular include:", file);
                // Regular include handling
                xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4) {
                        console.log("Include response:", this.status, file);
                        if (this.status == 200) {elmnt.innerHTML = this.responseText;}
                        if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
                        elmnt.removeAttribute("w3-include-html");
                        includeHTML();
                    }
                }
                xhttp.open("GET", file, true);
                xhttp.send();
                return;
            }
        }
    }
} 