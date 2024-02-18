const userImgInput = document.getElementById('image');
const userFNameInput = document.getElementById('firstName');
const userLNameInput = document.getElementById('lastName');
const userPhoneInput = document.getElementById('phone');
const userEmailInput = document.getElementById('email');
const userAddressInput = document.getElementById('address');
const userBirthDateInput = document.getElementById('birthDate');
const userAgeInput = document.getElementById('age');
const userGenderInput = document.getElementById('gender');
const display = document.querySelector("#display-users");
const userCountDisplay = document.getElementById('user-count');

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

function showLoader() {
    document.getElementById('loaderContainer').style.display = 'block';
    document.getElementById('add-section').style.display = 'none';
}

function hideLoader() {
    document.getElementById('loaderContainer').style.display = 'none';
    document.getElementById('add-section').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function () {
    showLoader();
    setTimeout(function () {
        displayUsers();
        hideLoader();
    }, 1000);
});

function displayUsers() {
    const localUsers = JSON.parse(localStorage.getItem('users')) || [];
    const deletedUsers = JSON.parse(localStorage.getItem('deleted-users')) || [];
    const updatedUsers = JSON.parse(localStorage.getItem('updated-users')) || [];

    // Update existing users with updated data
    localUsers.forEach(user => {
        const updatedUser = updatedUsers.find(updatedUser => updatedUser.id === user.id);
        if (updatedUser) {
            Object.assign(user, updatedUser);
        }
    });

    // Filter out deleted users
    const activeUsers = localUsers.filter(user => !deletedUsers.some(deletedUser => deletedUser.id === user.id));
    localStorage.setItem('users', JSON.stringify(activeUsers));
    userCountDisplay.innerHTML = `Locating ${activeUsers.length} User Accounts`;

    let dataDisplay = activeUsers.map((user) => {
        const { id, image, address, phone, age, firstName, lastName, email, gender, birthDate } = user;

        return `
        <div class="get-users" data-user-id="${id}">
            <div class="part1-info">
                <img src="${image}" alt="img" width="50" height="auto">
                <div class="contact-info">
                    <p><span>${phone}</span><i class="fa-solid fa-square-phone-flip"></i></p>
                    <p><span>${email}</span><i class="fa-solid fa-square-envelope"></i></p>
                </div>
            </div>
            <div class="part2-info">
                <p><i class="fa-solid fa-user"></i><span>${firstName} ${lastName}</span></p>
                <p><i class="fa-solid fa-cake-candles"></i><span>${birthDate}</span></p>
                <p><i class="fa-solid fa-location-dot"></i><span>${address.address}</span></p>
            </div>
            <div class="part3-info">
                <p><span>Gender:</span>${gender}</p>
                <p><span>Age:</span>${age}</p>
            </div>
            <div class="part4-btns">
                <button id="edit" class="edit" type="button">Edit</button>
                <button id="delete" class="delete" type="button" style="margin-left: 10px;">Delete</button>
            </div>
        </div>
        `;
    }).join("");

    display.innerHTML = dataDisplay;
}

function addUser(e) {
    e.preventDefault();
    // console.log("Add User Here");
    let users = JSON.parse(localStorage.getItem('users')) || [];

    const address = {
        address: userAddressInput.value
    };

    fetch('https://dummyjson.com/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            image: userImgInput.value,
            firstName: userFNameInput.value,
            lastName: userLNameInput.value,
            phone: userPhoneInput.value,
            email: userEmailInput.value,
            address: address,
            birthDate: userBirthDateInput.value,
            age: userAgeInput.value,
            gender: userGenderInput.value,
        })
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Error While Adding a User');
            }
        })
        .then(data => {
            data.id = Date.now(); // Generate a new unique ID
            users.push(data);
            localStorage.setItem('users', JSON.stringify(users));

            displayUsers();
            showToast('success', 'User added successfully.');
        })
        .catch(error => {
            console.error('Error adding user:', error);
            showToast('danger', 'Failed to add user.');
        });

    // Clear input fields
    userFNameInput.value = "";
    userLNameInput.value = "";
    userPhoneInput.value = "";
    userEmailInput.value = "";
    userAddressInput.value = "";
    userBirthDateInput.value = "";
    userAgeInput.value = "";
    userGenderInput.value = "";
}

document.addEventListener('click', event => {
    const target = event.target;
    if (target.classList.contains('edit')) {
        showToast('information', 'You are now editing a user in the All Users section.');
        setTimeout(() => {
            window.location.href = '../components/home.all-user.html';
        }, 1500);
    }
    if (target.classList.contains('delete')) {
        showToast('information', 'You are now deleting a user in the All Users section.');
        setTimeout(() => {
            window.location.href = '../components/home.all-user.html';
        }, 1500);
    }
});