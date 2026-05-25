import React from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useSettingsStore } from '@/store/settingsStore';
import Button from '@/components/ui/Button';

interface PronunciationCardProps {
  term: string;
  phonetic: string;
  pronunciation_guide: string;
  definition_en: string;
  definition_es: string;
  codeExample?: string;
  contextSentence: string;
}

const PronunciationCard: React.FC<PronunciationCardProps> = ({
  term,
  phonetic,
  pronunciation_guide,
  definition_en,
  definition_es,
  codeExample,
  contextSentence,
}) => {
  const { speak, isSupported } = useSpeechSynthesis();
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);

  const handleSpeak = () => {
    if (soundEnabled && isSupported) {
      speak(term, 'en-US');
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-bg-card to-bg-elevated border border-primary-500 border-opacity-30 rounded-2xl p-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Term */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-4xl font-bold text-primary-500 mb-2">{term}</h2>
          <p className="text-xl text-secondary font-mono">{phonetic}</p>
        </div>
        <motion.button
          onClick={handleSpeak}
          className="w-16 h-16 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          disabled={!isSupported || !soundEnabled}
        >
          <Volume2 size={32} />
        </motion.button>
      </div>

      {/* Pronunciation Guide */}
      <div className="mb-6 p-4 bg-bg-elevated rounded-xl">
        <p className="text-sm text-text-secondary mb-1">How to pronounce:</p>
        <p className="text-lg italic text-text-primary">{pronunciation_guide}</p>
      </div>

      {/* Definitions */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-primary-500 bg-opacity-10 rounded-xl border border-primary-500 border-opacity-20">
          <p className="text-sm text-primary-400 mb-2 font-semibold">English</p>
          <p className="text-text-primary">{definition_en}</p>
        </div>
        <div className="p-4 bg-secondary bg-opacity-10 rounded-xl border border-secondary border-opacity-20">
          <p className="text-sm text-secondary mb-2 font-semibold">Español</p>
          <p className="text-text-primary">{definition_es}</p>
        </div>
      </div>

      {/* Context Sentence */}
      <div className="mb-6 p-4 bg-bg-elevated rounded-xl border-l-4 border-warning">
        <p className="text-sm text-text-secondary mb-2">In Context:</p>
        <p className="text-text-primary italic">"{contextSentence}"</p>
      </div>

      {/* Code Example */}
      {codeExample && (
        <div className="mb-6 p-4 bg-black rounded-xl font-mono text-sm overflow-x-auto">
          <p className="text-text-secondary mb-2">Code Example:</p>
          <pre className="text-secondary whitespace-pre-wrap break-words">{codeExample}</pre>
        </div>
      )}
    </motion.div>
  );
};

export default PronunciationCard;
