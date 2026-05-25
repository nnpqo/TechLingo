import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { Home, Areas, Glossary, Progress, Settings, Lesson, LearningPath } from '@/pages';
import { useUserStore } from '@/store/userStore';

const App: React.FC = () => {
  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);

  useEffect(() => {
    // Initialize user profile if needed
    if (!profile.name || profile.name === 'Learner') {
      // Profile already initialized from localStorage via Zustand persist
    }
  }, []);

  return (
    <BrowserRouter>
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
              <Route path="/" element={<Home />} />
              <Route path="/areas" element={<Areas />} />
              <Route path="/lesson/:areaId/:lessonId" element={<Lesson />} />
              <Route path="/glossary" element={<Glossary />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/learning-path" element={<LearningPath />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.main>
        </AnimatePresence>

        <BottomNav />
      </div>
    </BrowserRouter>
  );
};

export default App;
