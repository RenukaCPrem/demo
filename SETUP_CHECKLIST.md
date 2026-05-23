# Quick Setup Checklist
## Follow This Step-by-Step for Your Project

Print this out or keep it open while you work!

---

## PHASE 1: Firebase Setup (30 minutes)

### ☐ Create Firebase Project
- [ ] Go to [firebase.google.com](https://firebase.google.com)
- [ ] Sign in with Google account
- [ ] Click "Create a project"
- [ ] Enter project name
- [ ] Finish setup

### ☐ Enable Email/Password Login
- [ ] In Firebase Console, click "Authentication" (left sidebar)
- [ ] Click "Get Started"
- [ ] Select "Email/Password"
- [ ] Toggle "Enable" ON
- [ ] Click "Save"

### ☐ Create Test Accounts
- [ ] Click "Users" tab in Authentication
- [ ] Click "+ Add user"
  - Email: `student@example.com`
  - Password: `password123`
  - Click "Add user"
- [ ] Click "+ Add user" again
  - Email: `teacher@example.com`
  - Password: `password123`
  - Click "Add user"

### ☐ Create Firestore Database
- [ ] Click "Firestore Database" (left sidebar)
- [ ] Click "Create database"
- [ ] Choose your location
- [ ] Select "Start in test mode"
- [ ] Click "Create"
- [ ] Wait for database to be ready

### ☐ Create Database Collections

**Create "users" collection:**
- [ ] Click "+ Create collection"
- [ ] Name: `users`
- [ ] Click "Next"
- [ ] Click "Auto ID"
- [ ] Add fields:
  - [ ] `email` = `student@example.com` (type: String)
  - [ ] `name` = `John Student` (type: String)
  - [ ] `role` = `student` (type: String)
- [ ] Click "Save"

**Add teacher to "users" collection:**
- [ ] Click "+ Add document"
- [ ] Click "Auto ID"
- [ ] Add fields:
  - [ ] `email` = `teacher@example.com` (type: String)
  - [ ] `name` = `Jane Teacher` (type: String)
  - [ ] `role` = `teacher` (type: String)
- [ ] Click "Save"

**Create "student_progress" collection:**
- [ ] Go back to Firestore root
- [ ] Click "+ Create collection"
- [ ] Name: `student_progress`
- [ ] Click "Next"
- [ ] Click "Auto ID"
- [ ] Add fields:
  - [ ] `userId` = `student123` (type: String)
  - [ ] `math_score` = `0` (type: Number)
  - [ ] `science_score` = `0` (type: Number)
  - [ ] `english_score` = `0` (type: Number)
- [ ] Click "Save"

### ☐ Get Your Firebase Config
- [ ] Click gear icon ⚙️ at top left
- [ ] Click "Project settings"
- [ ] Scroll to "Your apps" section
- [ ] Look for "firebaseConfig" code
- [ ] **Copy the entire config** (you'll need this!)

---

## PHASE 2: Update Your Code (15 minutes)

### ☐ Update index.html

Add to `<head>` section:
```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"></script>
```

Add before closing `</body>` tag:
```html
<script src="firebase-logic.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    initFirebase();
  });
</script>
```

### ☐ Create firebase-logic.js
- [ ] Create new file named `firebase-logic.js`
- [ ] Copy code from [STUDENT_GUIDE.md](STUDENT_GUIDE.md) - Part 3, Step 2
- [ ] Replace `YOUR_CONFIG_HERE` with your actual config from Firebase Console

### ☐ Update HTML Form
- [ ] Add `id="email"` to email input
- [ ] Add `id="password"` to password input
- [ ] Add login button with: `onclick="handleLogin(document.getElementById('email').value, document.getElementById('password').value)"`
- [ ] Add logout button with: `onclick="handleLogout()"`

---

## PHASE 3: Deploy on Codespaces (20 minutes)

### ☐ Install Firebase Tools
In terminal, run:
```bash
npm install -g firebase-tools
```

### ☐ Login to Firebase
In terminal, run:
```bash
firebase login --no-localhost
```

- [ ] A link will appear
- [ ] Open that link in browser
- [ ] Click "Allow"
- [ ] Copy the token
- [ ] Paste token in terminal

### ☐ Initialize Firebase Hosting (ONLY IF NEEDED)

**Skip this step if `firebase.json` already exists in your folder!**

**Option A: Use `firebase init hosting` (Recommended)**
```bash
firebase init hosting
```

Answer the questions:
- [ ] "Use an existing Firebase project?" → Type `y` (Yes)
- [ ] "Select your project" → Arrow keys to select, then Enter
- [ ] "Public directory?" → Type `.` (just a dot)
- [ ] "Single-page app?" → Type `y` (Yes)
- [ ] "Overwrite index.html?" → Type `n` (No)

**Option B: Manually Create firebase.json**

If `firebase init` doesn't work for you:

1. Create a new file named `firebase.json` in your project folder
2. Copy this content into it:
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
3. Save the file
4. You're done! Now go to the next step (Deploy to Firebase)

### ☐ Deploy to Firebase
In terminal, run:
```bash
firebase deploy
```

- [ ] Wait for deployment to finish
- [ ] Copy the "Hosting URL" that appears

---

## PHASE 4: Test Your App (5 minutes)

### ☐ Open Hosting URL
- [ ] Copy the Hosting URL from terminal
- [ ] Open it in a new browser tab
- [ ] Should see your website

### ☐ Test Login
- [ ] Email: `student@example.com`
- [ ] Password: `password123`
- [ ] Click "Login"
- [ ] Should see dashboard

### ☐ Test Logout
- [ ] Click "Logout"
- [ ] Should see login page again

### ☐ Update Firestore Rules (Security)
1. [ ] Go to [Firebase Console](https://console.firebase.google.com)
2. [ ] Select your project
3. [ ] Click "Firestore Database"
4. [ ] Click "Rules" tab
5. [ ] Replace all text with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /student_progress/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```
6. [ ] Click "Publish"

---

## ✅ All Done!

Your app is now:
- ✅ Connected to Firebase
- ✅ Has login system working
- ✅ Deployed online (with a real URL!)
- ✅ Secured with database rules

**Your Hosting URL:** _________________ (write it here!)

Share this URL with your teacher or friends!

---

## 🚨 If Something Doesn't Work

1. **Did you get an error?**
   - [ ] Open browser console (F12)
   - [ ] Look for red error message
   - [ ] Read [TROUBLESHOOTING_GUIDE.md](TROUBLESHOOTING_GUIDE.md)

2. **Can't login?**
   - [ ] Check you're using correct email: `student@example.com`
   - [ ] Check password: `password123`
   - [ ] Check Firebase Console > Authentication has the users

3. **Dashboard is empty?**
   - [ ] Check Firebase Console > Firestore Database
   - [ ] Check "users" collection exists
   - [ ] Check "student_progress" collection exists

4. **Can't deploy?**
   - [ ] Check you ran `firebase login --no-localhost`
   - [ ] If you get an error about firebase.json missing:
     - [ ] Try running `firebase init hosting`
     - [ ] Or manually create `firebase.json` (see CODE_EXAMPLES.md)
   - [ ] Check terminal has no red errors
   - [ ] See TROUBLESHOOTING_GUIDE.md for more help

**Still stuck?** Ask your teacher for help!

