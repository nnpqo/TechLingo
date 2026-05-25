import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

export const useSpeechSynthesis = () => {
  const speechRate = useSettingsStore((state) => state.speechRate);
  const [isSupported] = useState(() => {
    return typeof window !== 'undefined' && ('speechSynthesis' in window);
  });

  const speak = (text: string, lang: string = 'en-US') => {
    if (!isSupported) {
      console.warn('Speech Synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = speechRate;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to use American English voice
    const voices = speechSynthesis.getVoices();
    const americanVoice = voices.find(
      (v) => v.lang.startsWith('en-US') || v.lang.startsWith('en_US')
    );
    if (americanVoice) {
      utterance.voice = americanVoice;
    }

    speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (isSupported) {
      speechSynthesis.cancel();
    }
  };

  return { speak, stop, isSupported };
};
