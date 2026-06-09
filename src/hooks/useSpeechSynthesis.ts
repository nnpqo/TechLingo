import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

const prepareSpeechText = (text: string): string => {
  return text
    .replace(/&/g, ' and ')
    .replace(/\+/g, ' plus ')
    .replace(/#/g, ' sharp ')
    .replace(/\//g, ' slash ')
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const useSpeechSynthesis = () => {
  const speechRate = useSettingsStore((state) => state.speechRate);
  const preferredAccent = useSettingsStore((state) => state.preferredAccent);

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const [isSupported] = useState(() => {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  });

  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    loadVoices();

    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [isSupported]);

  const speak = (text: string, lang?: string) => {
    if (!isSupported) {
      console.warn('Speech Synthesis not supported');
      return;
    }

    const preparedText = prepareSpeechText(text);

    if (!preparedText) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(preparedText);

    utterance.lang = lang || (preferredAccent === 'uk' ? 'en-GB' : 'en-US');
    utterance.rate = speechRate;
    utterance.pitch = 1;
    utterance.volume = 1;

    const exactVoice = voices.find((voice) => voice.lang === utterance.lang);
    const englishVoice = voices.find((voice) => voice.lang.startsWith('en'));

    utterance.voice = exactVoice || englishVoice || null;

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (isSupported) {
      window.speechSynthesis.cancel();
    }
  };

  return {
    speak,
    stop,
    isSupported,
  };
};