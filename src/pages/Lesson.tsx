import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import { PronunciationCard, PronunciationExercise, MultipleChoiceExercise, FillInBlankExercise } from '@/components/features';
import { cybersecurityTerms, frontendTerms, backendTerms, databaseTerms, devopsTerms, networkingTerms } from '@/data/terms';
import { Term, ExerciseResult } from '@/types/index';
import { useUserStore } from '@/store/userStore';
import { useProgress } from '@/hooks/useProgress';
import { ArrowLeft, Heart, Zap } from 'lucide-react';

type ExerciseType = 'pronunciation' | 'fillInBlank' | 'multipleChoice';

const getExerciseType = (termIndex: number): ExerciseType => {
  const types: ExerciseType[] = ['pronunciation', 'fillInBlank', 'multipleChoice'];
  return types[termIndex % types.length];
};

const Lesson: React.FC = () => {
  const { areaId, lessonId } = useParams<{ areaId: string; lessonId: string }>();
  const navigate = useNavigate();
  const updateXP = useUserStore((state) => state.updateXP);
  const recordTermAttempt = useUserStore((state) => state.recordTermAttempt);
  const markTermLearned = useUserStore((state) => state.markTermLearned);
  const updateStreak = useUserStore((state) => state.updateStreak);
  const profile = useUserStore((state) => state.profile);
  const { getLevelInfo } = useProgress();
  const levelInfo = getLevelInfo();
  
  const [terms, setTerms] = useState<Term[]>([]);
  const [currentTermIndex, setCurrentTermIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [lessonXP, setLessonXP] = useState(0);

  // Get lesson difficulty based on user level
  const getLessonLevel = (): 'beginner' | 'intermediate' | 'advanced' => {
    if (levelInfo.number >= 5) return 'advanced';
    if (levelInfo.number >= 3) return 'intermediate';
    return 'beginner';
  };

  // Get terms for the selected area - all terms shuffled randomly
  useEffect(() => {
    const areaTermMap: Record<string, Term[]> = {
      cybersecurity: cybersecurityTerms,
      frontend: frontendTerms,
      backend: backendTerms,
      database: databaseTerms,
      devops: devopsTerms,
      networking: networkingTerms,
    };

    const areaTerms = areaTermMap[areaId || ''] || [];
    
    // Get all terms from the selected area
    let availableTerms = areaTerms.length > 0 ? areaTerms : [];
    
    // Shuffle array using Fisher-Yates algorithm
    const shuffled = [...availableTerms].sort(() => Math.random() - 0.5);
    
    // Take 20 terms per sesión (o todos si hay menos de 20)
    const selectedTerms = shuffled.slice(0, Math.min(20, shuffled.length));

    setTerms(selectedTerms.length > 0 ? selectedTerms : availableTerms.slice(0, 10));
    setCurrentTermIndex(0);
  }, [areaId]);

  if (terms.length === 0) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <Card className="text-center">
          <p className="text-lg text-text-secondary">Loading lesson...</p>
        </Card>
      </div>
    );
  }

  const currentTerm = terms[currentTermIndex];
  const isLastTerm = currentTermIndex === terms.length - 1;

  const handleExerciseComplete = (result: ExerciseResult) => {
    recordTermAttempt(currentTerm.id, result.isCorrect);
    
    // Mark term as learned when completed correctly
    if (result.isCorrect) {
      markTermLearned(currentTerm.id, result.score || 100);
    }
    
    // Calculate XP based on difficulty
    let xpReward = result.xpEarned;
    if (result.isCorrect) {
      const difficultMultiplier = getLessonLevel() === 'beginner' ? 1 : getLessonLevel() === 'intermediate' ? 2 : 3;
      xpReward = result.xpEarned * difficultMultiplier;
      setCorrectAnswers(correctAnswers + 1);
    }
    
    updateXP(xpReward);
    setLessonXP(lessonXP + xpReward);
    setShowResult(true);

    setTimeout(() => {
      if (isLastTerm) {
        // Update streak when lesson completes - increment by 1 from current
        const newStreak = (profile.streak || 0) + 1;
        updateStreak(newStreak);
        // Show lesson summary
        setTimeout(() => {
          navigate('/');
        }, 300);
      } else {
        setCurrentTermIndex(currentTermIndex + 1);
        setShowResult(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-bg-dark pb-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-text-secondary hover:text-primary-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`w-6 h-6 ${
                  i < 3 ? 'text-accent fill-accent' : 'text-text-secondary'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Progress */}
        <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold mb-1">
                {areaId?.toUpperCase()} - Level {getLessonLevel().toUpperCase()}
              </h2>
              <p className="text-sm text-text-secondary">
                Term {currentTermIndex + 1}/{terms.length} • {correctAnswers} correct
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                <Zap className="w-4 h-4 text-secondary" />
                <span className="font-semibold text-secondary">{lessonXP} XP</span>
              </div>
              <span className="text-sm text-text-secondary">
                {Math.round(((currentTermIndex + 1) / terms.length) * 100)}% complete
              </span>
            </div>
          </div>
          <ProgressBar 
            current={currentTermIndex + 1} 
            max={terms.length} 
            color="bg-primary-500"
            showLabel={false}
          />
        </motion.div>

        {/* Pronunciation Card */}
        <motion.div
          key={currentTerm.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <PronunciationCard
            term={currentTerm.english}
            phonetic={currentTerm.phonetic}
            pronunciation_guide={currentTerm.pronunciation_guide}
            definition_en={currentTerm.definition_en}
            definition_es={currentTerm.definition_es}
            codeExample={currentTerm.codeExample}
            contextSentence={currentTerm.contextSentence}
          />
        </motion.div>

        {/* Exercise */}
        {!showResult && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            {getExerciseType(currentTermIndex) === 'pronunciation' && (
              <PronunciationExercise
                term={currentTerm.english}
                phonetic={currentTerm.phonetic}
                pronunciation_guide={currentTerm.pronunciation_guide}
                onSubmit={handleExerciseComplete}
              />
            )}
            {getExerciseType(currentTermIndex) === 'fillInBlank' && (
              <FillInBlankExercise
                question={`Type the English word: "${currentTerm.definition_es.substring(0, 50)}..."`}
                correctAnswer={currentTerm.english}
                explanation={`The answer is "${currentTerm.english}" - ${currentTerm.definition_en}`}
                hints={[
                  `First letter: ${currentTerm.english[0].toUpperCase()}`,
                  `${currentTerm.english.substring(0, Math.ceil(currentTerm.english.length / 2))}...`,
                ]}
                onSubmit={handleExerciseComplete}
              />
            )}
            {getExerciseType(currentTermIndex) === 'multipleChoice' && (
              <MultipleChoiceExercise
                question={`What is the correct definition of "${currentTerm.english}"?`}
                options={[currentTerm.definition_en, 'Random definition', 'Another random', 'Yet another']}
                correctAnswer={currentTerm.definition_en}
                explanation={currentTerm.definition_en}
                onSubmit={handleExerciseComplete}
              />
            )}
          </motion.div>
        )}

        {/* Result Message */}
        {showResult && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="text-4xl mb-4">✨</div>
            <p className="text-xl text-secondary font-semibold">
              {isLastTerm ? 'Lesson Complete!' : 'Moving to next term...'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Lesson;
