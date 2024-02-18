fetch('loader.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('loaderContainer').innerHTML = html;
    });