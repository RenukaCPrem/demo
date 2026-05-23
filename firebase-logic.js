

var firebaseConfig = {
  apiKey: "AIzaSyCIt7GDbMDrqj4fnwk2uF4NwOQnxTEJFH8",
  authDomain: "fir-f2cd1.firebaseapp.com",
  projectId: "fir-f2cd1",
  storageBucket: "fir-f2cd1.firebasestorage.app",
  messagingSenderId: "34383645868",
  appId: "1:34383645868:web:7689c57ce9f39d3c712309",
  measurementId: "G-85X6Y07BVR"
};

// Initialize Firebase (using global firebase object from CDN)
let auth1, db;

function initFirebase() {
  if (typeof firebase === 'undefined') {
    console.error('Firebase SDK not loaded from CDN');
    return;
  }
  
  firebase.initializeApp(firebaseConfig);
  auth1 = firebase.auth();
  db = firebase.firestore();
  console.log('Firebase initialized');
}

// Global state
let currentUser = null;
let currentUserRole = null;
let currentUserData = null;

// Set role (UI only, for demo)
function setRole(role) {
  document.getElementById('role-student').classList.toggle('active', role === 'student');
  document.getElementById('role-teacher').classList.toggle('active', role === 'teacher');
  document.getElementById('role-student').style.background = role === 'student' ? 'var(--royal)' : 'var(--border)';
  document.getElementById('role-student').style.color = role === 'student' ? '#fff' : 'var(--text)';
  document.getElementById('role-teacher').style.background = role === 'teacher' ? 'var(--royal)' : 'var(--border)';
  document.getElementById('role-teacher').style.color = role === 'teacher' ? '#fff' : 'var(--text)';
  sessionStorage.setItem('selectedRole', role);
}

// Handle login
async function handleLogin() {
  console.log('Login button clicked');
  
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const selectedRole = sessionStorage.getItem('selectedRole') || 'student';
  const errorDiv = document.getElementById('login-error');

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showError('Please enter both email and password');
    return;
  }

  try {
    console.log('Attempting login with:', email);
    
    // Sign in with Firebase Auth
    const userCredential = await auth1.signInWithEmailAndPassword(email, password);
    // const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Auth successful, UID:', user.uid);

    // Get user data from Firestore
    const userDocSnap = await db.collection('users').doc(user.uid).get();

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      console.log('User data found:', userData);
      
      // Verify role matches
      if (userData.role !== selectedRole) {
        showError(`This account is registered as a ${userData.role}, not a ${selectedRole}`);
        await auth1.signOut();
        return;
      }

      // Login successful
      currentUser = user;
      currentUserRole = userData.role;
      currentUserData = userData;

      // Update UI
      const navMain = document.getElementById('nav-main');
      const navAuth = document.getElementById('nav-auth');
      const userNameDisplay = document.getElementById('user-name-display');
      
      if (navMain) navMain.style.display = 'none';
      if (navAuth) navAuth.style.display = 'flex';
      if (userNameDisplay) userNameDisplay.textContent = userData.name || email.split('@')[0];

      // Hide login page
      const loginPage = document.getElementById('page-login');
      if (loginPage) loginPage.classList.remove('active');
      if (errorDiv) errorDiv.style.display = 'none';

      // Show appropriate dashboard
      if (userData.role === 'teacher') {
        showPage('teacher');
        initTeacherDashboard();
      } else {
        showPage('dashboard');
        initStudentDashboard();
      }
      
      console.log('Login successful for', userData.role);
    } else {
      showError('User profile not found in database');
      await auth1.signOut();
    }
  } catch (error) {
    console.error('Login error:', error);
    showError('Login failed: ' + error.message);
  }
}

function showError(message) {
  const errorDiv = document.getElementById('login-error');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  console.error(message);
}

// Logout function
async function logout() {
  try {
    await auth1.signOut();
    currentUser = null;
    currentUserRole = null;
    currentUserData = null;
    
    // Reset UI
    const navMain = document.getElementById('nav-main');
    const navAuth = document.getElementById('nav-auth');
    const loginPage = document.getElementById('page-login');
    
    if (navMain) navMain.style.display = 'flex';
    if (navAuth) navAuth.style.display = 'none';
    if (loginPage) loginPage.classList.add('active');
    
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    if (loginPage) loginPage.style.display = 'flex';
    
    // Clear form
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    if (emailInput) emailInput.value = '';
    if (passwordInput) passwordInput.value = '';
    
    console.log('Logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Initialize student dashboard
async function initStudentDashboard() {
  try {
    if (!currentUser) return;
    
    // Load student's progress from Firestore
    const progressSnap = await db.collection('student_progress').doc(currentUser.uid).get();
    
    if (progressSnap.exists()) {
      const progressData = progressSnap.data();
      console.log('Student progress loaded:', progressData);
      // Update progress in the page
      if (window.updateStudentProgress) {
        window.updateStudentProgress(progressData);
      }
    }
  } catch (error) {
    console.error('Error loading student progress:', error);
  }
}

// Initialize teacher dashboard
async function initTeacherDashboard() {
  try {
    // Get all students
    const studentsSnapshot = await db.collection('users').where('role', '==', 'student').get();
    
    const students = [];
    let totalProgress = 0;

    for (const docSnap of studentsSnapshot.docs) {
      const student = docSnap.data();
      const studentId = docSnap.id;
      
      // Get student's progress
      const progressSnap = await db.collection('student_progress').doc(studentId).get();
      const progress = progressSnap.exists() ? progressSnap.data() : { ankle: 0, knee: 0, terminology: 0 };
      
      students.push({
        id: studentId,
        name: student.name || student.email,
        email: student.email,
        progress: progress
      });
      
      totalProgress += ((progress.ankle || 0) + (progress.knee || 0) + (progress.terminology || 0)) / 3;
    }

    const avgProgress = students.length > 0 ? Math.round(totalProgress / students.length) : 0;

    // Update stats
    const totalStudentsEl = document.getElementById('teacher-total-students');
    const activeNowEl = document.getElementById('teacher-active-now');
    const avgProgressEl = document.getElementById('teacher-avg-progress');
    
    if (totalStudentsEl) totalStudentsEl.textContent = students.length;
    if (activeNowEl) activeNowEl.textContent = Math.max(1, Math.floor(students.length * 0.6));
    if (avgProgressEl) avgProgressEl.textContent = avgProgress + '%';

    // Populate student list
    const studentListHTML = students.map(s => `
      <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:0;border-bottom:1px solid var(--border);align-items:center;">
        <div style="padding:14px 18px;font-size:0.86rem;color:var(--text);">${s.name}</div>
        <div style="padding:14px 18px;text-align:center;"><div class="mini-progress" style="width:100%;"><div class="mini-fill" style="width:${s.progress.ankle || 0}%;background:var(--royal)"></div></div><span style="font-size:0.72rem;color:var(--muted);">${s.progress.ankle || 0}%</span></div>
        <div style="padding:14px 18px;text-align:center;"><div class="mini-progress" style="width:100%;"><div class="mini-fill" style="width:${s.progress.knee || 0}%;background:var(--royal)"></div></div><span style="font-size:0.72rem;color:var(--muted);">${s.progress.knee || 0}%</span></div>
        <div style="padding:14px 18px;text-align:center;"><div class="mini-progress" style="width:100%;"><div class="mini-fill" style="width:${s.progress.terminology || 0}%;background:var(--royal)"></div></div><span style="font-size:0.72rem;color:var(--muted);">${s.progress.terminology || 0}%</span></div>
      </div>
    `).join('');

    const studentListEl = document.getElementById('teacher-student-list');
    if (studentListEl) {
      studentListEl.innerHTML = studentListHTML || '<div style="padding:24px;text-align:center;color:var(--muted);font-size:0.88rem;">No students yet</div>';
    }

    // Populate chapter details
    const chaptersHTML = `
      <div class="skill-card">
        <div class="skill-card-header">
          <div class="skill-icon" style="background:#e8edfb">📍</div>
          <span class="badge level2">Chapter 1</span>
        </div>
        <h3>Ankle Anatomy</h3>
        <p>The most common sports injury. Students learn ligaments, sprains, and diagnosis.</p>
        <div class="skill-meta">
          <span>${students.length} students in class</span>
        </div>
      </div>
      <div class="skill-card">
        <div class="skill-card-header">
          <div class="skill-icon" style="background:#e8edfb">🦵</div>
          <span class="badge level2">Chapter 2</span>
        </div>
        <h3>Knee Anatomy</h3>
        <p>Complex joint with ACL, MCL, meniscus. Largest joint in the body.</p>
        <div class="skill-meta">
          <span>${students.length} students in class</span>
        </div>
      </div>
      <div class="skill-card">
        <div class="skill-card-header">
          <div class="skill-icon" style="background:#e8edfb">📚</div>
          <span class="badge level2">Chapter 3</span>
        </div>
        <h3>Medical Terminology</h3>
        <p>Essential language for athletic trainers. Learn anatomical and injury terms.</p>
        <div class="skill-meta">
          <span>${students.length} students in class</span>
        </div>
      </div>
    `;
    
    const chaptersEl = document.getElementById('teacher-chapters');
    if (chaptersEl) chaptersEl.innerHTML = chaptersHTML;

    console.log('Teacher dashboard initialized with', students.length, 'students');
  } catch (error) {
    console.error('Error loading teacher dashboard:', error);
  }
}

// Update student progress (called when student completes sections)
async function updateStudentProgress(chapter, sectionNum, isComplete) {
  if (!currentUser || currentUserRole !== 'student') return;

  try {
    const progressRef = db.collection('student_progress').doc(currentUser.uid);
    const progressSnap = await progressRef.get();
    
    let currentProgress = {};
    if (progressSnap.exists()) {
      currentProgress = progressSnap.data();
    }

    // Calculate progress percentage for the chapter
    const progressKey = chapter.toLowerCase();
    if (!currentProgress[progressKey]) {
      currentProgress[progressKey] = 0;
    }

    // Increment progress (simplified: add 25% per section, max 100%)
    if (isComplete) {
      currentProgress[progressKey] = Math.min(100, currentProgress[progressKey] + 25);
    }

    // Save to Firestore
    await progressRef.set({
      ...currentProgress,
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
      userId: currentUser.uid
    }, { merge: true });

    console.log(`Progress updated for ${chapter}: ${currentProgress[progressKey]}%`);
  } catch (error) {
    console.error('Error updating progress:', error);
  }
}

// Auth state observer
if (typeof firebase !== 'undefined') {
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      console.log('User signed in:', user.uid);
      currentUser = user;
      try {
        const userDocSnap = await firebase.firestore().collection('users').doc(user.uid).get();
        if (userDocSnap.exists()) {
          currentUserData = userDocSnap.data();
          currentUserRole = currentUserData.role;
          console.log('User role:', currentUserRole);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    } else {
      console.log('User signed out');
      currentUser = null;
      currentUserRole = null;
      currentUserData = null;
    }
  });
}

// Make functions globally accessible
window.handleLogin = handleLogin;
window.logout = logout;
window.setRole = setRole;
window.updateStudentProgress = updateStudentProgress;
window.initTeacherDashboard = initTeacherDashboard;
window.initStudentDashboard = initStudentDashboard;

// Set up event listeners when DOM is ready
function setupEventListeners() {
  // Initialize Firebase
  initFirebase();
  
  // Role selector buttons
  const roleStudentBtn = document.getElementById('role-student');
  const roleTeacherBtn = document.getElementById('role-teacher');
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const passwordInput = document.getElementById('password');

  if (roleStudentBtn) roleStudentBtn.addEventListener('click', () => setRole('student'));
  if (roleTeacherBtn) roleTeacherBtn.addEventListener('click', () => setRole('teacher'));
  if (loginBtn) loginBtn.addEventListener('click', handleLogin);
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
  
  // Allow Enter key in password field to submit login
  if (passwordInput) {
    passwordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleLogin();
    });
  }
  
  console.log('Event listeners set up');
}

// if (document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded', setupEventListeners);
// } else {
//   setupEventListeners();
// }

window.addEventListener('load', () => {
    console.log("Window fully loaded. Initializing systems...");
    
    // ONLY call setupEventListeners here. 
    // Let your setupEventListeners function handle calling initFirebase internally!
    if (typeof setupEventListeners === 'function') {
        setupEventListeners();
    }
});