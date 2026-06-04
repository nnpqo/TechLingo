import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

export const useSpeechSynthesis = () => {
  const speechRate = useSettingsStore((state) => state.speechRate);
  const preferredAccent = useSettingsStore((state) => state.preferredAccent);
  const [isSupported] = useState(() => {
    return typeof window !== 'undefined' && ('speechSynthesis' in window);
  });

  const resolveLang = (explicitLang?: string) => {
    if (explicitLang) return explicitLang;
    return preferredAccent === 'uk' ? 'en-GB' : 'en-US';
  };

  const speak = (text: string, lang?: string) => {
    if (!isSupported) {
      console.warn('Speech Synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = resolveLang(lang);
    utterance.rate = speechRate;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to use a matching English voice for the requested accent
    const voices = speechSynthesis.getVoices();
    const requested = utterance.lang;
    const exactVoice = voices.find((v) => v.lang === requested);
    const startsWithVoice = voices.find((v) => v.lang?.startsWith(requested));
    const anyEnglish = voices.find((v) => v.lang?.startsWith('en'));
    utterance.voice = exactVoice || startsWithVoice || anyEnglish || null;

    speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (isSupported) {
      speechSynthesis.cancel();
    }
  };

  return { speak, stop, isSupported };
};
