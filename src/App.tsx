import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { Home, Areas, Settings, Lesson, Auth, Profile } from '@/pages';
import { useUserStore } from '@/store/userStore';

const RequireAuth: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = useUserStore((s) => s.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

const App: React.FC = () => {
  const isAuthenticated = useUserStore((s) => s.auth.isAuthenticated);

  return (
    <HashRouter>
      <div className="min-h-screen bg-bg-dark text-text-primary">
        {isAuthenticated && <Header />}

        <AnimatePresence mode="wait">
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            <Routes>
              <Route path="/auth" element={<Auth />} />

              <Route element={<RequireAuth />}>
                <Route path="/" element={<Home />} />
                <Route path="/areas" element={<Areas />} />
                <Route path="/lesson/:areaId/:lessonId" element={<Lesson />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />

                {/* Backwards compat */}
                <Route path="/progress" element={<Navigate to="/profile" replace />} />
                <Route path="/glossary" element={<Navigate to="/areas" replace />} />
                <Route path="/learning-path" element={<Navigate to="/areas" replace />} />
              </Route>

              <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/auth'} replace />} />
            </Routes>
          </motion.main>
        </AnimatePresence>

        {isAuthenticated && <BottomNav />}
      </div>
    </HashRouter>
  );
};

export default App;
