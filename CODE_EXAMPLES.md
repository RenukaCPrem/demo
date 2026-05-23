# Complete Code Example
## Copy-Paste Ready Code for Your Project

Use these templates as a starting point. Copy the code and adjust to your needs.

---

## 1. index.html - Complete Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>School Project App</title>
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            max-width: 500px;
            width: 100%;
            padding: 40px;
        }
        
        h1 {
            color: #333;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            color: #555;
            font-weight: 500;
        }
        
        input {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            transition: border-color 0.3s;
        }
        
        input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        button {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        button:active {
            transform: translateY(0);
        }
        
        .error {
            background: #fee;
            color: #c33;
            padding: 12px;
            border-radius: 5px;
            margin-bottom: 20px;
            display: none;
        }
        
        .success {
            background: #efe;
            color: #3c3;
            padding: 12px;
            border-radius: 5px;
            margin-bottom: 20px;
            display: none;
        }
        
        .hidden {
            display: none;
        }
        
        .dashboard {
            display: none;
        }
        
        .dashboard.active {
            display: block;
        }
        
        .user-card {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #667eea;
        }
        
        .user-card p {
            margin: 8px 0;
            color: #666;
        }
        
        .user-card strong {
            color: #333;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- LOGIN PAGE -->
        <div id="login-page" class="login-page">
            <h1>📚 School Project</h1>
            
            <div id="login-error" class="error"></div>
            <div id="login-success" class="success"></div>
            
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" placeholder="student@example.com">
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" placeholder="password123">
            </div>
            
            <button onclick="handleLogin()">Sign In</button>
            
            <p style="text-align: center; margin-top: 20px; color: #999; font-size: 14px;">
                Test account: student@example.com / password123
            </p>
        </div>
        
        <!-- DASHBOARD PAGE -->
        <div id="dashboard" class="dashboard">
            <h1>🎉 Welcome!</h1>
            
            <div class="user-card">
                <p><strong>Email:</strong> <span id="user-email"></span></p>
                <p><strong>Name:</strong> <span id="user-name"></span></p>
                <p><strong>Role:</strong> <span id="user-role"></span></p>
            </div>
            
            <div id="user-data" style="margin-bottom: 20px;">
                <!-- Additional user data will appear here -->
            </div>
            
            <button onclick="handleLogout()" style="background: #d9534f;">Sign Out</button>
        </div>
    </div>
    
    <!-- Firebase Scripts -->
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"></script>
    
    <!-- Your Firebase Logic -->
    <script src="firebase-logic.js"></script>
    
    <!-- Initialize on page load -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            initFirebase();
        });
    </script>
</body>
</html>
```

---

## 2. firebase-logic.js - Complete Code

```javascript
// ============================================
// FIREBASE CONFIGURATION
// ============================================
// GET THIS FROM FIREBASE CONSOLE!
// Go to: Project Settings (gear icon) > firebaseConfig

var firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-bucket.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef1234567890",
  measurementId: "G-XXXXXXXXXX"
};

// ============================================
// GLOBAL VARIABLES
// ============================================

let auth;           // Firebase Auth
let db;             // Firestore Database
let currentUser = null;
let currentUserData = null;

// ============================================
// INITIALIZE FIREBASE
// ============================================

function initFirebase() {
  // Check if Firebase library loaded
  if (typeof firebase === 'undefined') {
    console.error('ERROR: Firebase SDK not loaded. Check <script> tags in HTML');
    showError('Firebase not loaded. Refresh the page.');
    return;
  }
  
  try {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    
    console.log('✅ Firebase initialized successfully');
    
    // Listen for login state changes
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log('✅ User signed in:', user.email);
        currentUser = user;
        
        // Get user data from Firestore
        try {
          const userDoc = await db.collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            currentUserData = userDoc.data();
            console.log('✅ User data loaded:', currentUserData);
          } else {
            console.warn('⚠️ User document not found in Firestore');
          }
        } catch (error) {
          console.error('❌ Error loading user data:', error);
        }
        
        // Show dashboard
        showDashboard();
      } else {
        console.log('User signed out');
        currentUser = null;
        currentUserData = null;
        showLoginPage();
      }
    });
    
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    showError('Firebase setup failed: ' + error.message);
  }
}

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

async function handleLogin() {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  
  // Validation
  if (!email || !password) {
    showError('Please enter both email and password');
    return;
  }
  
  if (!email.includes('@')) {
    showError('Please enter a valid email address');
    return;
  }
  
  try {
    console.log('🔄 Attempting login with:', email);
    
    // Sign in with Firebase
    const result = await auth.signInWithEmailAndPassword(email, password);
    console.log('✅ Login successful!');
    
    // Clear inputs
    emailInput.value = '';
    passwordInput.value = '';
    
  } catch (error) {
    console.error('❌ Login error:', error.code, error.message);
    
    // Show user-friendly error messages
    if (error.code === 'auth/user-not-found') {
      showError('No account found with this email');
    } else if (error.code === 'auth/wrong-password') {
      showError('Incorrect password');
    } else if (error.code === 'auth/invalid-email') {
      showError('Invalid email format');
    } else if (error.code === 'auth/too-many-requests') {
      showError('Too many login attempts. Try again later.');
    } else {
      showError('Login failed: ' + error.message);
    }
  }
}

async function handleLogout() {
  try {
    console.log('🔄 Logging out...');
    await auth.signOut();
    console.log('✅ Logged out successfully');
  } catch (error) {
    console.error('❌ Logout error:', error);
    showError('Logout failed: ' + error.message);
  }
}

// ============================================
// FIRESTORE FUNCTIONS
// ============================================

// Read user data from Firestore
async function getUserData(userId) {
  try {
    const doc = await db.collection('users').doc(userId).get();
    
    if (doc.exists) {
      console.log('✅ User data retrieved:', doc.data());
      return doc.data();
    } else {
      console.warn('⚠️ User document not found');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting user data:', error);
    return null;
  }
}

// Save data to Firestore
async function saveProgress(userId, data) {
  try {
    console.log('🔄 Saving progress...');
    
    await db.collection('student_progress').doc(userId).set(data);
    
    console.log('✅ Progress saved successfully');
    showSuccess('Data saved!');
    
  } catch (error) {
    console.error('❌ Error saving progress:', error);
    showError('Failed to save data: ' + error.message);
  }
}

// Update data in Firestore
async function updateProgress(userId, data) {
  try {
    console.log('🔄 Updating progress...');
    
    await db.collection('student_progress').doc(userId).update(data);
    
    console.log('✅ Progress updated successfully');
    showSuccess('Data updated!');
    
  } catch (error) {
    console.error('❌ Error updating progress:', error);
    showError('Failed to update data: ' + error.message);
  }
}

// Get student progress data
async function getStudentProgress(userId) {
  try {
    const doc = await db.collection('student_progress').doc(userId).get();
    
    if (doc.exists) {
      console.log('✅ Student progress retrieved:', doc.data());
      return doc.data();
    } else {
      console.warn('⚠️ No progress data found');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting progress:', error);
    return null;
  }
}

// Listen to real-time updates
function listenToStudentProgress(userId, callback) {
  try {
    console.log('🔄 Setting up real-time listener...');
    
    return db.collection('student_progress').doc(userId).onSnapshot(
      (doc) => {
        if (doc.exists) {
          console.log('✅ Progress updated:', doc.data());
          callback(doc.data());
        }
      },
      (error) => {
        console.error('❌ Error listening to progress:', error);
      }
    );
  } catch (error) {
    console.error('❌ Error setting up listener:', error);
  }
}

// ============================================
// UI FUNCTIONS
// ============================================

function showLoginPage() {
  document.getElementById('login-page').style.display = 'block';
  document.getElementById('dashboard').style.display = 'none';
  clearMessages();
}

async function showDashboard() {
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  
  if (currentUser && currentUserData) {
    // Display user info
    document.getElementById('user-email').textContent = currentUser.email || 'N/A';
    document.getElementById('user-name').textContent = currentUserData.name || 'N/A';
    document.getElementById('user-role').textContent = currentUserData.role || 'N/A';
    
    // Load user-specific data
    const progress = await getStudentProgress(currentUser.uid);
    if (progress) {
      displayUserData(progress);
    }
  }
}

function displayUserData(data) {
  const userDataDiv = document.getElementById('user-data');
  let html = '<div class="user-card">';
  
  for (const [key, value] of Object.entries(data)) {
    if (key !== 'userId') { // Skip userId field
      html += `<p><strong>${key}:</strong> ${value}</p>`;
    }
  }
  
  html += '</div>';
  userDataDiv.innerHTML = html;
}

// ============================================
// MESSAGE FUNCTIONS
// ============================================

function showError(message) {
  const errorDiv = document.getElementById('login-error');
  if (errorDiv) {
    errorDiv.textContent = '❌ ' + message;
    errorDiv.style.display = 'block';
  }
  console.error('User message:', message);
}

function showSuccess(message) {
  const successDiv = document.getElementById('login-success');
  if (successDiv) {
    successDiv.textContent = '✅ ' + message;
    successDiv.style.display = 'block';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      successDiv.style.display = 'none';
    }, 3000);
  }
  console.log('Success:', message);
}

function clearMessages() {
  const errorDiv = document.getElementById('login-error');
  const successDiv = document.getElementById('login-success');
  
  if (errorDiv) errorDiv.style.display = 'none';
  if (successDiv) successDiv.style.display = 'none';
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Log all Firebase info (for debugging)
function debugFirebase() {
  console.group('🔍 Firebase Debug Info');
  console.log('Current user:', currentUser);
  console.log('User data:', currentUserData);
  console.log('Auth object:', auth);
  console.log('Firestore object:', db);
  console.groupEnd();
}

// Test Firestore connection
async function testFirestoreConnection() {
  try {
    const snapshot = await db.collection('users').limit(1).get();
    console.log('✅ Firestore connected! Found', snapshot.size, 'documents');
    return true;
  } catch (error) {
    console.error('❌ Firestore connection failed:', error);
    return false;
  }
}

// Export functions for use in HTML
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.debugFirebase = debugFirebase;
window.testFirestoreConnection = testFirestoreConnection;
```

---

## 3. firebase.json - Hosting Configuration

This file tells Firebase Hosting how to serve your website. Create this file if you don't have one.

**File name:** `firebase.json` (same level as `index.html`)

```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### What Each Part Does:

| Setting | Meaning |
|---------|---------|
| `"public": "."` | Serve files from current folder (where index.html is) |
| `"ignore"` | Don't upload these files to Firebase |
| `"rewrite"` | Send all requests to index.html (for single-page apps) |

### How to Create It:

1. Create a new file named `firebase.json`
2. Copy the code above
3. Save it in your project folder
4. Done! Now you can deploy

---

## 4. Example: Adding Data to Firestore

Put this in a `<script>` tag to save data when a button is clicked:

```javascript
// Example: Save quiz score
async function saveQuizScore(score) {
  if (!currentUser) {
    showError('You must be logged in');
    return;
  }
  
  const data = {
    userId: currentUser.uid,
    quiz_score: score,
    timestamp: new Date(),
    subject: "Math"
  };
  
  await saveProgress(currentUser.uid, data);
}

// In your HTML:
// <button onclick="saveQuizScore(85)">Save Score: 85%</button>
```

---

## 5. Example: Real-Time Dashboard

```javascript
// Load data that updates automatically
async function setupRealtimeDashboard() {
  if (!currentUser) return;
  
  // Listen to student progress
  listenToStudentProgress(currentUser.uid, (data) => {
    console.log('Dashboard data updated:', data);
    
    // Update UI with new data
    document.getElementById('user-data').innerHTML = `
      <div class="user-card">
        <p><strong>Math Score:</strong> ${data.math_score || 0}</p>
        <p><strong>Science Score:</strong> ${data.science_score || 0}</p>
        <p><strong>English Score:</strong> ${data.english_score || 0}</p>
      </div>
    `;
  });
}

// Call this when dashboard loads:
// setupRealtimeDashboard();
```

---

## Quick Copy-Paste Checklist

- [ ] Copy `index.html` code above
- [ ] Copy `firebase-logic.js` code above
- [ ] Replace firebaseConfig with YOUR config from Firebase
- [ ] Save both files
- [ ] Test login with `student@example.com` / `password123`
- [ ] Deploy with `firebase deploy`

Done! 🎉

