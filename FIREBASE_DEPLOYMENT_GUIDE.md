# Firebase Deployment Guide

## Prerequisites

Before deploying to Firebase, ensure you have:
- Firebase CLI installed: `npm install -g firebase-tools`
- A Firebase project created at [console.firebase.google.com](https://console.firebase.google.com)
- Admin access to the Firebase project
- The project ID and credentials configured

## Step 1: Initialize Firebase (First Time Only)

```bash
firebase login
```

This will open your browser to authenticate with your Google account.

## Step 2: Verify Firebase Configuration

Ensure your `firebase.json` is configured:

```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**",
      ".git/**",
      ".firebaserc"
    ]
  }
}
```

Verify `.firebaserc` contains your project ID:

```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

## Step 3: Set Up Firestore Rules

To allow teachers to read all student data, add these security rules in Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own user profile
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow read: if request.auth.uid != null;
    }
    
    // Allow users to read/write their own progress
    match /student_progress/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow read: if request.auth.uid != null;
    }
  }
}
```

## Step 4: Deploy to Firebase Hosting

### Deploy Only Hosting (Recommended) ✅ CORRECT
```bash
firebase deploy --only hosting
```

This is the **correct command**. It deploys only the static files (HTML, CSS, JavaScript) to Firebase Hosting without redeploying Firestore rules or Cloud Functions.

### Why Your Dashboard Might Be Empty

After running `firebase deploy --only hosting`, if the teacher dashboard is empty, check:

1. **Browser Console for Errors**
   - Open DevTools: Press `F12`
   - Go to Console tab
   - Look for red error messages
   - Share these errors for debugging

2. **Database Has No Students**
   - Visit Firebase Console → Firestore
   - Check if `users` collection exists
   - Look for student documents
   - If empty, add test data (see Step 6)

3. **Firestore Security Rules Too Restrictive**
   - Visit Firebase Console → Firestore → Rules
   - Check if rules allow read access
   - Teacher needs permission to read all users

4. **Authentication Issues**
   - Verify teacher account exists in Firebase Auth
   - Ensure credentials are correct
   - Check console for auth errors

### Step-by-Step Troubleshooting

**Check 1: Is the app deployed?**
```bash
firebase hosting:channel:list
```

**Check 2: Are there console errors?**
- Open your hosting URL
- Press F12 → Console
- Log in as teacher
- Look for red errors mentioning Firestore or permissions

**Check 3: Does data exist?**
- Go to Firebase Console
- Firestore Database
- Check `users` collection for student documents
- Check `student_progress` collection

**Check 4: Are Firestore rules correct?**
- Firebase Console → Firestore → Rules
- Should allow teachers to read users collection
- Paste this in your rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    match /student_progress/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

Then click "Publish"

### Deploy Everything
```bash
firebase deploy
```

### Deploy with Progress Output
```bash
firebase deploy --only hosting -v
```

## Step 5: Verify Deployment

After deployment completes, you'll see:
```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/your-project-id
Hosting URL: https://your-project-id.web.app
```

Visit the hosting URL to verify the app is deployed.

## Step 6: Add Test Data to Firestore

### Create Test Students

1. Go to Firebase Console → Firestore Database
2. Create a `users` collection if it doesn't exist
3. Add documents with this structure:

**Document ID:** `student1@example.com` (or use auto ID)
```json
{
  "email": "student@example.com",
  "name": "John Student",
  "role": "student"
}
```

4. Create `student_progress` collection
5. Add documents with structure:

**Document ID:** Same as student UID
```json
{
  "ankle": 45,
  "knee": 60,
  "terminology": 30,
  "userId": "student-uid-here",
  "createdAt": "timestamp"
}
```

## Step 7: Test Login

Use these demo credentials:
- **Student:** student@example.com / password
- **Teacher:** teacher@example.com / password

First-time setup: Create these accounts in Firebase Auth → Users tab

## Troubleshooting

### "Hosting URL not found"
```bash
firebase use --add
# Select your project
```

### "App is empty after deploy"
1. Check browser console for errors (F12)
2. Verify Firebase config in `firebase-logic.js`
3. Check Firestore rules allow access
4. Ensure student data exists in Firestore

### "Teacher dashboard shows no students"
1. Verify students exist in `users` collection
2. Check students have `role: "student"`
3. Verify `student_progress` documents exist
4. Check browser console for errors

### "Permission denied" errors
Update Firestore rules to:
```javascript
match /users/{document=**} {
  allow read: if request.auth != null;
  allow write: if request.auth.uid == resource.id;
}

match /student_progress/{document=**} {
  allow read: if request.auth != null;
  allow write: if request.auth.uid == resource.id;
}
```

## Manual Deployment Without localhost

### Option 1: Direct Firebase Deploy (Recommended)
```bash
cd /workspaces/demo
firebase deploy --only hosting
```

### Option 2: Build and Deploy
```bash
# Static files are ready to deploy
firebase deploy --only hosting
```

### Option 3: Using Firebase Emulator (Local Testing Before Deploy)
```bash
firebase emulators:start
# Visit http://localhost:4000 to test
# Then deploy when ready
firebase deploy --only hosting
```

## Verify Deployment Success

### Check Hosting
```bash
firebase hosting:channel:list
```

### View Logs
```bash
firebase functions:log
```

### Monitor Performance
Visit Firebase Console → Hosting → Usage

## Next Steps After Deployment

1. **Share the URL** with students: `https://your-project-id.web.app`
2. **Monitor usage** in Firebase Console
3. **Update credentials** if needed
4. **Set up SSL** (automatic with Firebase)
5. **Enable analytics** in Firebase Console → Analytics

## Common Commands

```bash
# Check current project
firebase projects:list

# Switch project
firebase use [project-id]

# Deploy with specific rules
firebase deploy --only firestore:rules --only hosting

# Preview deployment
firebase hosting:channel:deploy preview-channel

# Delete a deployment
firebase hosting:delete
```

## Environment Configuration

Your `firebase-logic.js` contains:
```javascript
var firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "1:YOUR_APP_ID:web:YOUR_WEB_ID",
  measurementId: "G-YOUR_MEASUREMENT_ID"
};
```

This is **public configuration** - it's safe to keep in the code.

---

**For more help:** Visit [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
