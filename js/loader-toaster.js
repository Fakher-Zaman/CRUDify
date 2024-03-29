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

function showToast(type, message) {
    var toast = document.getElementById("toast");
    toast.innerText = message;
    toast.className = "toast " + type;
    toast.classList.remove("hide");
    toast.classList.add("show");
    setTimeout(function () {
        toast.classList.remove("show");
        toast.classList.add("hide");
    }, 3000);
}
