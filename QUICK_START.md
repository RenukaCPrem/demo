# Quick Start Guide - Teacher Dashboard Setup

## Your Deploy Command is ✅ CORRECT!

```bash
firebase deploy --only hosting
```

This is the **right command** to deploy your app to Firebase.

## Why Dashboard is Empty - Most Likely Cause

**You haven't added student data to Firestore yet.**

The dashboard is empty because there are no students in your database. Here's what you need:

## 5-Minute Setup

### 1. Create Sample Data (2 min)

Go to [Firebase Console](https://console.firebase.google.com):

1. Select your project
2. Click **Firestore Database**
3. Click **+ Add collection** → Name: `users`
4. Click **+ Add document** and add:
   ```
   email: student@example.com (string)
   name: John Student (string)
   role: student (string)
   ```
5. Click **+ Add document** again and add:
   ```
   email: teacher@example.com (string)
   name: Jane Teacher (string)
   role: teacher (string)
   ```
6. Click **+ Add collection** → Name: `student_progress`
7. Click **+ Add document** and add:
   ```
   ankle: 45 (number)
   knee: 60 (number)
   terminology: 30 (number)
   userId: student@example.com (string)
   ```

### 2. Create Auth Accounts (2 min)

1. Go to **Authentication** → **Users** tab
2. Click **+ Add user**
   - Email: `student@example.com`
   - Password: `password`
3. Click **+ Add user** again
   - Email: `teacher@example.com`
   - Password: `password`

### 3. Update Firestore Rules (1 min)

1. Go to Firestore → **Rules** tab
2. Replace with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{document=**} {
      allow read: if request.auth != null;
    }
    match /student_progress/{document=**} {
      allow read: if request.auth != null;
    }
  }
}
```
3. Click **Publish**

### 4. Redeploy (1 min)

```bash
firebase deploy --only hosting
```

### 5. Test

1. Open your Firebase hosting URL
2. Log in as: teacher@example.com / password
3. **Dashboard should now show student cards!** ✅

## What You'll See

The teacher dashboard displays:
- **Overview stats**: Total students, active users, class average progress
- **Student cards**: Each student's overall progress and progress by chapter

## Files to Help You

| File | Purpose |
|------|---------|
| `FIREBASE_DEPLOYMENT_GUIDE.md` | Complete deployment instructions |
| `FIRESTORE_SETUP_GUIDE.md` | Database structure with examples |
| `TROUBLESHOOTING_EMPTY_DASHBOARD.md` | Debug the empty dashboard issue |
| `setup-test-data.sh` | Helper script (bash) |

## Common Issues

### "Still seeing empty dashboard after setup?"

**Step 1:** Open DevTools (F12) → Console
- Look for error messages
- Share any red errors

**Step 2:** Check Firestore has data
- Firebase Console → Firestore
- Verify `users` collection exists
- Verify `student_progress` collection exists

**Step 3:** Clear cache and reload
- Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
- Clear all data
- Refresh page

### "Permission denied error?"

Update Firestore rules (see step 3 above) and click Publish.

### "No students found error?"

You need to add student documents to the `users` collection (see step 1 above).

## Next Steps

1. ✅ Follow the 5-minute setup above
2. ✅ Deploy with: `firebase deploy --only hosting`
3. ✅ Log in and verify dashboard works
4. 📖 Read `FIRESTORE_SETUP_GUIDE.md` for production data structure
5. 🔒 Set up more secure Firestore rules before production

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│           Firebase Hosting                       │
│  (Your HTML, CSS, JavaScript deployed here)    │
│  🌐 https://your-project.web.app               │
└────────┬────────────────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────────────────┐
│        Firebase Authentication                  │
│  (Email/password login)                         │
└────────┬────────────────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────────────────┐
│        Firebase Firestore                       │
│  (Database with users & student_progress)      │
└─────────────────────────────────────────────────┘
```

When you login as a teacher:
1. Browser fetches your app from Firebase Hosting
2. App authenticates your email/password via Firebase Auth
3. App reads `users` and `student_progress` from Firestore
4. Dashboard displays all students and their progress

## Deploy Command Summary

| Command | Purpose |
|---------|---------|
| `firebase deploy --only hosting` | Deploy app (CORRECT ✅) |
| `firebase deploy --only firestore:rules` | Deploy just Firestore rules |
| `firebase deploy` | Deploy everything |
| `firebase hosting:channel:deploy preview` | Deploy to preview URL |

**You're using the right command!** The issue is just that you need to add data to Firestore.

---

**Questions?** Check the other guide files or visit the [Firebase Docs](https://firebase.google.com/docs)
