import { useState, useCallback, useRef } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

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

const normalizeSpeechText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\+/g, ' plus ')
    .replace(/#/g, ' sharp ')
    .replace(/\//g, ' slash ')
    .replace(/[_-]/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

// Calculate similarity score (0-100)
const calculateSimilarity = (spoken: string, expected: string): number => {
  const spokenLower = normalizeSpeechText(spoken);
  const expectedLower = normalizeSpeechText(expected);

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
  const preferredAccent = useSettingsStore((state) => state.preferredAccent);

  const [isSupported] = useState(() => {
    if (typeof window === 'undefined') return false;

    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;

    return !!SpeechRecognition;
  });

  const [error, setError] = useState<string | null>(null);

  const startListening = useCallback(
    (onResult: (result: PronunciationResult) => void, expectedTerm: string) => {
      if (!isSupported) {
        setError(
          'El reconocimiento de voz no está disponible en este navegador. Prueba con Chrome o Edge.'
        );
        return;
      }

      try {
        const SpeechRecognition =
          window.webkitSpeechRecognition || window.SpeechRecognition;

        if (recognitionRef.current) {
          recognitionRef.current.abort();
          recognitionRef.current = null;
        }

        recognitionRef.current = new SpeechRecognition();

        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.maxAlternatives = 1;
        recognitionRef.current.lang = preferredAccent === 'uk' ? 'en-GB' : 'en-US';

        const recognition = recognitionRef.current;

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let spokenText = '';

          for (let i = 0; i < event.results.length; i++) {
            spokenText += event.results[i][0]?.transcript || '';
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
            spoken: spokenText.trim(),
            score,
            isCorrect,
            feedback,
          });

          setIsListening(false);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          setIsListening(false);

          let errorMessage = 'No se pudo reconocer la pronunciación.';

          if (event.error === 'no-speech') {
            errorMessage = 'No se detectó voz. Intenta hablar más cerca del micrófono.';
          } else if (event.error === 'audio-capture') {
            errorMessage = 'No se encontró un micrófono disponible.';
          } else if (event.error === 'network') {
            errorMessage = 'Error de red. Revisa tu conexión e intenta nuevamente.';
          } else if (event.error === 'not-allowed') {
            errorMessage = 'Permiso de micrófono denegado. Activa el permiso en el navegador.';
          } else if (event.error === 'aborted') {
            errorMessage = 'La grabación fue cancelada. Intenta nuevamente.';
          }

          setError(errorMessage);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch (err) {
        setError('No se pudo inicializar el micrófono. Intenta recargar la página.');
        setIsListening(false);
      }
    },
    [isSupported, preferredAccent]
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