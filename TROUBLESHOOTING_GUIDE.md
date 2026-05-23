# Troubleshooting Guide
## When Things Don't Work (and They Will!)

Don't worry - debugging is a normal part of programming. This guide will help you fix common problems.

---

## How to Debug Like a Pro

### Step 1: Check Browser Console
This is where JavaScript errors appear.

**How to open:**
- Windows/Linux: Press `F12` or `Ctrl+Shift+I`
- Mac: Press `Cmd+Option+I`

**What to look for:**
- Red error messages (these are problems!)
- Orange warning messages (just warnings, usually okay)
- Look at the `firebase-logic.js` line number for clues

### Step 2: Read the Error Carefully

Error messages usually tell you what's wrong:
```
Uncaught ReferenceError: firebase is not defined
```
Translation: "The firebase library isn't loaded"

### Step 3: Check Firebase Console

Go to [console.firebase.google.com](https://console.firebase.google.com) and verify:
- ✅ Project exists
- ✅ Authentication is enabled
- ✅ Firestore database exists with data

### Step 4: Google It!

Copy the exact error message and Google it. Usually, someone else had the same problem!

---

## Common Problems & Solutions

### ❌ "Firebase SDK not loaded" Error

**What it means:** The browser can't find the Firebase library

**How to fix:**

1. Check your HTML has these `<script>` tags in the `<head>`:
```html
<script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"></script>
```

2. Make sure these are BEFORE your `firebase-logic.js` script

3. Check your internet connection (CDN scripts need internet to load)

4. Try refreshing the page (Ctrl+R or Cmd+R)

---

### ❌ "projectId is required" Error

**What it means:** Your firebaseConfig is incomplete or wrong

**How to fix:**

1. Go to Firebase Console > Project Settings (gear icon)
2. Copy the ENTIRE firebaseConfig object
3. Open your `firebase-logic.js`
4. Replace the firebaseConfig section with the new one
5. Make sure it has these fields:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

If any field is missing, copy it again from Firebase Console

---

### ❌ "Email/Password authentication is not enabled" Error

**What it means:** You didn't turn on email/password login in Firebase

**How to fix:**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click "Authentication" (left sidebar)
4. Click "Get Started"
5. Click "Email/Password"
6. Toggle the switch to "ON"
7. Click "Save"

Then refresh your website and try login again

---

### ❌ "User not found" or "Wrong password" When Logging In

**What it means:** The email/password combination doesn't exist

**How to fix:**

1. Check you're using the EXACT email:
   - Should be: `student@example.com` (not `student`)
   - Should be: `teacher@example.com` (not `teacher`)

2. Check the password:
   - Should be: `password123` (not `password` or `123`)

3. Go to Firebase Console > Authentication > Users
4. Verify these accounts exist:
   - `student@example.com`
   - `teacher@example.com`

If they don't exist, create them again!

---

### ❌ "Permission denied" Error After Login

**What it means:** Firestore rules are blocking you

**How to fix:**

1. Go to Firebase Console > Firestore Database
2. Click "Rules" tab
3. Check the rules are set correctly:
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

4. Click "Publish"
5. Wait 1 minute
6. Try login again

---

### ❌ Dashboard is Empty (No Data Showing)

**What it means:** Data isn't being fetched from Firestore

**How to fix:**

1. Check the browser console (F12) for errors
2. Go to Firebase Console > Firestore Database
3. Check "users" collection exists with documents
4. Check "student_progress" collection exists with documents
5. Open browser console and type:
```javascript
db.collection('users').get().then(docs => {
  console.log('Users found:', docs.size);
  docs.forEach(doc => console.log(doc.data()));
});
```
6. Should see your user data logged

If nothing shows up, you didn't create the collections correctly. Go back to Part 2, Step 6 in STUDENT_GUIDE.md

---

### ❌ Deployment Fails ("firebase: command not found")

**What it means:** Firebase tools aren't installed

**How to fix:**

In Codespaces terminal, run:
```bash
npm install -g firebase-tools
```

Then try deploying again:
```bash
firebase deploy
```

---

### ❌ Deployment Fails ("firebase.json not found")

**What it means:** Firebase Hosting needs a `firebase.json` file to know how to serve your website

**How to fix (Option A - Automatic):**

Run:
```bash
firebase init hosting
```

Then answer the questions as shown in SETUP_CHECKLIST.md.

**How to fix (Option B - Manual, Easier for Codespaces):**

1. In your project folder (same level as `index.html`), create a new file named `firebase.json`
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
4. Try deploying again:
```bash
firebase deploy
```

**If you're not sure which option to use:**
- Try Option B (manual) first - it's faster in Codespaces
- If that doesn't work, try Option A

---

### ❌ Deployment Fails ("You do not have permission to access...")

**What it means:** You're not logged in to Firebase

**How to fix:**

In terminal, run:
```bash
firebase login --no-localhost
```

- A special link will appear
- Open that link in a new browser tab
- Click "Allow"
- Copy the token code
- Paste it in the terminal

Then try deploying again:
```bash
firebase deploy
```

---

### ❌ Hosting URL Shows "Page not found"

**What it means:** Your files weren't deployed properly

**How to fix:**

1. In terminal, make sure you're in the right folder:
```bash
pwd  # Should show /workspaces/demo or similar
ls   # Should show your index.html
```

2. Check your `firebase.json` file has:
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

3. Redeploy:
```bash
firebase deploy
```

4. Wait 2-3 minutes for Firebase to update
5. Try the URL again

---

### ❌ Changes Don't Show Up After Redeploying

**What it means:** Your browser is showing a cached (old) version

**How to fix:**

1. Hard refresh the page:
   - Windows/Linux: Ctrl+Shift+R
   - Mac: Cmd+Shift+R

2. Or clear your browser cache and reload

3. Or try in a private/incognito window

---

### ❌ Multiple Errors at Once

**What to do:**

1. Write down all the errors
2. Fix them ONE AT A TIME, starting with the first error
3. After fixing each error, refresh the page and see if there are new errors
4. Don't try to fix everything at once (confusing!)

---

## Advanced Debugging

### Check What's Being Sent to Firebase

Add this to your `firebase-logic.js` right after the `initFirebase()` function:

```javascript
// Log all Firestore reads
const db = firebase.firestore();
db.enableLogging(true);
```

Now you'll see every database query in the console

---

### Test Firebase Connection Directly

Open browser console (F12) and type:

```javascript
// Check if Firebase is connected
console.log('Firebase:', firebase);

// Check if user is logged in
console.log('Current user:', auth.currentUser);

// Test getting data
db.collection('users').get().then(snapshot => {
  console.log('Document count:', snapshot.size);
});
```

If you see results, Firebase is connected!

---

### Check Network Requests

1. Open browser DevTools (F12)
2. Click "Network" tab
3. Refresh the page
4. Look for requests to `firebaseapp.com`
5. If they show red (❌), something's wrong with your connection

---

## Common Mistakes to Avoid

✅ **DO:**
- Copy your firebaseConfig EXACTLY from Firebase Console
- Use `student@example.com` and `teacher@example.com` for testing
- Use `password123` for testing passwords
- Check browser console for errors FIRST
- Read error messages carefully

❌ **DON'T:**
- Type your Firebase config manually (copy/paste!)
- Use the wrong email/password for testing
- Forget to publish Firestore rules
- Forget to enable Email/Password auth
- Deploy without testing locally first

---

## When to Ask for Help

Ask your teacher if you've:
1. ✅ Read this entire guide
2. ✅ Checked browser console
3. ✅ Verified Firebase setup in console
4. ✅ Tried the fixes above
5. ✅ Googled the error message

They can help much faster when you've already tried these steps!

---

## Practice Debugging

To practice debugging without breaking anything:

1. Intentionally make a small mistake (like misspelling a function name)
2. See what error appears in console
3. Fix it
4. Repeat with different mistakes

This helps you learn what errors mean!

---

## Still Stuck?

1. **Take a break** - Fresh eyes help!
2. **Ask a friend** - Rubber duck debugging (explain to someone else)
3. **Search on Stack Overflow** - Copy the full error message
4. **Check YouTube** - Search "Firebase [your error]"
5. **Ask your teacher** - Bring them your error message!

Remember: **Even professional developers debug all day**. You're not doing anything wrong - this is normal!

