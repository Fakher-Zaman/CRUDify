fetch('loader.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('loaderContainer').innerHTML = html;
    });

function showLoader(containerId) {
    document.getElementById('loaderContainer').style.display = 'block';
    document.getElementById(containerId).style.display = 'none';
}

function hideLoader(containerId) {
    document.getElementById('loaderContainer').style.display = 'none';
    document.getElementById(containerId).style.display = 'block';
}
