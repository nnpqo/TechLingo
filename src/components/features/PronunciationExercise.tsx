import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Volume2 } from 'lucide-react';
import { useSpeechRecognition, PronunciationResult } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useSettingsStore } from '@/store/settingsStore';
import Button from '@/components/ui/Button';
import { ExerciseResult } from '@/types/index';

interface PronunciationExerciseProps {
  term: string;
  phonetic: string;
  pronunciation_guide: string;
  onSubmit: (result: ExerciseResult) => void;
}

const PronunciationExercise: React.FC<PronunciationExerciseProps> = ({
  term,
  phonetic,
  pronunciation_guide,
  onSubmit,
}) => {
  const { startListening, stopListening, isListening, isSupported, error, clearError } =
    useSpeechRecognition();
  const { speak, isSupported: speechSupported } = useSpeechSynthesis();
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleListen = () => {
    if (soundEnabled && speechSupported) {
      speak(term, 'en-US');
    }
  };

  const handleStartRecording = () => {
    clearError();
    setResult(null);
    startListening((pronunciationResult) => {
      setResult(pronunciationResult);
      setShowFeedback(true);
    }, term);
  };

  const handleSubmitPronunciation = () => {
    if (!result) return;

    const exerciseResult: ExerciseResult = {
      isCorrect: result.isCorrect,
      score: result.score,
      xpEarned: result.isCorrect ? 15 : 0,
      feedback: result.feedback,
      correctAnswer: term,
    };

    onSubmit(exerciseResult);
  };

  return (
    <motion.div
      className="bg-bg-card border border-border-color rounded-2xl p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-text-primary mb-2">Pronunciation Practice</h3>
        <p className="text-text-secondary">Listen and repeat the following term</p>
      </div>

      {/* Term Display */}
      <div className="text-center mb-8 p-6 bg-bg-elevated rounded-xl">
        <p className="text-3xl font-bold text-primary-500 mb-2">{term}</p>
        <p className="text-lg font-mono text-secondary mb-3">{phonetic}</p>
        <p className="text-sm text-text-secondary italic">{pronunciation_guide}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center mb-8 flex-wrap">
        <Button
          onClick={handleListen}
          variant="secondary"
          size="lg"
          disabled={!soundEnabled || !speechSupported}
        >
          <Volume2 size={20} />
          Listen
        </Button>

        <Button
          onClick={handleStartRecording}
          disabled={!isSupported || isListening}
          size="lg"
          className={isListening ? 'bg-accent' : ''}
        >
          <Mic size={20} />
          {isListening ? 'Recording...' : 'Record'}
        </Button>

        {!isSupported || error ? (
          <Button
            onClick={() => {
              const demoResult: ExerciseResult = {
                isCorrect: true,
                score: 85,
                xpEarned: 15,
                feedback: '✓ Demo mode - practicing!',
                correctAnswer: term,
              };
              onSubmit(demoResult);
            }}
            variant="outline"
            size="lg"
          >
            Continue →
          </Button>
        ) : null}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          className="p-4 bg-accent bg-opacity-10 border border-accent rounded-xl mb-6 text-accent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}

      {/* Result */}
      {showFeedback && result && (
        <motion.div
          className={`p-6 rounded-xl mb-6 ${
            result.isCorrect
              ? 'bg-secondary bg-opacity-20 border border-secondary'
              : 'bg-accent bg-opacity-20 border border-accent'
          }`}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <p className="font-semibold mb-2">You said: "{result.spoken}"</p>
          <p className="text-lg font-bold mb-4">Accuracy: {result.score}%</p>
          <p className={result.isCorrect ? 'text-secondary' : 'text-accent'}>{result.feedback}</p>
        </motion.div>
      )}

      {/* Submit Button */}
      {showFeedback && result && (
        <div className="flex gap-4">
          <Button
            onClick={() => {
              setResult(null);
              setShowFeedback(false);
            }}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            Try Again
          </Button>
          <Button onClick={handleSubmitPronunciation} size="lg" className="flex-1">
            Continue
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default PronunciationExercise;
