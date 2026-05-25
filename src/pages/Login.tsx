import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '@/config/firebaseConfig';
import { motion } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useUserStore } from '@/store/userStore';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const { setProfile } = useUserStore();
  const [isSigningIn, setIsSigningIn] = React.useState(false);

  useEffect(() => {
    if (user && !loading) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // First time user - create profile
        await setDoc(userRef, {
          name: result.user.displayName || 'Learner',
          email: result.user.email,
          photoURL: result.user.photoURL,
          createdAt: new Date().toISOString(),
          currentLevel: 1,
          totalXP: 0,
          streak: 0,
          lastStudiedDate: new Date().toISOString(),
        });
      }

      // Update local store
      setProfile({
        name: result.user.displayName || 'Learner',
        createdAt: new Date().toISOString(),
        currentLevel: 1,
        totalXP: 0,
        streak: 0,
        lastStudiedDate: new Date().toISOString(),
        email: result.user.email || '',
        photoURL: result.user.photoURL || '',
      });

      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Error signing in. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-dark via-bg-dark to-primary-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-5xl mb-4"
            >
              🚀
            </motion.div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">TechLingo</h1>
            <p className="text-text-secondary">Master Technical English</p>
          </div>

          {/* Description */}
          <div className="mb-8 space-y-4">
            <p className="text-center text-text-secondary">
              Learn programming vocabulary in English through interactive exercises and boost your career.
            </p>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-center gap-2">
                <span className="text-primary-500">✓</span> Interactive lessons across 6 tech areas
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-500">✓</span> Track your progress and earn badges
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-500">✓</span> Practice pronunciation and listening
              </li>
            </ul>
          </div>

          {/* Sign In Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="w-full bg-white text-bg-dark hover:bg-gray-100 font-semibold py-3 flex items-center justify-center gap-2"
            >
              {isSigningIn ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-bg-dark border-t-primary-500 rounded-full" />
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </>
              )}
            </Button>
          </motion.div>

          {/* Footer */}
          <p className="text-xs text-text-secondary text-center mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </Card>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-8 right-1/4 w-96 h-96 bg-secondary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
