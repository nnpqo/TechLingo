import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import {
  PronunciationCard,
  PronunciationExercise,
  MultipleChoiceExercise,
  FillInBlankExercise,
} from '@/components/features';
import {
  cybersecurityTerms,
  frontendTerms,
  backendTerms,
  databaseTerms,
  devopsTerms,
  networkingTerms,
} from '@/data/terms';
import { Term, ExerciseResult } from '@/types/index';
import { useUserStore } from '@/store/userStore';
import { useProgress } from '@/hooks/useProgress';
import { ArrowLeft } from 'lucide-react';

type ExerciseType = 'pronunciation' | 'fillInBlank' | 'multipleChoice';

const getExerciseType = (termIndex: number): ExerciseType => {
  const types: ExerciseType[] = ['pronunciation', 'fillInBlank', 'multipleChoice'];
  return types[termIndex % types.length];
};

const areaNameMap: Record<string, string> = {
  cybersecurity: 'Cybersecurity',
  frontend: 'Web Frontend',
  backend: 'Backend',
  database: 'Databases',
  devops: 'DevOps',
  networking: 'Networking',
};

const getAreaLabel = (areaId?: string): string => {
  if (!areaId) return 'Área no definida';
  return areaNameMap[areaId] || areaId;
};

const Lesson: React.FC = () => {
  const { areaId, lessonId } = useParams<{ areaId: string; lessonId: string }>();
  const navigate = useNavigate();

  const recordTermAttempt = useUserStore((state) => state.recordTermAttempt);
  const markTermLearned = useUserStore((state) => state.markTermLearned);
  const updateStreak = useUserStore((state) => state.updateStreak);
  const addCompletedLesson = useUserStore((state) => state.addCompletedLesson);
  const profile = useUserStore((state) => state.profile);

  const { getLevelInfo } = useProgress();
  const levelInfo = getLevelInfo();

  const [terms, setTerms] = useState<Term[]>([]);
  const [currentTermIndex, setCurrentTermIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [sessionSeed, setSessionSeed] = useState(() => Date.now());
  const transitionTimeoutRef = useRef<number | null>(null);

  const getLessonLevel = (): 'beginner' | 'intermediate' | 'advanced' => {
    if (levelInfo.number >= 5) return 'advanced';
    if (levelInfo.number >= 3) return 'intermediate';
    return 'beginner';
  };

  const clearTransitionTimeout = () => {
    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
  };

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
    const availableTerms = areaTerms.length > 0 ? areaTerms : [];
    const shuffled = [...availableTerms].sort(() => Math.random() - 0.5);
    const selectedTerms = shuffled.slice(0, Math.min(20, shuffled.length));

    setTerms(selectedTerms.length > 0 ? selectedTerms : availableTerms.slice(0, 10));
    setCurrentTermIndex(0);
    setCorrectAnswers(0);
    setShowResult(false);
    setLessonCompleted(false);
  }, [areaId, sessionSeed]);

  useEffect(() => {
    return () => {
      clearTransitionTimeout();
    };
  }, []);

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

  const goToNextStep = () => {
    clearTransitionTimeout();

    if (isLastTerm) {
      addCompletedLesson(`${areaId || 'area'}-${lessonId || '1'}`);
      updateStreak((profile.streak || 0) + 1);
      setLessonCompleted(true);
    } else {
      setCurrentTermIndex((previousIndex) => previousIndex + 1);
      setShowResult(false);
    }
  };

  const handleExerciseComplete = (result: ExerciseResult) => {
    recordTermAttempt(currentTerm.id, result.isCorrect);

    if (result.isCorrect) {
      markTermLearned(currentTerm.id, result.score || 100);
      setCorrectAnswers((prev) => prev + 1);
    }

    setShowResult(true);
    clearTransitionTimeout();

    transitionTimeoutRef.current = window.setTimeout(() => {
      goToNextStep();
    }, 3000);
  };

  const totalQuestions = terms.length;
  const incorrectAnswers = Math.max(0, totalQuestions - correctAnswers);
  const accuracy = totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

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
        </motion.div>

{/* Breadcrumb */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  className="mb-4 text-sm text-text-secondary"
>
  <span className="hover:text-primary-500 transition-colors">Home</span>
  <span className="mx-2">/</span>
  <span>{getAreaLabel(areaId)}</span>
  <span className="mx-2">/</span>
  <span className="text-primary-500 font-semibold">
    Lección {lessonId || '1'}
  </span>
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
        {!showResult && !lessonCompleted && (
          <motion.div
            key={`${currentTerm.id}-${getExerciseType(currentTermIndex)}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
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
                options={[
                  currentTerm.definition_en,
                  'Random definition',
                  'Another random',
                  'Yet another',
                ]}
                correctAnswer={currentTerm.definition_en}
                explanation={currentTerm.definition_en}
                onSubmit={handleExerciseComplete}
              />
            )}
          </motion.div>
        )}

        {/* Result Message */}
        {showResult && !lessonCompleted && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="text-4xl mb-4">✨</div>

            <p className="text-xl text-secondary font-semibold mb-3">
              {isLastTerm ? 'Lesson Complete!' : 'Moving to next term...'}
            </p>

            <p className="text-sm text-text-secondary mb-4">
              Progreso: {currentTermIndex + 1}/{terms.length} términos completados
            </p>

            <ProgressBar
              current={currentTermIndex + 1}
              max={terms.length}
              color="bg-secondary"
              showLabel={false}
            />

            <div className="mt-5">
              <Button onClick={goToNextStep} size="lg">
                {isLastTerm ? 'Siguiente lección →' : 'Siguiente término →'}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Final Quiz Result */}
        {lessonCompleted && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            <Card className="text-center">
              <div className="text-5xl mb-3">📊</div>
              <h3 className="text-2xl font-bold mb-2">Resultado del quiz</h3>
              <p className="text-text-secondary mb-6">Así te fue en esta práctica</p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-3 rounded-xl bg-bg-elevated">
                  <div className="text-2xl font-bold text-secondary">{correctAnswers}</div>
                  <div className="text-xs text-text-secondary">Correctas</div>
                </div>

                <div className="p-3 rounded-xl bg-bg-elevated">
                  <div className="text-2xl font-bold text-accent">{incorrectAnswers}</div>
                  <div className="text-xs text-text-secondary">Incorrectas</div>
                </div>

                <div className="p-3 rounded-xl bg-bg-elevated">
                  <div className="text-2xl font-bold text-primary-500">{accuracy}%</div>
                  <div className="text-xs text-text-secondary">Precisión</div>
                </div>
              </div>

              <div className="mb-6">
                <ProgressBar
                  current={correctAnswers}
                  max={Math.max(1, totalQuestions)}
                  color="bg-secondary"
                  animated={false}
                  showLabel={false}
                />
                <p className="text-xs text-text-secondary mt-2">
                  {correctAnswers} de {totalQuestions} preguntas
                </p>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => navigate('/')}>
                  Volver al inicio
                </Button>

                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => setSessionSeed(Date.now())}
                >
                  Reintentar
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Lesson;