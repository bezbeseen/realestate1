function includeHTML() {
    var z, i, elmnt, file, xhttp;
    z = document.getElementsByTagName("*");
    var includesFoundThisIteration = false;
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
            includesFoundThisIteration = true;
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
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
    if (!includesFoundThisIteration) {
        // When all includes are finished, update the cart counter
        if (typeof Cart !== 'undefined' && typeof Cart.updateCartCounter === 'function') {
            Cart.updateCartCounter();
        }
    }
} 