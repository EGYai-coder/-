import React, { useRef } from 'react';
import { LetterData } from '../types';
import { WORLDS } from '../data/lettersData';
import { sounds } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { Check, Star, Sparkles, Compass } from 'lucide-react';

interface AdventureMapProps {
  letters: LetterData[];
  currentLetterIndex: number;
  completedLetters: string[];
  starsRecord: Record<string, number>;
  onSelectLetter: (index: number) => void;
}

export const AdventureMap: React.FC<AdventureMapProps> = ({
  letters,
  currentLetterIndex,
  completedLetters,
  starsRecord,
  onSelectLetter,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleLetterClick = (index: number) => {
    sounds.playClick();
    onSelectLetter(index);
    const letter = letters[index];
    if (letter) {
      speech.speak(`حرف ${letter.name}`);
    }
  };

  return (
    <div className="bg-[#12161f] border border-[#21262d] rounded-2xl p-4 sm:p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#21262d]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-white">خريطة مغامرة الحروف</h3>
            <p className="text-xs text-slate-400">٢٨ حرفاً في ٦ عوالم سحرية لساجدة البطلة</p>
          </div>
        </div>
        <div className="text-xs text-amber-400/90 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          المرحلة الحالية: {letters[currentLetterIndex]?.worldName}
        </div>
      </div>

      {/* World Horizontal Map Scroll */}
      <div
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent snap-x"
      >
        {letters.map((l, index) => {
          const isActive = index === currentLetterIndex;
          const isCompleted = completedLetters.includes(l.letter);
          const stars = starsRecord[l.letter] || (isCompleted ? 3 : 0);

          return (
            <button
              key={l.id}
              onClick={() => handleLetterClick(index)}
              className={`relative flex-shrink-0 w-20 sm:w-22 p-2.5 rounded-2xl border text-center transition-all duration-200 snap-center group cursor-pointer focus:outline-none ${
                isActive
                  ? 'bg-gradient-to-b from-amber-500/20 to-amber-500/5 border-amber-400 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/20 scale-105 z-10'
                  : isCompleted
                  ? 'bg-[#16221c] border-emerald-500/40 hover:border-emerald-400/80 text-emerald-300'
                  : 'bg-[#161b22] border-[#30363d] hover:border-slate-500 text-slate-300'
              }`}
            >
              {/* Badge Index */}
              <div className="flex items-center justify-between text-[11px] mb-1 text-slate-400 group-hover:text-amber-300">
                <span>#{l.id}</span>
                {isCompleted && (
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[9px] font-black">
                    ✓
                  </span>
                )}
              </div>

              {/* Big Arabic Letter */}
              <div
                className={`text-2xl sm:text-3xl font-extrabold my-1 transition-transform group-hover:scale-110 ${
                  isActive
                    ? 'text-amber-400 drop-shadow-[0_0_8px_#f59e0b]'
                    : isCompleted
                    ? 'text-emerald-400'
                    : 'text-white'
                }`}
              >
                {l.letter}
              </div>

              {/* Letter Name */}
              <div className="text-[11px] font-medium truncate text-slate-300">
                {l.name}
              </div>

              {/* Stars */}
              <div className="flex items-center justify-center gap-0.5 mt-1.5">
                {[1, 2, 3].map((starIdx) => (
                  <Star
                    key={starIdx}
                    className={`w-2.5 h-2.5 ${
                      starIdx <= stars
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>

              {isActive && (
                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-amber-400 animate-ping" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
