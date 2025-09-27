// Determine the correct path for products pages vs root pages
const pathPrefix = window.location.pathname.includes('/products/') ? '../' : '';

// Header
fetch(`${pathPrefix}components/header.html`)
.then(response => response.text())
.then(html => {
    // Replace links dynamically so "../" works for products pages
    html = html.replace(/href="([^"]+)"/g, (match, p1) => {
    return `href="${pathPrefix}${p1}"`;
    });
    html = html.replace(/src="([^"]+)"/g, (match, p1) => {
    return `src="${pathPrefix}${p1}"`;
    });

    document.getElementById('header-placeholder').innerHTML = html;

    // Initialize hamburger menu
    const hamburger = document.createElement('div');
    hamburger.classList.add('hamburger');
    hamburger.innerHTML = '&#9776;';
    document.querySelector('.header-content').prepend(hamburger);

    hamburger.addEventListener('click', () => {
    document.querySelector('nav').classList.toggle('active');
    });
});

// Footer
fetch(`${pathPrefix}components/footer.html`)
.then(response => response.text())
.then(html => {
    // Replace links and src attributes dynamically so "../" works for products pages
    html = html.replace(/href="([^"]+)"/g, (match, p1) => {
    return `href="${pathPrefix}${p1}"`;
    });
    html = html.replace(/src="([^"]+)"/g, (match, p1) => {
    return `src="${pathPrefix}${p1}"`;
    });

    // Insert the processed HTML into the container
    document.getElementById('footer-container').innerHTML = html;
})
.catch(err => console.error('Error loading footer:', err));