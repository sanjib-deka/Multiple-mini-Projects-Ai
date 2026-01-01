const socket = io();

// State management
let currentUser = null;
let myLocation = null;
const markers = {};
const userColors = {};
const lastUpdateTimes = {};
let loadingInterval = null; // To cycle messages
let isLocating = false; // Track if we are currently searching

// Initialize map
const map = L.map("map").setView([20, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "OpenStreetMap",
  maxZoom: 19
}).addTo(map);

// Colors & Icons
function adjustColorBrightness(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1);
}

function createHumanIcon(color) {
  const svgIcon = `
    <svg width="50" height="60" viewBox="0 0 50 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow-${color.replace('#', '')}">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id="grad-${color.replace('#', '')}" cx="50%" cy="40%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${adjustColorBrightness(color, -30)};stop-opacity:1" />
        </radialGradient>
      </defs>
      <path d="M 8 15 Q 5 20 5 25" stroke="${color}" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.7"/>
      <path d="M 12 10 Q 8 17 8 25" stroke="${color}" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.5"/>
      <path d="M 16 6 Q 11 15 11 25" stroke="${color}" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.3"/>
      <path d="M 42 15 Q 45 20 45 25" stroke="${color}" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.7"/>
      <path d="M 38 10 Q 42 17 42 25" stroke="${color}" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.5"/>
      <path d="M 34 6 Q 39 15 39 25" stroke="${color}" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.3"/>
      <path d="M 25 10 C 18 10 12 16 12 23 C 12 32 25 45 25 45 C 25 45 38 32 38 23 C 38 16 32 10 25 10 Z" fill="url(#grad-${color.replace('#', '')})" filter="url(#glow-${color.replace('#', '')})" stroke="${adjustColorBrightness(color, -40)}" stroke-width="1"/>
      <circle cx="25" cy="23" r="1.5" fill="${color}"/>
      <ellipse cx="25" cy="46" rx="8" ry="2" fill="rgba(0,0,0,0.3)"/>
    </svg>`;
  return L.divIcon({ html: svgIcon, className: 'gps-tracker-marker', iconSize: [50, 60], iconAnchor: [25, 45], popupAnchor: [0, -45] });
}

function createPopupContent(deviceName, color) {
  return `<div class="popup-content"><div class="popup-header"><i class="fas fa-location-dot" style="color: ${color}"></i><span>${deviceName}</span></div><div class="popup-info"><i class="fas fa-circle" style="color: #4ade80; font-size: 0.5rem;"></i>Active</div></div>`;
}

// UI Elements
const deviceModal = document.getElementById('device-modal');
const deviceNameInput = document.getElementById('device-name-input');
const startTrackingBtn = document.getElementById('start-tracking');
const storedDeviceName = localStorage.getItem('deviceName');
const debugStatus = document.getElementById('debug-status');

if (storedDeviceName) {
  registerDevice(storedDeviceName);
  deviceModal.classList.add('hidden');
} else {
  deviceNameInput.focus();
}

deviceNameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') startTrackingBtn.click(); });
startTrackingBtn.addEventListener('click', () => {
  const name = deviceNameInput.value.trim();
  if (name) { registerDevice(name); deviceModal.classList.add('hidden'); }
  else { deviceNameInput.style.borderColor = 'red'; setTimeout(() => deviceNameInput.style.borderColor = '', 2000); }
});

function registerDevice(deviceName) {
  localStorage.setItem('deviceName', deviceName);
  if (socket.connected) socket.emit('register-device', deviceName);
  // Start the loading sequence immediately on registration
  startGeolocationTracking();
}

socket.on('connect', () => {
  const name = localStorage.getItem('deviceName');
  if (name) socket.emit('register-device', name);
});

// Helper to show rotating messages
const waitingMessages = [
  "Establishing connection...",
  "Requesting GPS access...",
  "Waiting for satellite fix...",
  "Still locating (this may take 5-8 mins)...",
  "Please ensure Location is ON...",
  "Checking High Accuracy Mode...",
  "Using Local Fallbacks..."
];

function updateSelfStatusInSidebar(msg, type = 'loading') {
  const myItem = document.querySelector(`.user-item[data-user-id="${socket.id}"]`);
  if (myItem) {
    const statusText = myItem.querySelector('.status-text');
    const statusDot = myItem.querySelector('.status-dot');
    if (statusText) statusText.textContent = msg;

    // Reset classes
    statusDot.className = 'status-dot';
    if (type === 'loading') {
      statusDot.classList.add('loading');
      statusText.style.color = '#3b82f6'; // Blue
    } else if (type === 'active') {
      statusDot.classList.add('blinking');
      statusDot.style.background = '#4ade80';
      statusText.style.color = '#4ade80';
    } else {
      statusDot.style.background = '#ef4444';
      statusText.style.color = '#ef4444';
    }
  }
}

// Geolocation
let wakeLock = null;
async function requestWakeLock() {
  try { if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen'); } catch (e) { }
}

function startGeolocationTracking() {
  requestWakeLock();
  isLocating = true;

  // Start Rotating Messages Sequence
  let msgIndex = 0;
  if (loadingInterval) clearInterval(loadingInterval);

  // Immediate first message
  updateSelfStatusInSidebar("Locating...");

  loadingInterval = setInterval(() => {
    if (!isLocating) { clearInterval(loadingInterval); return; }

    msgIndex = (msgIndex + 1) % waitingMessages.length;
    updateSelfStatusInSidebar(waitingMessages[msgIndex], 'loading');

    // Also show on map overlay
    if (debugStatus) {
      debugStatus.textContent = `⏳ ${waitingMessages[msgIndex]}`;
      debugStatus.classList.add('active');
      debugStatus.style.background = "#3b82f6";
    }
  }, 4000); // Change message every 4 seconds

  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        // SUCCESS!
        const { latitude, longitude } = position.coords;
        myLocation = { latitude, longitude };
        socket.emit("send-location", { latitude, longitude });

        // Location found! Stop the "Loading" sequence
        if (isLocating) {
          isLocating = false;
          clearInterval(loadingInterval);
          console.log("📍 First Fix Obtained!");
        }
      },
      (error) => {
        console.error("Geo Error:", error);
        if (error.code === 1) {
          alert("⚠️ Permission Denied! Please allow location access.");
          isLocating = false;
          updateSelfStatusInSidebar("Permission Denied", 'error');
        }
        // We do NOT show error for timeout yet, because we have a huge timeout
      },
      {
        enableHighAccuracy: true,
        timeout: 480000, // 8 MINUTES (Requested: 5-8 min)
        maximumAge: 0 // Prefer fresh, but 2000 is also okay. User wants ACCURACY eventually.
      }
    );
  } else {
    alert("Not supported");
  }
}


// Receive Location
socket.on("receive-location", (data) => {
  const { id, latitude, longitude, deviceName, color } = data;
  lastUpdateTimes[id] = Date.now();

  // If it's ME, ensure we stop the loading sequence
  if (id === socket.id) {
    if (isLocating) {
      isLocating = false;
      clearInterval(loadingInterval);
    }
    // Force status update to Active
    updateUserStatus(id);
  } else {
    updateUserStatus(id);
  }

  const jitterLat = latitude + (Math.random() - 0.5) * 0.0001;
  const jitterLng = longitude + (Math.random() - 0.5) * 0.0001;

  if (markers[id]) {
    markers[id].setLatLng([jitterLat, jitterLng]);
  } else {
    const icon = createHumanIcon(color);
    const marker = L.marker([jitterLat, jitterLng], { icon, zIndexOffset: id === socket.id ? 1000 : 0 })
      .addTo(map).bindPopup(createPopupContent(deviceName, color));
    marker.bindTooltip(deviceName, { permanent: true, direction: "bottom", className: "marker-label", offset: [0, 15] });
    markers[id] = marker;
    userColors[id] = color;
    if (id === socket.id && Object.keys(markers).length === 1) map.setView([latitude, longitude], 16);
  }

  // Success Flash
  if (debugStatus) {
    debugStatus.textContent = `📍 Updated: ${deviceName}`;
    debugStatus.style.background = "#4ade80"; // Green
    debugStatus.classList.add('active');
    setTimeout(() => { if (!isLocating) debugStatus.classList.remove('active'); }, 2000);
  }
});

// User List
socket.on('user-list-update', (users) => {
  const userList = document.getElementById('user-list');
  document.getElementById('online-count').textContent = users.length;

  if (users.length === 0) {
    userList.innerHTML = `<div class="empty-state"><p>No users</p></div>`;
    return;
  }

  // Smart Render: If we are 'isLocating', we preserve that state in the UI for ourselves
  userList.innerHTML = users.map(user => {
    let initialStatus = "Waiting...";
    let initialClass = "";

    // If this is ME and I am still loading, show loading text
    if (user.id === socket.id && isLocating) {
      initialStatus = "Initializing...";
      initialClass = "loading";
    } else {
      initialStatus = "Connected";
    }

    return `
        <div class="user-item" data-user-id="${user.id}">
          <div class="user-avatar" style="background: ${user.color}"><i class="fas fa-location-dot"></i></div>
          <div class="user-info">
            <div class="user-name">${user.deviceName}</div>
            <div class="user-status">
              <span class="status-dot ${initialClass}"></span>
              <span class="status-text">${initialStatus}</span>
            </div>
          </div>
        </div>
      `;
  }).join('');

  // Re-attach listeners
  document.querySelectorAll('.user-item').forEach(item => {
    item.addEventListener('click', () => {
      const uid = item.dataset.userId;
      if (markers[uid]) { map.setView(markers[uid].getLatLng(), 16); markers[uid].openPopup(); }
    });
  });
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    markers[id].setOpacity(0.5);
    const icon = markers[id].getElement();
    if (icon) icon.style.filter = "grayscale(100%)";
  }
});

// Sidebar & Utils
const sidebar = document.getElementById('sidebar');
document.getElementById('toggle-sidebar')?.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
document.getElementById('toggle-sidebar-mobile')?.addEventListener('click', () => sidebar.classList.toggle('active'));
document.getElementById('recenter-btn')?.addEventListener('click', () => {
  if (myLocation) map.setView([myLocation.latitude, myLocation.longitude], 16);
});

// Activity Monitor
setInterval(() => {
  document.querySelectorAll('.user-item').forEach(item => {
    // Don't override status if I am 'Locating'
    if (item.dataset.userId === socket.id && isLocating) return;
    updateUserStatus(item.dataset.userId);
  });
}, 3000);

function updateUserStatus(id) {
  // Safety check: if locating, don't show "active" yet
  if (id === socket.id && isLocating) return;

  const item = document.querySelector(`.user-item[data-user-id="${id}"]`);
  if (!item) return;

  const lastUpdate = lastUpdateTimes[id] || 0;
  const diff = Date.now() - lastUpdate;
  const statusText = item.querySelector('.status-text');
  const statusDot = item.querySelector('.status-dot');
  if (!statusText) return;

  if (diff < 30000) {
    statusText.textContent = "Active Now";
    statusText.style.color = "#4ade80";
    statusDot.className = "status-dot blinking";
    statusDot.style.background = "#4ade80";
  } else if (diff < 300000) { // < 5 mins
    statusText.textContent = "Idle";
    statusText.style.color = "#fbbf24";
    statusDot.className = "status-dot";
    statusDot.style.background = "#fbbf24";
  } else {
    statusText.textContent = "Signal Lost";
    statusText.style.color = "#ef4444";
    statusDot.className = "status-dot";
    statusDot.style.background = "#ef4444";
  }
}

// Manual mode trigger (hidden but usable via console or future button)
function enableManualMode() {
  map.on('click', (e) => {
    const { lat, lng } = e.latlng;
    socket.emit("send-location", { latitude: lat, longitude: lng });
  });
}

console.log('RealTime Tracker initialized v3');


const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "OpenStreetMap"
}).addTo(map);


socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude]);
});

const markers = {};

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;

  // Update map view if you want 
  map.setView([latitude, longitude]);

  // Update existing marker or add a new one
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});



socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});



const marker = L.circleMarker([51.5, -0.09], {
  color: 'blue', // Border color
  fillColor: 'green', // Fill color
  fillOpacity: 0.5,
  radius: 10
}).addTo(map);

