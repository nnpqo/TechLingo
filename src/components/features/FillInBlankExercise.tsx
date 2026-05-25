import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { ExerciseResult } from '@/types/index';

interface FillInBlankProps {
  question: string;
  correctAnswer: string;
  explanation: string;
  hints: string[];
  onSubmit: (result: ExerciseResult) => void;
}

const FillInBlankExercise: React.FC<FillInBlankProps> = ({
  question,
  correctAnswer,
  explanation,
  hints,
  onSubmit,
}) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [usedHints, setUsedHints] = useState(0);
  const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;

    const result: ExerciseResult = {
      isCorrect,
      score: isCorrect ? Math.max(50, 100 - usedHints * 25) : 0,
      xpEarned: isCorrect ? 10 : 0,
      feedback: isCorrect ? '✓ Correct!' : `The correct answer is: ${correctAnswer}`,
      correctAnswer,
    };

    setSubmitted(true);
    setTimeout(() => {
      onSubmit(result);
    }, 1500);
  };

  return (
    <motion.div
      className="bg-bg-card border border-border-color rounded-2xl p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-2xl font-bold text-text-primary mb-8">{question}</h3>

      <div className="mb-8">
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => !submitted && setUserAnswer(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !submitted && handleSubmit()}
          disabled={submitted}
          placeholder="Type your answer..."
          className="w-full px-4 py-3 rounded-xl bg-bg-elevated border-2 border-border-color focus:border-primary-500 text-text-primary placeholder-text-secondary focus:outline-none transition-colors disabled:opacity-50"
        />
      </div>

      {/* Hints */}
      {!submitted && usedHints < hints.length && (
        <motion.button
          onClick={() => setUsedHints(usedHints + 1)}
          className="mb-6 px-4 py-2 rounded-lg text-sm bg-warning bg-opacity-20 text-warning border border-warning border-opacity-50 hover:bg-opacity-30 transition-all"
          whileHover={{ scale: 1.05 }}
        >
          Hint ({usedHints + 1}/{hints.length})
        </motion.button>
      )}

      {usedHints > 0 && (
        <motion.div className="mb-6 p-4 bg-warning bg-opacity-10 border border-warning rounded-xl">
          <p className="text-text-secondary text-sm mb-1">Hint:</p>
          <p className="text-warning font-semibold">{hints[usedHints - 1]}</p>
        </motion.div>
      )}

      {submitted && (
        <motion.div
          className={`p-4 rounded-xl mb-6 ${
            isCorrect
              ? 'bg-secondary bg-opacity-20 border border-secondary'
              : 'bg-accent bg-opacity-20 border border-accent'
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className={`font-semibold ${isCorrect ? 'text-secondary' : 'text-accent'}`}>
            {explanation}
          </p>
        </motion.div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!userAnswer.trim() || submitted}
        size="lg"
        className="w-full"
      >
        {submitted ? 'Loading...' : 'Check Answer'}
      </Button>
    </motion.div>
  );
};

export default FillInBlankExercise;
