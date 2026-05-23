# Quick Reference Card
## Print This Out and Keep It By Your Computer!

---

## Test Login Credentials

**Always available after Firebase setup:**

```
STUDENT ACCOUNT:
Email: student@example.com
Password: password123

TEACHER ACCOUNT:
Email: teacher@example.com
Password: password123
```

---

## Firebase Console Locations

| What You Need | Path in Firebase Console |
|---------------|-------------------------|
| Project Settings | ⚙️ Gear Icon → Project Settings |
| Firebase Config | Project Settings → "firebaseConfig" code |
| Authentication | Left sidebar → Authentication |
| Create Users | Authentication → Users tab → + Add user |
| Firestore Database | Left sidebar → Firestore Database |
| Create Collection | Firestore → + Create collection |
| Firestore Rules | Firestore → Rules tab |
| Hosting | Left sidebar → Hosting |
| Deployed URL | Hosting → Deployed site link |

---

## Terminal Commands You'll Need

### Install Firebase Tools
```bash
npm install -g firebase-tools
```

### Login to Firebase
```bash
firebase login --no-localhost
```

### Initialize Firebase in Your Project (Only if needed!)
```bash
firebase init hosting  # Skip this if firebase.json already exists!
```

**Or manually create `firebase.json`:**
If `firebase init` doesn't work, copy this into a new file named `firebase.json`:
```json
{
  "hosting": {
    "public": ".",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{"source": "**", "destination": "/index.html"}]
  }
}
```

### Deploy Your Website
```bash
firebase deploy
```

### Check Deployment Status
```bash
firebase hosting:sites
```

### Delete Your Project (only if needed!)
```bash
firebase projects:delete PROJECT_ID
```

---

## HTML Tags to Add

### In `<head>` Section:
```html
<script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"></script>
```

### Before `</body>` Tag:
```html
<script src="firebase-logic.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    initFirebase();
  });
</script>
```

---

## JavaScript Functions You Can Use

### Login Functions:
```javascript
handleLogin()           // Login with email/password
handleLogout()          // Logout current user
```

### Firestore Functions:
```javascript
getUserData(userId)              // Get user info
getStudentProgress(userId)       // Get student scores
saveProgress(userId, data)       // Save new data
updateProgress(userId, data)     // Update existing data
listenToStudentProgress(userId)  // Real-time updates
```

### Debug Functions:
```javascript
debugFirebase()              // See all Firebase info
testFirestoreConnection()    // Check database connection
console.log(currentUser)     // Show logged-in user
```

---

## Database Structure (Collections & Fields)

### Collection: "users"

```
Document ID: (auto-generated)
├── email (String): "student@example.com"
├── name (String): "John Student"
└── role (String): "student" or "teacher"
```

### Collection: "student_progress"

```
Document ID: (auto-generated)
├── userId (String): "unique-user-id"
├── math_score (Number): 85
├── science_score (Number): 92
└── english_score (Number): 78
```

---

## Firestore Security Rules

**Copy-paste this into Rules tab:**

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

---

## How to Debug

### Step 1: Open Browser Console
```
Windows/Linux: Press F12 or Ctrl+Shift+I
Mac: Press Cmd+Option+I
```

### Step 2: Look For Errors
- Red messages = Problems
- Orange messages = Warnings (usually okay)

### Step 3: Test Firebase Connection
In console, type:
```javascript
testFirestoreConnection()
```

Should show: `✅ Firestore connected!`

### Step 4: Check Current User
In console, type:
```javascript
console.log(currentUser)
```

Should show user object if logged in

### Step 5: Check User Data
In console, type:
```javascript
console.log(currentUserData)
```

Should show user's info from database

---

## Checklist Before Submitting

- [ ] Can login with `student@example.com` / `password123`
- [ ] Dashboard shows logged-in user's information
- [ ] Can logout and login again
- [ ] No red errors in browser console (F12)
- [ ] Hosting URL works (anyone can visit it)
- [ ] Database has at least 2 users (student + teacher)
- [ ] Firestore rules are published
- [ ] Code is commented (explain confusing parts)
- [ ] App looks clean (colors, spacing, fonts)

---

## File Structure

```
your-project/
│
├── index.html          ← Your HTML page
├── style.css           ← Your CSS styling (optional)
├── firebase-logic.js   ← Firebase code (DO NOT EDIT!)
├── firebase.json       ← Firebase config
│
├── 00-START-HERE.md              ← Read this first!
├── STUDENT_GUIDE.md              ← Complete tutorial
├── SETUP_CHECKLIST.md            ← Step-by-step guide
├── CODE_EXAMPLES.md              ← Copy-paste code
├── TROUBLESHOOTING_GUIDE.md      ← When things break
└── QUICK_REFERENCE_CARD.md       ← This file!
```

---

## Common Error Messages & Quick Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "Firebase SDK not loaded" | Missing `<script>` tags | Add Firebase scripts to HTML `<head>` |
| "projectId is required" | Wrong firebaseConfig | Copy config again from Firebase Console |
| "User not found" | Wrong email | Check email is exactly `student@example.com` |
| "Wrong password" | Wrong password | Check password is exactly `password123` |
| "Email/Password authentication is not enabled" | Not enabled in Firebase | Go to Authentication > Enable Email/Password |
| "Permission denied" | Firestore rules blocking | Publish the rules in Firestore > Rules tab |
| "Cannot read property 'uid'" | User not logged in | Make sure user logs in first |
| "firebase: command not found" | Firebase tools not installed | Run `npm install -g firebase-tools` |

---

## Keyboard Shortcuts

### In Browser:
| Action | Shortcut |
|--------|----------|
| Open console | F12 or Ctrl+Shift+I (Windows) or Cmd+Option+I (Mac) |
| Reload page | Ctrl+R or Cmd+R |
| Hard reload (clear cache) | Ctrl+Shift+R or Cmd+Shift+R |
| Focus search | Ctrl+F or Cmd+F |

### In Terminal:
| Action | Shortcut |
|--------|----------|
| Stop command | Ctrl+C |
| Clear screen | `clear` or `Cmd+K` |
| Previous command | ⬆️ Arrow Up |
| Next command | ⬇️ Arrow Down |

---

## What Each File Does

| File | Purpose |
|------|---------|
| `index.html` | Your website - what users see |
| `firebase-logic.js` | Behind-the-scenes code that connects to Firebase |
| `firebase.json` | Config file for Firebase deployment |
| `00-START-HERE.md` | Read this first! |
| `STUDENT_GUIDE.md` | Complete explanation of everything |
| `SETUP_CHECKLIST.md` | Step-by-step instructions |
| `CODE_EXAMPLES.md` | Ready-to-copy code |
| `TROUBLESHOOTING_GUIDE.md` | Help when things break |

---

## Quick Deployment Steps

1. Make sure `firebase.json` exists in your folder
2. Run: `firebase login --no-localhost`
3. Run: `firebase init hosting` (if first time)
4. Make changes to your code
5. Run: `firebase deploy`
6. Wait for success message
7. Copy the "Hosting URL"
8. Test the URL in a browser

---

## Testing Checklist

### Login Test:
- [ ] Visit Hosting URL
- [ ] Enter `student@example.com`
- [ ] Enter `password123`
- [ ] Click Login
- [ ] See dashboard with user info

### Database Test:
- [ ] Go to Firebase Console
- [ ] Click Firestore Database
- [ ] Check "users" collection has data
- [ ] Check "student_progress" exists

### Code Test:
- [ ] Open browser (F12)
- [ ] Run: `testFirestoreConnection()`
- [ ] See: `✅ Firestore connected!`

### Logout Test:
- [ ] Click Logout button
- [ ] See login page again
- [ ] Try logging in again with same credentials

---

## Pro Tips

💡 **Save Your Hosting URL** - Write it down! You'll need it for testing and sharing.

💡 **Use Test Accounts** - Don't use your real email for testing. Use `student@example.com`.

💡 **Commit to Git** - Use git to track your changes (if your teacher uses it).

💡 **Comment Your Code** - Add comments explaining what your code does.

💡 **Take Breaks** - If stuck for 15 minutes, take a 5-minute break. Fresh eyes help!

💡 **Share Progress** - Show your teacher the Hosting URL to verify it's working.

---

## Where to Get Help

1. **Browser Console** (F12) - Shows errors
2. **TROUBLESHOOTING_GUIDE.md** - Common fixes
3. **Firebase Console** - Verify your database
4. **Google search** - Copy the error message and search
5. **Stack Overflow** - Search exact error message
6. **Your teacher** - After trying the above

---

## Firebase Console Quick Links

(Add your project's links after creating it)

- Firebase Console: https://console.firebase.google.com
- Your Project: https://console.firebase.google.com/project/`YOUR_PROJECT_ID`
- Your Hosting URL: (you'll get this after deployment)

---

**Print this card and keep it by your computer while coding!**

Last updated: 2024
Version: 1.0

