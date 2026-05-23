# Firestore Database Structure Guide

## Required Collections & Documents

Your Firestore database MUST have this exact structure for the teacher dashboard to work:

```
firestore/
├── users/ (collection)
│   ├── student@example.com (document)
│   │   ├── email: "student@example.com" (string)
│   │   ├── name: "John Student" (string)
│   │   └── role: "student" (string)
│   │
│   ├── jane.student@example.com (document)
│   │   ├── email: "jane.student@example.com" (string)
│   │   ├── name: "Jane Smith" (string)
│   │   └── role: "student" (string)
│   │
│   └── teacher@example.com (document)
│       ├── email: "teacher@example.com" (string)
│       ├── name: "Mr. Teacher" (string)
│       └── role: "teacher" (string)
│
└── student_progress/ (collection)
    ├── student@example.com (document)
    │   ├── ankle: 45 (number)
    │   ├── knee: 60 (number)
    │   ├── terminology: 30 (number)
    │   ├── userId: "student@example.com" (string)
    │   └── createdAt: timestamp (timestamp)
    │
    └── jane.student@example.com (document)
        ├── ankle: 75 (number)
        ├── knee: 85 (number)
        ├── terminology: 70 (number)
        ├── userId: "jane.student@example.com" (string)
        └── createdAt: timestamp (timestamp)
```

## Step-by-Step Setup

### Create `users` Collection

1. Open [Firebase Console](https://console.firebase.google.com)
2. Go to Firestore Database
3. Click **+ Add collection**
4. Name: `users`
5. Click **Auto ID** for the first document (or enter custom ID)
6. Add fields:

| Field | Type | Value |
|-------|------|-------|
| email | String | student@example.com |
| name | String | John Student |
| role | String | student |

7. Click **Save**

8. Click **+ Add document** again
9. Repeat for more students:

**Student 2:**
| Field | Type | Value |
|-------|------|-------|
| email | String | jane.student@example.com |
| name | String | Jane Smith |
| role | String | student |

**Teacher:**
| Field | Type | Value |
|-------|------|-------|
| email | String | teacher@example.com |
| name | String | Mr. Teacher |
| role | String | teacher |

### Create `student_progress` Collection

1. Click **+ Add collection** 
2. Name: `student_progress`
3. Click **Auto ID** (or use document ID matching user email)
4. Add fields:

| Field | Type | Value |
|-------|------|-------|
| ankle | Number | 45 |
| knee | Number | 60 |
| terminology | Number | 30 |
| userId | String | student@example.com |
| createdAt | Timestamp | (auto) |

5. Click **Save**

6. Add more progress documents for each student

## Firebase Authentication Setup

Create these users in Firebase Auth:

1. Go to Firebase Console → **Authentication** → **Users** tab
2. Click **+ Add user**

### User 1 - Student
- Email: `student@example.com`
- Password: `password`
- Click **Create user**

### User 2 - Teacher
- Email: `teacher@example.com`
- Password: `password`
- Click **Create user**

### User 3 - Additional Student (Optional)
- Email: `jane.student@example.com`
- Password: `password`
- Click **Create user**

## Complete Example Data

### Collection: `users`

```json
[
  {
    "id": "student@example.com",
    "data": {
      "email": "student@example.com",
      "name": "John Student",
      "role": "student"
    }
  },
  {
    "id": "jane.student@example.com",
    "data": {
      "email": "jane.student@example.com",
      "name": "Jane Smith",
      "role": "student"
    }
  },
  {
    "id": "bob.student@example.com",
    "data": {
      "email": "bob.student@example.com",
      "name": "Bob Johnson",
      "role": "student"
    }
  },
  {
    "id": "teacher@example.com",
    "data": {
      "email": "teacher@example.com",
      "name": "Mrs. Teacher",
      "role": "teacher"
    }
  }
]
```

### Collection: `student_progress`

```json
[
  {
    "id": "student@example.com",
    "data": {
      "ankle": 45,
      "knee": 60,
      "terminology": 30,
      "userId": "student@example.com",
      "createdAt": "2026-05-23T10:00:00Z"
    }
  },
  {
    "id": "jane.student@example.com",
    "data": {
      "ankle": 75,
      "knee": 85,
      "terminology": 70,
      "userId": "jane.student@example.com",
      "createdAt": "2026-05-23T10:00:00Z"
    }
  },
  {
    "id": "bob.student@example.com",
    "data": {
      "ankle": 30,
      "knee": 40,
      "terminology": 25,
      "userId": "bob.student@example.com",
      "createdAt": "2026-05-23T10:00:00Z"
    }
  }
]
```

## Firestore Rules

Add these security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read users collection
    match /users/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == resource.id;
    }
    
    // Allow authenticated users to read progress
    match /student_progress/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == resource.id;
    }
  }
}
```

## Verification Checklist

- [ ] `users` collection exists
- [ ] At least 1 student document exists with `role: "student"`
- [ ] At least 1 teacher document exists with `role: "teacher"`
- [ ] `student_progress` collection exists
- [ ] Progress documents exist for each student
- [ ] Progress fields are numbers (0-100)
- [ ] Student/teacher accounts exist in Firebase Auth
- [ ] Firestore rules are published
- [ ] App deployed with `firebase deploy --only hosting`

## What the Dashboard Shows

When you log in as a teacher and see the dashboard, it will show:

### Overview Stats
- **Total Students**: Count of users with `role: "student"`
- **Active Now**: 60% of total students
- **Class Average**: Average of all progress percentages

### Student Cards
For each student, displays:
- Name and email
- Status badge (Just Started / In Progress / Nearly Complete)
- Overall progress percentage
- Individual progress for:
  - Ankle Anatomy
  - Knee Anatomy
  - Medical Terms

## Testing the Setup

1. Deploy the app
2. Open in browser
3. Log in as teacher@example.com / password
4. Open DevTools (F12)
5. Go to Console tab
6. You should see:
   ```
   ✅ Users snapshot received: 4 documents
   ✅ Found 3 students
   ✅ Student list updated
   ```
7. Dashboard should display all students and their progress

---

**Still having issues?** Check [TROUBLESHOOTING_EMPTY_DASHBOARD.md](TROUBLESHOOTING_EMPTY_DASHBOARD.md)
