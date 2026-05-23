// firebase-logic.js
import { initializeApp } from "https://gstatic.com";
import { getAuth, signInWithEmailAndPassword } from "https://gstatic.com";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://gstatic.com";

// Your Firebase credentials
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_://firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_://appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize connections
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Wait for the HTML elements to fully load
document.addEventListener("DOMContentLoaded", () => {
    // 1. MATCH THESE TO YOUR HTML ID ATTRIBUTES
    const emailInput = document.getElementById('YOUR_EMAIL_INPUT_ID'); 
    const passwordInput = document.getElementById('YOUR_PASSWORD_INPUT_ID');
    const loginButton = document.getElementById('YOUR_BUTTON_ID');

    if (!loginButton) return;

    loginButton.addEventListener('click', async () => {
        try {
            const email = emailInput.value;
            const password = passwordInput.value;
            
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userDocRef = doc(db, "users", userCredential.user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists() && userDocSnap.data().role === 'teacher') {
                showTeacherInterface();
            } else {
                showStudentInterface();
            }
        } catch (error) {
            alert("Login failed: " + error.message);
        }
    });
});

function showTeacherInterface() {
    // Paste your existing UI switching code here (e.g., hiding/showing divs)
    console.log("Showing teacher view...");
    loadChaptersData();
}

function showStudentInterface() {
    // Paste your existing UI switching code here 
    console.log("Showing student view...");
}

async function loadChaptersData() {
    try {
        const querySnapshot = await getDocs(collection(db, "chapters"));
        // Handle your chapter tracking data mapping here
    } catch (err) {
        console.error("Error fetching chapters:", err);
    }
}
