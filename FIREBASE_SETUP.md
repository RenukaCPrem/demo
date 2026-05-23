# Firebase Setup Guide - ATlas

## ⚠️ Important: You Must Complete These Steps for Login to Work

The application is deployed, but you need to set up Firebase before login will work.

---

## Step 1: Create Demo Users in Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project **"fir-f2cd1"**
3. Go to **Authentication** (left sidebar)
4. Click **"Users"** tab
5. Click **"Add User"** button

### Create Student Account
- **Email**: `student@example.com`
- **Password**: `password`
- Click **"Add User"**

### Create Teacher Account
- **Email**: `teacher@example.com`
- **Password**: `password`
- Click **"Add User"**

---

## Step 2: Create Firestore Collections

1. Go to **Firestore Database** (left sidebar)
2. Click **"Create Database"** (if not already created)
3. Start in **test mode** (or configure security rules below)

### Create "users" Collection

1. Click **"+ Start collection"**
2. Collection ID: `users`
3. Click **"Next"**
4. Click **"Auto ID"** to create first document, then fill:

**For student@example.com:**
- Document ID: [Use the UID from Firebase Auth - or just use "student-uid"]
- Add fields:
  ```
  email: "student@example.com" (string)
  name: "John Doe" (string)
  role: "student" (string)
  ```
- Click **"Save"**

**For teacher@example.com:**
- Click **"+ Add document"**
- Document ID: [Use the UID from Firebase Auth - or use "teacher-uid"]
- Add fields:
  ```
  email: "teacher@example.com" (string)
  name: "Ms. Smith" (string)
  role: "teacher" (string)
  ```
- Click **"Save"**

### Create "student_progress" Collection

1. Click **"+ Start collection"** (or from Firestore root)
2. Collection ID: `student_progress`
3. Click **"Next"**

**Create student progress document:**
- Document ID: [Same UID as student user document]
- Add fields:
  ```
  userId: "student-uid" (string)
  ankle: 0 (number)
  knee: 0 (number)
  terminology: 0 (number)
  ```
- Click **"Save"**

---

## Step 3: Get Real UIDs from Firebase Auth

⚠️ **Important**: For the login to actually work, you need to use the real UIDs from Firebase Authentication.

1. Go to **Authentication > Users**
2. Click on the **student@example.com** user
3. Copy the **UID** from the top right
4. Go to **Firestore Database > users** collection
5. Create/update the student document with that UID as the document ID

Repeat for the teacher account.

---

## Step 4: Configure Firestore Security Rules (Optional)

For better security, replace the default rules:

1. Go to **Firestore Database > Rules**
2. Paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Students can read/write their own progress
    match /student_progress/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Teachers can read all student progress
    match /student_progress/{document=**} {
      allow read: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher';
    }
  }
}
```

3. Click **"Publish"**

---

## Step 5: Test Login

1. Go to: https://fir-f2cd1.web.app
2. Select **"Student"** role
3. Enter: `student@example.com` / `password`
4. Click **"Sign In"**

You should see the student dashboard!

---

## If Login Still Doesn't Work:

1. **Check Browser Console** (Press F12)
   - Look for red errors
   - Screenshot and share the error

2. **Verify User exists in Firebase Auth**
   - Go to Authentication > Users
   - Do you see student@example.com?

3. **Verify Firestore Document exists**
   - Go to Firestore Database > users collection
   - Do you see a document with the student user's UID?
   - Does it have `role: "student"`?

4. **Check student_progress collection**
   - Go to Firestore Database > student_progress
   - Does a document exist with the student's UID?

---

## Document Structure Reference

Your Firestore should look like this:

```
fir-f2cd1/
├── users/
│   ├── abc123def456... (student UID)
│   │   ├── email: "student@example.com"
│   │   ├── name: "John Doe"
│   │   └── role: "student"
│   │
│   └── xyz789uvw123... (teacher UID)
│       ├── email: "teacher@example.com"
│       ├── name: "Ms. Smith"
│       └── role: "teacher"
│
└── student_progress/
    └── abc123def456... (same as student UID)
        ├── userId: "abc123def456..."
        ├── ankle: 0
        ├── knee: 0
        └── terminology: 0
```

---

## Next Steps

Once login is working:

1. ✅ Click a chapter in the student dashboard
2. ✅ Mark sections as complete
3. ✅ Watch progress update to Firestore
4. ✅ Login as teacher and see student progress

---

**Need Help?**
- Check Firebase documentation: https://firebase.google.com/docs
- Open browser console (F12) for error messages
- Check that email addresses match exactly (case-sensitive in Firestore)
