import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { ExerciseResult } from '@/types/index';

interface MultipleChoiceProps {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  onSubmit: (result: ExerciseResult) => void;
}

const MultipleChoiceExercise: React.FC<MultipleChoiceProps> = ({
  question,
  options,
  correctAnswer,
  explanation,
  onSubmit,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const isCorrect = selectedAnswer === correctAnswer;

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const result: ExerciseResult = {
      isCorrect,
      score: isCorrect ? 100 : 0,
      xpEarned: isCorrect ? 10 : 0,
      feedback: isCorrect ? '✓ Correct!' : explanation,
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

      <div className="space-y-3 mb-8">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrectOption = option === correctAnswer;
          let bgColor = 'bg-bg-elevated';

          if (submitted) {
            bgColor = isCorrectOption ? 'bg-secondary bg-opacity-30' : isSelected ? 'bg-accent bg-opacity-30' : 'bg-bg-elevated';
          } else if (isSelected) {
            bgColor = 'bg-primary-500 bg-opacity-30';
          }

          return (
            <motion.button
              key={index}
              onClick={() => !submitted && setSelectedAnswer(option)}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                isSelected && !submitted
                  ? 'border-primary-500 bg-primary-500 bg-opacity-20'
                  : 'border-border-color hover:border-primary-500'
              } ${bgColor} disabled:opacity-50`}
              disabled={submitted}
              whileHover={!submitted ? { scale: 1.02 } : {}}
              whileTap={!submitted ? { scale: 0.98 } : {}}
            >
              <span className="font-semibold text-text-primary">{option}</span>
            </motion.button>
          );
        })}
      </div>

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
        disabled={!selectedAnswer || submitted}
        size="lg"
        className="w-full"
      >
        {submitted ? 'Loading...' : 'Check Answer'}
      </Button>
    </motion.div>
  );
};

export default MultipleChoiceExercise;
