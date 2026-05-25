import { useState, useCallback, useRef } from 'react';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  isFinal: boolean;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

// Levenshtein distance algorithm for pronunciation comparison
const levenshteinDistance = (a: string, b: string): number => {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

// Calculate similarity score (0-100)
const calculateSimilarity = (spoken: string, expected: string): number => {
  const spokenLower = spoken.toLowerCase().trim();
  const expectedLower = expected.toLowerCase().trim();

  const distance = levenshteinDistance(spokenLower, expectedLower);
  const maxLength = Math.max(spokenLower.length, expectedLower.length);

  if (maxLength === 0) return 100;

  const similarity = ((maxLength - distance) / maxLength) * 100;
  return Math.max(0, Math.min(100, Math.round(similarity)));
};

export interface PronunciationResult {
  spoken: string;
  score: number; // 0-100
  isCorrect: boolean; // score >= 80
  feedback: string;
}

export const useSpeechRecognition = () => {
  const recognitionRef = useRef<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSupported] = useState(() => {
    if (typeof window === 'undefined') return false;
    const SpeechRecognition =
      window.webkitSpeechRecognition || (window as any).SpeechRecognition;
    return !!SpeechRecognition;
  });
  const [error, setError] = useState<string | null>(null);

  const startListening = useCallback(
    (onResult: (result: PronunciationResult) => void, expectedTerm: string) => {
      if (!isSupported) {
        setError(
          'Speech Recognition not supported. Please try a different browser.'
        );
        return;
      }

      try {
        const SpeechRecognition =
          window.webkitSpeechRecognition || (window as any).SpeechRecognition;

        if (!recognitionRef.current) {
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = false;
          recognitionRef.current.interimResults = false;
          recognitionRef.current.lang = 'en-US';
        }

        const recognition = recognitionRef.current;

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let spokenText = '';

          for (let i = 0; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              spokenText += event.results[i][0].transcript;
            }
          }

          const score = calculateSimilarity(spokenText, expectedTerm);
          const isCorrect = score >= 80;

          let feedback = '';
          if (isCorrect) {
            feedback = '✓ Excellent pronunciation!';
          } else if (score >= 60) {
            feedback = '~ Good try! Focus on the stressed syllables.';
          } else {
            feedback = '✗ Try again. Listen carefully to each syllable.';
          }

          onResult({
            spoken: spokenText,
            score,
            isCorrect,
            feedback,
          });

          setIsListening(false);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          setIsListening(false);

          let errorMessage = 'Error recognizing speech';
          if (event.error === 'no-speech') {
            errorMessage = 'No speech detected. Try again.';
          } else if (event.error === 'network') {
            errorMessage = 'Network error. Check your connection.';
          } else if (event.error === 'not-allowed') {
            errorMessage = 'Microphone permission denied.';
          }

          setError(errorMessage);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch (err) {
        setError('Failed to initialize speech recognition');
        setIsListening(false);
      }
    },
    [isSupported]
  );

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return {
    startListening,
    stopListening,
    isListening,
    isSupported,
    error,
    clearError: () => setError(null),
  };
};
