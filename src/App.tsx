import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import Login from '@/pages/Login';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Home, Areas, Glossary, Progress, Settings, Lesson, LearningPath } from '@/pages';
import { useUserStore } from '@/store/userStore';

const AppContent: React.FC = () => {
  const [user] = useAuthState(auth);
  const { setProfile } = useUserStore();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
    if (user) {
      // Fetch user profile from Firestore
      const fetchUserProfile = async () => {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setProfile({
              name: data.name || user.displayName || 'Learner',
              email: user.email || '',
              photoURL: user.photoURL || '',
              createdAt: data.createdAt,
              currentLevel: data.currentLevel || 1,
              totalXP: data.totalXP || 0,
              streak: data.streak || 0,
              lastStudiedDate: data.lastStudiedDate || new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };
      fetchUserProfile();
    }
  }, [user, setProfile]);

  if (isLoginPage) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-bg-dark text-text-primary">
      <Header />

      <AnimatePresence mode="wait">
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen"
        >
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/areas"
              element={
                <ProtectedRoute>
                  <Areas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lesson/:areaId/:lessonId"
              element={
                <ProtectedRoute>
                  <Lesson />
                </ProtectedRoute>
              }
            />
            <Route
              path="/glossary"
              element={
                <ProtectedRoute>
                  <Glossary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learning-path"
              element={
                <ProtectedRoute>
                  <LearningPath />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.main>
      </AnimatePresence>

      {!isLoginPage && <BottomNav />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
