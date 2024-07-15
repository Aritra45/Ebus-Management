const firebaseConfig = {
    apiKey: "AIzaSyBwI6XvI-gJBZ9kfjizYJWCKo8M_xSxmZ8",
    authDomain: "unified-mentor-ebus-management.firebaseapp.com",
    projectId: "unified-mentor-ebus-management",
    storageBucket: "unified-mentor-ebus-management.appspot.com",
    messagingSenderId: "89009549750",
    appId: "1:89009549750:web:0cb566e8ddba603b0d9117"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    db.collection("users").doc(user.uid).set({
                        firstName: firstName,
                        lastName: lastName,
                        email: email
                    })
                    .then(() => {
                        alert("User registered successfully!");
                        document.getElementById('signup-form').reset();
                        window.location.href = 'dashboard.html';
                    })
                    .catch((error) => {
                        console.error("Error adding user details: ", error);
                        alert("Failed to register user.");
                    });
                })
                .catch((error) => {
                    console.error("Error creating user: ", error);
                    alert("Failed to register user.");
                });
        });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    alert("Login successful!");
                    document.getElementById('login-form').reset();
                    window.location.href = 'dashboard.html';
                })
                .catch((error) => {
                    console.error("Error signing in: ", error);
                    alert("Invalid credentials. Please try again.");
                });
        });
    }

    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const source = document.getElementById('source').value;
            const destination = document.getElementById('destination').value;

            console.log(`Searching buses from ${source} to ${destination}...`);

            db.collection("buses")
                .where("source", "==", source)
                .where("destination", "==", destination)
                .get()
                .then((querySnapshot) => {
                    const busResultsContainer = document.getElementById('bus-results');
                    busResultsContainer.innerHTML = ''; 

                    if (!querySnapshot.empty) {
                        querySnapshot.forEach((doc) => {
                            const bus = doc.data();
                            const busDiv = document.createElement('div');
                            busDiv.className = 'bus';
                            busDiv.innerHTML = `
                                <h3>${bus.name}</h3>
                                <p>Type: ${bus.type}</p>
                                <p>Contact: ${bus.contact}</p>
                                <p>Source: ${bus.source}</p>
                                <p>Destination: ${bus.destination}</p>
                                <button onclick="viewRoute('${bus.source}', '${bus.destination}')">View Route</button>
                            `;
                            busResultsContainer.appendChild(busDiv);
                        });
                    } else {
                        const noBusDiv = document.createElement('div');
                        noBusDiv.className = 'no-bus';
                        noBusDiv.innerHTML = '<p>No buses found for the selected route.</p>';
                        busResultsContainer.appendChild(noBusDiv);
                    }
                })
                .catch((error) => {
                    console.error("Error getting buses: ", error);
                });
        });
    }

    const adminSignupForm = document.getElementById('admin-signup-form');
    if (adminSignupForm) {
        adminSignupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    db.collection("admins").doc(user.uid).set({
                        email: email
                    })
                    .then(() => {
                        alert("Admin registered successfully!");
                        window.location.href = 'admin-login.html';
                    })
                    .catch((error) => {
                        console.error("Error adding admin details: ", error);
                        alert("Failed to register admin.");
                    });
                })
                .catch((error) => {
                    console.error("Error creating admin: ", error);
                    alert("Failed to register admin.");
                });
        });
    }

    const adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    alert("Login successful!");
                    window.location.href = 'admin-dashboard.html';
                })
                .catch((error) => {
                    console.error("Error signing in: ", error);
                    alert("Invalid credentials. Please try again.");
                });
        });
    }

    const postBusForm = document.getElementById('post-bus-form');
    if (postBusForm) {
        postBusForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const busName = document.getElementById('busName').value;
            const busType = document.getElementById('busType').value;
            const busContact = document.getElementById('busContact').value;
            const source = document.getElementById('source').value;
            const destination = document.getElementById('destination').value;

            db.collection("buses").add({
                name: busName,
                type: busType,
                contact: busContact,
                source: source,
                destination: destination
            })
            .then(() => {
                alert("Bus added successfully!");
                postBusForm.reset();
            })
            .catch((error) => {
                console.error("Error adding bus: ", error);
                alert("Failed to add bus.");
            });
        });
    }
});

function viewRoute(source, destination) {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`;
    window.open(googleMapsUrl, '_blank');
}

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error('Error signing out:', error);
    });
}
