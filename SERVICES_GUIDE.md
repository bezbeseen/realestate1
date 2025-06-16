# Services Section Guide

This guide provides instructions on how to manage the services section of your website.

## Overview

The services section is built from a set of static HTML files located in the `dist/services/` directory. Each file represents a single service page and follows a consistent layout to ensure a uniform user experience.

## File Structure

All service pages are located in the following directory:

`dist/services/`

Each service has its own HTML file, for example:

*   `graphic-design.html`
*   `printing.html`
*   `web-design.html`

## Creating a New Service Page

To add a new service, follow these steps:

1.  **Create a new HTML file:** In the `dist/services/` directory, create a new HTML file for your new service. For example, if you are adding a "Content Creation" service, you would create a file named `content-creation.html`.
2.  **Use a template:** Copy the content from an existing service page, such as `dist/services/sign-installation.html`, and paste it into your new file. This will give you the correct layout and structure.
3.  **Update the content:** Modify the following sections in your new file:
    *   **Title and Meta Description:** Change the `<title>` and `<meta name="description">` tags in the `<head>` to reflect the new service.
    *   **Breadcrumbs:** Update the breadcrumb navigation to show the correct path.
    *   **Page Title:** Change the main `<h2>` title in the details section to the name of your new service.
    *   **Service Description:** Write a detailed description of the new service.
    *   **Sidebar Navigation:** Add a link to your new service page in the sidebar navigation list and set it as the active item.

## Updating the Main Navigation

After creating a new service page, you need to add it to the main navigation menu so that visitors can find it. The navigation menu is located in the `<header>` section of each page. You will need to update this section on all pages where the main navigation is present.

Here is an example of how to add a new service to the navigation menu:

```html
<li class="has_child">
    <a href="services.html">Services</a>  
    <ul class="submenu">
        <li><a href="/services/real-estate/">Real Estate</a></li>
        <li><a href="services/printing.html">Printing</a></li> 
        <li><a href="services/graphic-design.html">Graphic Design</a></li> 
        <li><a href="services/web-design.html">Web Design</a></li> 
        <li><a href="services/sign-permiting.html">Sign Permiting</a></li> 
        <li><a href="services/mailing.html">Mailing</a></li> 
        <li><a href="services/sign-installation.html">Sign Installation</a></li>
        <!-- Add your new service here -->
        <li><a href="services/content-creation.html">Content Creation</a></li> 
    </ul>
</li>
```

## Best Practices

*   **Images:** Use high-quality images that are relevant to the service. Keep image sizes optimized for the web to ensure fast loading times.
*   **Content:** Write clear, concise, and informative descriptions for each service. Use headings and lists to break up the text and make it easy to read.
*   **Consistency:** Maintain a consistent tone and style across all service pages to reinforce your brand identity. 