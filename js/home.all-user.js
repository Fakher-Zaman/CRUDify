const display = document.querySelector("#display-users");
const userCountDisplay = document.getElementById('user-count');
const updateUserButton = document.querySelector('#saveChanges');
const searchButton = document.querySelector('.button');
const searchInput = document.querySelector('input[type="text"]');

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
    document.getElementById('all-user-section').style.display = 'none';
}

function hideLoader() {
    document.getElementById('loaderContainer').style.display = 'none';
    document.getElementById('all-user-section').style.display = 'block';
}

searchButton.addEventListener('click', function () {
    const searchTerm = searchInput.value.trim();
    // console.log(searchTerm);
    if (searchTerm !== '') {
        fetch(`https://dummyjson.com/users/search?q=${searchTerm}`)
            .then(res => res.json())
            .then(data => {
                if (data.users.length > 0) {
                    displaySearchResults(data);
                } else {
                    searchLocally(searchTerm);
                }
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
                showToast('danger', 'Failed to fetch search results.');
            });
    }
});

function searchLocally(searchTerm) {
    const localUsers = JSON.parse(localStorage.getItem('users')) || [];
    const filteredUsers = localUsers.filter(user => {
        // Search by firstName, lastName, email, etc.
        return user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
    });
    displayLocalSearchResults(filteredUsers);
}

function displaySearchResults(data) {
    // console.log(data);
    const userCountDisplay = document.getElementById('user-count');
    const display = document.querySelector("#display-users");
    userCountDisplay.innerHTML = `Locating ${data.users.length} User Accounts`;

    const dataDisplay = data.users.map(user => {
        const { image, address, phone, age, firstName, lastName, email, gender, birthDate } = user;

        return `
            <div class="get-users">
                <div class="part1-info">
                    <img src="${image}" alt="img" width="50" height="auto">
                    <!-- <p class="avatar">${firstName.charAt(0) + lastName.charAt(0)}</p> -->
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
                    <button id="edit" class="edit" type="button" onclick="editUser(${user.id})">Edit</button>
                    <button id="delete" class="delete" type="button" onclick="deleteUser(${user.id})" style="margin-left: 10px;">Delete</button>
                </div>
            </div>
        `;
    }).join("");

    display.innerHTML = dataDisplay;
}

function displayLocalSearchResults(users) {
    // Display search results from local storage
    const userCountDisplay = document.getElementById('user-count');
    userCountDisplay.innerHTML = `Locating ${users.length} User Accounts`;

    const display = document.querySelector("#display-users");
    const dataDisplay = users.map(user => {
        const { image, address, phone, age, firstName, lastName, email, gender, birthDate } = user;

        return `
            <div class="get-users">
                <div class="part1-info">
                    <img src="${image}" alt="img" width="50" height="auto">
                    <!-- <p class="avatar">${firstName.charAt(0) + lastName.charAt(0)}</p> -->
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
                    <button id="edit" class="edit" type="button" onclick="editUser(${user.id})">Edit</button>
                    <button id="delete" class="delete" type="button" onclick="deleteUser(${user.id})" style="margin-left: 10px;">Delete</button>
                </div>
            </div>
        `;
    }).join("");

    display.innerHTML = dataDisplay;
}

const getData = async () => {
    showLoader();
    const res = await fetch('https://dummyjson.com/users');
    const data = await res.json();
    hideLoader();

    // Merged local users with fetched users
    const localUsers = JSON.parse(localStorage.getItem('users')) || [];
    const mergedUsers = [...data.users, ...localUsers];

    return { users: mergedUsers };
}

const displayUsers = async () => {
    const payload = await getData();
    const deletedUsers = JSON.parse(localStorage.getItem('deleted-users')) || [];
    const updatedUsers = JSON.parse(localStorage.getItem('updated-users')) || [];

    // Update existing users with updated data
    payload.users.forEach(user => {
        const updatedUser = updatedUsers.find(updatedUser => updatedUser.id === user.id);
        if (updatedUser) {
            Object.assign(user, updatedUser);
        }
    });
    // Filter out deleted users
    const activeUsers = payload.users.filter(user => !deletedUsers.some(deletedUser => deletedUser.id === user.id));
    userCountDisplay.innerHTML = `Locating ${activeUsers.length} User Accounts`;

    let dataDisplay = activeUsers.map((user) => {
        // console.log(user);
        const { image, address, phone, age, firstName, lastName, email, gender, birthDate } = user;

        return `
        <div class="get-users">
            <div class="part1-info">
                <img src="${image}" alt="img" width="50" height="auto">
                <!-- <p class="avatar">${firstName.charAt(0) + lastName.charAt(0)}</p> -->
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
                <button id="edit" class="edit" type="button" onclick="editUser(${user.id})">Edit</button>
                <button id="delete" class="delete" type="button" onclick="deleteUser(${user.id})" style="margin-left: 10px;">Delete</button>
            </div>
        </div>
        `
    }).join("");

    display.innerHTML = dataDisplay;
}

let userIdToUpdate;
const editUser = async (userId) => {
    // console.log(userId);
    const res = await fetch('https://dummyjson.com/users');
    const data = await res.json();

    const localUsers = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = JSON.parse(localStorage.getItem('updated-users')) || [];
    const mergedUsers = [...data.users, ...localUsers];
    const indexToUpdate = mergedUsers.findIndex(user => user.id === userId);

    // If the user is found in the mergedUsers array, update it with the corresponding updated user
    if (indexToUpdate !== -1) {
        const updatedUser = updatedUsers.find(user => user.id === userId);
        if (updatedUser) {
            mergedUsers[indexToUpdate] = updatedUser;
        }
    }
    const user = mergedUsers.find(user => user.id === userId);

    document.getElementById('image').value = user.image;
    document.getElementById('firstName').value = user.firstName;
    document.getElementById('lastName').value = user.lastName;
    document.getElementById('phone').value = user.phone;
    document.getElementById('email').value = user.email;
    document.getElementById('address').value = user.address.address;
    document.getElementById('birthDate').value = user.birthDate;
    document.getElementById('age').value = user.age;
    document.getElementById('gender').value = user.gender;

    userIdToUpdate = userId;
}

const updateUser = async (userId) => {
    // console.log("Update User Here");
    const updatedImage = document.getElementById('image').value;
    const updatedFirstName = document.getElementById('firstName').value;
    const updatedLastName = document.getElementById('lastName').value;
    const updatedPhone = document.getElementById('phone').value;
    const updatedEmail = document.getElementById('email').value;
    const updatedAddress = document.getElementById('address').value;
    const updatedBirthDate = document.getElementById('birthDate').value;
    const updatedAge = document.getElementById('age').value;
    const updatedGender = document.getElementById('gender').value;

    if (!updatedImage || !updatedFirstName || !updatedLastName || !updatedPhone || !updatedEmail || !updatedAddress || !updatedBirthDate || !updatedAge || !updatedGender) {
        showToast('warning', 'Please fill all the fields before updating.');
        return;
    }

    // Construct the body of the PUT request
    const requestBody = JSON.stringify({
        image: updatedImage,
        firstName: updatedFirstName,
        lastName: updatedLastName,
        phone: updatedPhone,
        email: updatedEmail,
        address: { address: updatedAddress },
        birthDate: updatedBirthDate,
        age: updatedAge,
        gender: updatedGender
    });

    if (userId >= 1 && userId <= 30) {
        fetch(`https://dummyjson.com/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: requestBody
        })
            .then(res => res.json())
            .then(data => {
                const updatedUsers = JSON.parse(localStorage.getItem('updated-users')) || [];
                const existingIndex = updatedUsers.findIndex(user => user.id === data.id);
                if (existingIndex !== -1) {
                    // If data for the same user ID exists, replace it with the new data
                    updatedUsers[existingIndex] = data;
                } else {
                    updatedUsers.push(data);
                }

                localStorage.setItem('updated-users', JSON.stringify(updatedUsers));
                displayUsers();
                showToast('success', 'User information updated successfully.');
            })
            .catch(error => {
                console.error('Error updating user:', error);
                showToast('danger', 'Failed to update user information.');
            });
    } else {
        const updatedUser = {
            id: userId,
            image: updatedImage,
            firstName: updatedFirstName,
            lastName: updatedLastName,
            phone: updatedPhone,
            email: updatedEmail,
            address: { address: updatedAddress },
            birthDate: updatedBirthDate,
            age: updatedAge,
            gender: updatedGender
        };

        // Update the local storage with the updated user
        const localUsers = JSON.parse(localStorage.getItem('updated-users')) || [];
        const existingIndex = localUsers.findIndex(user => user.id === userId);
        if (existingIndex !== -1) {
            // If data for the same user ID exists, replace it with the new data
            localUsers[existingIndex] = updatedUser;
        } else {
            localUsers.push(updatedUser);
        }

        localStorage.setItem('updated-users', JSON.stringify(localUsers));
        displayUsers();
        showToast('success', 'User information updated successfully.');
    }
}

document.getElementById('saveChanges').addEventListener('click', () => {
    updateUser(userIdToUpdate);
});

let userIdToDelete;
const deleteUser = async (userId) => {
    // console.log(userId);
    const res = await fetch('https://dummyjson.com/users');
    const data = await res.json();

    const localUsers = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = JSON.parse(localStorage.getItem('updated-users')) || [];
    const mergedUsers = [...data.users, ...localUsers];
    const indexToUpdate = mergedUsers.findIndex(user => user.id === userId);

    // If the user is found in the mergedUsers array, update it with the corresponding updated user
    if (indexToUpdate !== -1) {
        const updatedUser = updatedUsers.find(user => user.id === userId);
        if (updatedUser) {
            mergedUsers[indexToUpdate] = updatedUser;
        }
    }
    const user = mergedUsers.find(user => user.id === userId);
    document.getElementById('user-name').innerHTML = user.firstName + " " + user.lastName;

    userIdToDelete = userId;
}

const confirmDeleteUser = async (userId) => {
    // console.log('Deleting user with ID:', userId);
    if (userId >= 1 && userId <= 30) {
        fetch(`https://dummyjson.com/users/${userId}`, {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                const deletedUsers = JSON.parse(localStorage.getItem('deleted-users')) || [];
                deletedUsers.push(data);
                localStorage.setItem('deleted-users', JSON.stringify(deletedUsers));

                displayUsers();
                showToast('success', 'User information deleted successfully.');
            })
            .catch(error => {
                console.error('Error deleting user:', error);
                showToast('danger', 'Failed to delete user information.');
            });
    } else {
        const localUsers = JSON.parse(localStorage.getItem('users')) || [];
        const deletedUser = localUsers.find(user => user.id === userId);
        if (deletedUser) {
            const deletedUsers = JSON.parse(localStorage.getItem('deleted-users')) || [];
            deletedUsers.push(deletedUser);
            localStorage.setItem('deleted-users', JSON.stringify(deletedUsers));

            displayUsers();
            // console.log('User data stored in deleted-users local storage:', deletedUser);
            showToast('success', 'User information deleted successfully.');
        } else {
            console.error('User not found in local storage:', userId);
            showToast('danger', 'Failed to delete user information.');
        }
    }
}

document.getElementById('confirmDelete').addEventListener('click', () => {
    confirmDeleteUser(userIdToDelete);
});

const showEditModal = () => {
    const modal = document.getElementById('editModal');
    modal.style.display = 'block';
};

const hideEditModal = () => {
    const modal = document.getElementById('editModal');
    modal.style.display = 'none';
};

const showDeleteModal = () => {
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'block';
};

const hideDeleteModal = () => {
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'none';
};

document.addEventListener('click', event => {
    const target = event.target;
    if (target.classList.contains('edit')) {
        showEditModal();
    }
    if (target.classList.contains('delete')) {
        showDeleteModal();
    }
    if (target.classList.contains('close') || target.id === 'cancelEdit' || target.id === 'saveChanges') {
        hideEditModal();
    }
    if (target.classList.contains('close') || target.id === 'cancelDelete' || target.id === 'confirmDelete') {
        hideDeleteModal();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    displayUsers();
});