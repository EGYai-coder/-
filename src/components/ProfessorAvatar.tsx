import React from 'react';
import { Sparkles, MessageCircleHeart } from 'lucide-react';
import { speech } from '../services/speechService';
import { sounds } from '../services/soundEffects';

interface ProfessorAvatarProps {
  isSpeaking: boolean;
  childName: string;
  mood?: 'happy' | 'thinking' | 'celebrating';
  onQuickEncouragement?: () => void;
}

export const ProfessorAvatar: React.FC<ProfessorAvatarProps> = ({
  isSpeaking,
  childName,
  mood = 'happy',
  onQuickEncouragement,
}) => {
  const handleAvatarClick = () => {
    sounds.playEncouragement();
    const greetings = [
      `يا ساجدة يا بطلة، أنا فخور بيكي جداً! 🌟`,
      `أنتِ أذكى بنوتة في مدرسة الحروف! 🎓`,
      `يلا نكمل مغامرتنا الحلوة سوا! 🚀`,
      `ما شاء الله عليكي يا ساجدة، شطورة كالعادة! 💖`,
    ];
    const phrase = greetings[Math.floor(Math.random() * greetings.length)];
    speech.speak(phrase);
    if (onQuickEncouragement) onQuickEncouragement();
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleAvatarClick}
        className="group relative cursor-pointer focus:outline-none transition-transform hover:scale-105 active:scale-95"
        title="اضغطي عليّ لأشجعك يا ساجدة!"
      >
        {/* Glow Ring */}
        <div
          className={`absolute -inset-2 rounded-full blur-xl transition-opacity ${
            isSpeaking
              ? 'bg-amber-400/40 opacity-100 animate-pulse'
              : 'bg-amber-500/20 opacity-60 group-hover:opacity-90'
          }`}
        />

        {/* Character Base Orb */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-[#1f293d] to-[#0f172a] border-2 border-amber-400/60 p-1 shadow-2xl flex items-center justify-center">
          {/* Inner robot/teacher face */}
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#131b2e] via-[#1a233b] to-[#253252] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Teacher graduation cap icon element */}
            <div className="absolute top-1 text-amber-400 text-sm">🎓</div>

            {/* Teacher Glasses and Eyes */}
            <div className="flex items-center gap-2 mt-3 z-10">
              {/* Left Eye with Glasses */}
              <div className="w-6 h-6 rounded-full border-2 border-amber-400 bg-amber-400/10 flex items-center justify-center relative shadow-[0_0_8px_#f59e0b]">
                <div
                  className={`w-2 h-2 rounded-full bg-amber-300 ${
                    isSpeaking ? 'animate-bounce' : 'animate-pulse'
                  }`}
                />
              </div>

              {/* Glasses Bridge */}
              <div className="w-2 h-0.5 bg-amber-400" />

              {/* Right Eye with Glasses */}
              <div className="w-6 h-6 rounded-full border-2 border-amber-400 bg-amber-400/10 flex items-center justify-center relative shadow-[0_0_8px_#f59e0b]">
                <div
                  className={`w-2 h-2 rounded-full bg-amber-300 ${
                    isSpeaking ? 'animate-bounce' : 'animate-pulse'
                  }`}
                />
              </div>
            </div>

            {/* Cheerful Mouth */}
            <div className="mt-2.5 z-10">
              {isSpeaking ? (
                <div className="w-6 h-3 rounded-b-full bg-rose-500 border border-amber-300 animate-pulse flex items-center justify-center">
                  <div className="w-2.5 h-1 rounded-t-full bg-white/70" />
                </div>
              ) : (
                <div className="w-5 h-2 rounded-b-full border-b-2 border-amber-300" />
              )}
            </div>

            {/* Blush Cheeks */}
            <div className="absolute bottom-5 flex justify-between w-16 px-1 opacity-70">
              <div className="w-2 h-1 rounded-full bg-rose-400/60 blur-[1px]" />
              <div className="w-2 h-1 rounded-full bg-rose-400/60 blur-[1px]" />
            </div>

            {/* Sparkle badge */}
            <div className="absolute bottom-1 right-2 text-amber-400 text-[10px]">✨</div>
          </div>
        </div>

        {/* Floating status tag */}
        <div className="absolute -bottom-2 inset-x-0 mx-auto w-max px-2.5 py-0.5 rounded-full bg-amber-500/90 text-slate-950 font-bold text-[11px] shadow-md flex items-center gap-1">
          {isSpeaking ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
              <span>يتحدث الآن...</span>
            </>
          ) : (
            <>
              <span>الأستاذ AI</span>
            </>
          )}
        </div>
      </button>

      <span className="text-[11px] text-slate-400 mt-3 text-center">
        اضغطي لتسمعي تشجيعاً سحرياً! 👆
      </span>
    </div>
  );
};
