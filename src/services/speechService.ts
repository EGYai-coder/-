/**
 * Speech Synthesis and Speech Recognition Service for Arabic Language
 */

type SpeakingCallback = (speaking: boolean) => void;

class SpeechService {
  public enabled: boolean = true;
  public rate: number = 0.95;
  public pitch: number = 1.05;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private speakingListeners: Set<SpeakingCallback> = new Set();
  private arabicVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  private loadVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    // Prefer Egyptian or Saudi or any Arabic voice
    const found =
      voices.find((v) => v.lang.toLowerCase() === 'ar-eg') ||
      voices.find((v) => v.lang.toLowerCase() === 'ar-sa') ||
      voices.find((v) => v.lang.toLowerCase().startsWith('ar')) ||
      null;
    this.arabicVoice = found;
  }

  public subscribeSpeaking(cb: SpeakingCallback): () => void {
    this.speakingListeners.add(cb);
    return () => this.speakingListeners.delete(cb);
  }

  private notifySpeaking(speaking: boolean) {
    this.speakingListeners.forEach((cb) => cb(speaking));
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    this.stop();

    // Clean emojis and symbols for smoother speech
    const cleanText = text
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/[★☆✨⭐💡🎯👑🐰🦁🍎🦆🐊🦊🐫🐎🐑🐻🐺🦒🐟☀️🦅🐸✈️✉️👁️☁️🦋🌙✏️📖🍋🍌🎁🌹✋]/g, '')
      .trim();

    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.lang = 'ar-EG';
    if (this.arabicVoice) {
      utter.voice = this.arabicVoice;
    }
    utter.rate = this.rate;
    utter.pitch = this.pitch;

    utter.onstart = () => {
      this.notifySpeaking(true);
    };

    utter.onend = () => {
      this.notifySpeaking(false);
      if (onEnd) onEnd();
    };

    utter.onerror = () => {
      this.notifySpeaking(false);
      if (onEnd) onEnd();
    };

    this.currentUtterance = utter;
    window.speechSynthesis.speak(utter);
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.notifySpeaking(false);
    }
  }

  public isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(
      (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
    );
  }

  public createRecognizer(
    onResult: (transcript: string) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ) {
    if (!this.isSpeechRecognitionSupported()) return null;

    type SpeechRecogType = {
      new (): {
        lang: string;
        continuous: boolean;
        interimResults: boolean;
        start: () => void;
        stop: () => void;
        abort: () => void;
        onresult: (event: { results: Array<Array<{ transcript: string }>> }) => void;
        onerror: (event: { error: string }) => void;
        onend: () => void;
      };
    };

    const SpeechRecog = (window as unknown as {
      SpeechRecognition?: SpeechRecogType;
      webkitSpeechRecognition?: SpeechRecogType;
    }).SpeechRecognition ||
      (window as unknown as {
        webkitSpeechRecognition?: SpeechRecogType;
      }).webkitSpeechRecognition;

    if (!SpeechRecog) return null;

    const recog = new SpeechRecog();
    recog.lang = 'ar-EG';
    recog.continuous = false;
    recog.interimResults = false;

    recog.onresult = (e) => {
      const transcript = e.results[0]?.[0]?.transcript || '';
      onResult(transcript);
    };

    recog.onerror = (e) => {
      onError(e.error || 'speech_error');
    };

    recog.onend = () => {
      onEnd();
    };

    return recog;
  }
}

export const speech = new SpeechService();
