import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import LevelBadge from '@/components/ui/LevelBadge';
import { useSettingsStore } from '@/store/settingsStore';
import { useUserStore } from '@/store/userStore';
import { Music, Volume2, Zap, RotateCcw } from 'lucide-react';

const Settings: React.FC = () => {
  const { theme, soundEnabled, speechRate, preferredAccent, setTheme, setSoundEnabled, setSpeechRate, setPreferredAccent } =
    useSettingsStore();
  const { profile } = useUserStore();

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      window.localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-2">Settings</h1>
          <p className="text-lg text-text-secondary">Customize your TechLingo experience</p>
        </motion.div>

        {/* Profile Section */}
        <Card className="mb-8">
          <div className="flex items-center gap-6 mb-8">
            <LevelBadge level={profile.currentLevel} name="User" badge={['🌱', '💻', '⚡', '🏆', '🚀', '🏗️'][profile.currentLevel - 1]} size="lg" />
            <div>
              <h2 className="text-2xl font-bold mb-1">{profile.name}</h2>
              <p className="text-text-secondary">Level {profile.currentLevel}</p>
              <div className="mt-3 flex gap-4">
                <div>
                  <span className="text-lg font-bold text-primary-500">{profile.totalXP}</span>
                  <span className="text-sm text-text-secondary ml-1">Total XP</span>
                </div>
                <div>
                  <span className="text-lg font-bold text-secondary">🔥 {profile.streak}</span>
                  <span className="text-sm text-text-secondary ml-1">Day Streak</span>
                </div>
              </div>
            </div>
          </div>
          <Button variant="outline" size="lg" className="w-full">
            Edit Profile
          </Button>
        </Card>

        {/* Audio Settings */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold mb-6">🔊 Audio Settings</h2>

          {/* Sound Toggle */}
          <div className="mb-6 flex items-center justify-between p-4 bg-bg-elevated rounded-xl">
            <div className="flex items-center gap-3">
              <Volume2 className="w-6 h-6 text-primary-500" />
              <div>
                <p className="font-semibold">Sound Effects</p>
                <p className="text-sm text-text-secondary">Enable audio feedback and pronunciation</p>
              </div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-12 h-6 rounded-full transition-colors ${
                soundEnabled ? 'bg-secondary' : 'bg-bg-card border border-border-color'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* Speech Rate */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-warning" />
                <p className="font-semibold">Speech Rate</p>
              </div>
              <span className="text-sm text-text-secondary">{(speechRate * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="w-full h-2 bg-bg-elevated rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
            <p className="text-xs text-text-secondary mt-2">Adjust how fast the pronunciation audio plays</p>
          </div>

          {/* Accent Selection */}
          <div>
            <p className="font-semibold mb-3">Preferred Accent</p>
            <div className="grid grid-cols-2 gap-3">
              {['us', 'uk'].map((accent) => (
                <button
                  key={accent}
                  onClick={() => setPreferredAccent(accent as 'us' | 'uk')}
                  className={`p-3 rounded-xl border-2 transition-all font-semibold uppercase ${
                    preferredAccent === accent
                      ? 'border-primary-500 bg-primary-500 bg-opacity-20 text-primary-500'
                      : 'border-border-color text-text-secondary hover:border-primary-500'
                  }`}
                >
                  {accent === 'us' ? '🇺🇸 American' : '🇬🇧 British'}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Appearance Settings */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold mb-6">🎨 Appearance</h2>

          <div className="p-4 bg-bg-elevated rounded-xl border-l-4 border-secondary">
            <p className="font-semibold mb-1">Theme</p>
            <p className="text-sm text-text-secondary mb-3">Currently using Dark theme (optimized for learning sessions)</p>
            <Badge label="🌙 Dark Mode" variant="primary" />
          </div>
        </Card>

        {/* Data Settings */}
        <Card>
          <h2 className="text-2xl font-bold mb-6">⚙️ Data & Privacy</h2>

          <div className="space-y-4">
            <div className="p-4 bg-bg-elevated rounded-xl">
              <h3 className="font-semibold mb-2">Data Storage</h3>
              <p className="text-sm text-text-secondary mb-4">Your progress is saved locally in your browser. No server uploads.</p>
              <div className="flex gap-2">
                <Badge label="✓ Offline First" variant="success" size="sm" />
                <Badge label="✓ Private" variant="success" size="sm" />
              </div>
            </div>

            <div className="p-4 bg-bg-elevated rounded-xl">
              <h3 className="font-semibold mb-2">Danger Zone</h3>
              <p className="text-sm text-text-secondary mb-4">Reset all progress and data. This action cannot be undone.</p>
              <Button onClick={handleReset} variant="danger" size="lg" className="w-full">
                <RotateCcw className="w-4 h-4" />
                Reset All Progress
              </Button>
            </div>
          </div>
        </Card>

        {/* About */}
        <div className="mt-12 text-center text-text-secondary">
          <p className="text-sm">TechLingo v1.0.0</p>
          <p className="text-xs mt-2">Made with ❤️ for tech professionals learning English</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
