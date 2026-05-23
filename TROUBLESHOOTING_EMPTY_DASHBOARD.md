# Troubleshooting Empty Teacher Dashboard

## Quick Diagnosis

When your teacher dashboard shows "No students found", follow these steps:

## Step 1: Check Browser Console (F12)

1. Open your Firebase hosting URL
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Log in as teacher
5. Look for error messages

### Common Console Errors

**Error: "Permission denied"**
- Firestore rules are too restrictive
- Solution: Update Firestore Rules (see Step 5 in guide)

**Error: "No documents found"**
- Students don't exist in database
- Solution: Add test data (see below)

**Error: "Cannot find Firebase"**
- Firebase SDK didn't load
- Solution: Check internet connection, refresh page

## Step 2: Verify Students Exist in Firestore

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click **Firestore Database** in left sidebar
4. Look for **`users`** collection
5. Should see documents like:
   - `student@example.com` (or auto ID)

If NOT there, **Add Test Students:**
- Click **+ Add collection**
- Name: `users`
- Click **+ Add document**
- Document ID: `student@example.com` (optional)
- Add fields:
  - `email` (string): `student@example.com`
  - `name` (string): `John Student`
  - `role` (string): `student`

## Step 3: Verify Student Progress Data

1. In Firestore, find **`student_progress`** collection
2. Should have document for each student
3. Document structure:
```json
{
  "ankle": 45,
  "knee": 60,
  "terminology": 30,
  "userId": "student-uid",
  "createdAt": "timestamp"
}
```

If NOT there:
- Click **+ Add collection** → `student_progress`
- Add document with above structure

## Step 4: Verify Authentication

1. Go to Firebase Console → **Authentication**
2. Check **Users** tab
3. Should see at least 2 users:
   - `student@example.com`
   - `teacher@example.com`

If NOT there:
- Click **+ Add user**
- Email: `student@example.com`
- Password: `password`
- Click **Create user**
- Repeat for teacher

## Step 5: Update Firestore Rules

1. Go to Firebase Console → Firestore → **Rules** tab
2. Replace all content with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read all users
    match /users/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == resource.id;
    }
    
    // Allow users to read all progress
    match /student_progress/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == resource.id;
    }
  }
}
```

3. Click **Publish**
4. Wait for rules to deploy (⏳)

## Step 6: Redeploy Your App

```bash
cd /workspaces/demo
firebase deploy --only hosting
```

## Step 7: Test

1. Visit your hosting URL
2. Open DevTools (F12)
3. Go to **Console** tab
4. Log in as teacher@example.com / password
5. You should see helpful messages like:
   - ✅ Users snapshot received: X documents
   - ✅ Found X students
   - ✅ Student list updated

6. Dashboard should show student cards

## Debug Mode: Check Console Output

Watch for these in console:

```
═══════════════════════════════════════
🎓 Initializing Teacher Dashboard...
═══════════════════════════════════════
👤 Current user: (UID)
🔄 Fetching all documents from users collection...
✅ Users snapshot received: 2 documents
📝 Processing user student@example.com: student
📊 Student John Student progress: {ankle: 45, knee: 60, ...}
✅ Found 1 students
✅ Student list updated
═══════════════════════════════════════
✅ Teacher dashboard initialized successfully
═══════════════════════════════════════
```

## If Still Empty

### Option 1: Check Server Logs
```bash
firebase functions:log
```

### Option 2: Check Hosting Logs
```bash
firebase hosting:log
```

### Option 3: Clear Cache
```bash
# Clear browser cache
# Press Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
# Clear all data
# Or use incognito/private window
```

### Option 4: Test Locally First
```bash
# Before deploying to production
firebase emulators:start
# Visit http://localhost:4000
```

## Still Having Issues?

Check these files:
1. **firebase-logic.js** - Contains initialization code
2. **firebase.json** - Contains deployment config
3. **.firebaserc** - Contains project ID

## Need More Help?

- [Firebase Firestore Docs](https://firebase.google.com/docs/firestore)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com)
