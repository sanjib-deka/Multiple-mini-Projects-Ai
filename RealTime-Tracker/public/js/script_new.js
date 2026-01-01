const socket = io();

// State
let myLocation = null;
const markers = {};
const userColors = {};
const userStatusMessages = {}; // Store custom status text per user (mainly for self)

const loadingMessages = [
    "Initializing GPS...",
    "Waiting for satellite...",
    "Please enable Location...",
    "Still searching (taking a while)...",
    "Check your device permissions...",
    "Trying high accuracy..."
];

// ... (Map init and icons same as before)

// Geolocation with HUGE timeout
function startGeolocationTracking() {
    requestWakeLock();

    // Start the "Loading" UI sequence
    startLoadingSequence(socket.id);

    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                // SUCCESS
                const { latitude, longitude } = position.coords;
                socket.emit("send-location", { latitude, longitude });

                // This will trigger 'receive-location' which will clear the loading state
            },
            (error) => {
                // Error handling ...
            },
            {
                enableHighAccuracy: true,
                timeout: 300000, // 5 MINUTES (requested by user)
                maximumAge: 2000
            }
        );
    }
}

// ...
