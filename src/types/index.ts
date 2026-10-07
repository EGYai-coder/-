export type MissionType =
  | 'حرف'
  | 'قصة'
  | 'نشيد'
  | 'لغة'
  | 'لعبة'
  | 'اختبار'
  | 'مهارة'
  | 'مغامرة'
  | 'تحدي'
  | 'قراءة'
  | 'مهمة'
  | 'نهائي';

export type UnitName = 'أسرتي' | 'حيواناتي' | 'أجزاء جسمي' | 'مدرستي';

export interface ResearchStations {
  ask: string; // ❓ نسأل
  discover: string; // 🔎 نكتشف
  organize: string; // 🗂️ ننظم
  tryIt: string; // 🛠️ نجرّب
  treasure: string; // 🏆 الكنز
}

export interface MissionActivity {
  type: 'letter' | 'choice' | 'interactive' | 'song' | 'story' | 'game';
  question?: string;
  options?: string[];
  correctAnswer?: string;
  words?: string[];
  songLines?: string[];
  storyParagraphs?: string[];
  hint?: string;
  explanation?: string;
}

export interface MissionData {
  id: number; // 1 - 54
  title: string;
  type: MissionType;
  unit: UnitName;
  unitNumber: number; // 1, 2, 3, 4
  description: string;
  letterKey?: string; // e.g. 'أ', 'ب'
  activity: MissionActivity;
  research: ResearchStations;
}

export interface WordItem {
  word: string;
  emoji: string;
  meaning: string;
  haraka: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  explanation: string;
}

export interface LetterStory {
  title: string;
  paragraphs: string[];
}

export interface LetterData {
  id: number;
  letter: string;
  name: string;
  vowels: { fatha: string; damma: string; kasra: string; sukun: string };
  worldName: string;
  worldTheme: string;
  words: WordItem[];
  riddle: { question: string; answer: string; clue: string };
  quiz: QuizQuestion;
  story: LetterStory;
  strokeHint: string;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    glow: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'teacher' | 'user';
  text: string;
  timestamp: number;
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  reqText: string;
}

export type LearningMode = 'mission' | 'chat' | 'drawing' | 'phonics' | 'research' | 'story';
