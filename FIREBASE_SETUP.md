# Firebase Setup Guide for TechLingo

## Overview
TechLingo now uses Firebase Authentication with Google Sign-In to manage user accounts and progress. This guide will help you set up Firebase for development and production.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `TechLingo`
4. Uncheck "Enable Google Analytics" (optional, for simplicity)
5. Click "Create project"

## Step 2: Register Your Web App

1. In the Firebase Console, click the Web icon (</> symbol)
2. Enter app name: `TechLingo Web`
3. Click "Register app"
4. Firebase will show your configuration

## Step 3: Copy Configuration

1. Copy the Firebase config values from the console
2. Create a `.env.local` file in your project root
3. Add the following variables with your values:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 4: Enable Google Sign-In

1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click **Get started**
3. Click **Google** provider
4. Enable it and add your support email
5. Click **Save**

## Step 5: Configure Authorized Domains

### For Local Development:
- `localhost` is automatically authorized

### For GitHub Pages:
1. Go to **Authentication** → **Settings** (gear icon)
2. Scroll to **Authorized domains**
3. Click **Add domain**
4. Add: `yourusername.github.io`

Example: `nnpqo.github.io`

## Step 6: Create Firestore Database

1. In Firebase Console, go to **Firestore Database** (left sidebar)
2. Click **Create Database**
3. Start in **Test mode** (for development)
4. Select a region close to you
5. Click **Create**

### Security Rules (for Test Mode - Replace Later!)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Public read access to terms and lessons
    match /terms/{document=**} {
      allow read;
    }
    
    match /lessons/{document=**} {
      allow read;
    }
  }
}
```

## Step 7: Run Development Server

```bash
npm run dev
```

The app will redirect unauthenticated users to the login page with a Google Sign-In button.

## Step 8: Deploy to GitHub Pages

1. Make sure your `.env.local` values are set
2. Build the app:
   ```bash
   npm run build
   ```
3. Git push to GitHub:
   ```bash
   git add .
   git commit -m "Add Firebase authentication"
   git push
   ```
4. GitHub Pages will automatically deploy the `dist` folder

### Important: GitHub Pages Domain Authorization
- After deploying, go back to Firebase Console
- Add your GitHub Pages domain to **Authorized domains**
- Example: `nnpqo.github.io`

## Troubleshooting

### "Error: Error signing in" on Login Page
- Check that Google Sign-In is enabled in Firebase
- Verify your domain is in "Authorized domains"
- Check browser console for specific error messages

### Users can't sign in from GitHub Pages
- Make sure `yourusername.github.io` is added to Firestore Authorized Domains

### Data not persisting
- Check that Firestore Database is created
- Verify Firestore Rules allow your user's UID

### "Firebase configuration is missing"
- Create `.env.local` file with all VITE_FIREBASE_* variables
- Restart dev server after adding .env.local

## Environment Variables Reference

| Variable | Source |
|----------|--------|
| `VITE_FIREBASE_API_KEY` | Project Settings → Web App Config → apiKey |
| `VITE_FIREBASE_AUTH_DOMAIN` | Project Settings → Web App Config → authDomain |
| `VITE_FIREBASE_PROJECT_ID` | Project Settings → General → Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Project Settings → Web App Config → storageBucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Project Settings → Web App Config → messagingSenderId |
| `VITE_FIREBASE_APP_ID` | Project Settings → Web App Config → appId |

## Security Best Practices

- ✅ Never commit `.env.local` to git (it's in `.gitignore`)
- ✅ For production, use production Firestore rules (not test mode)
- ✅ Enable CORS properly for your domains
- ✅ Monitor Firebase usage in the Console to catch abuse

## Next Steps

1. Test Google Sign-In in development
2. Create a test user account
3. Verify progress is saved to Firestore
4. Deploy to GitHub Pages
5. Test from production domain

For more help: [Firebase Documentation](https://firebase.google.com/docs/auth)
