import React, { useState } from 'react';
import { LetterData } from '../types';
import { sounds } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { BookOpen, Volume2, Sparkles, Heart } from 'lucide-react';

interface StoryTabProps {
  letter: LetterData;
  childName: string;
}

export const StoryTab: React.FC<StoryTabProps> = ({ letter, childName }) => {
  const [readingParagraph, setReadingParagraph] = useState<number | null>(null);

  const story = letter.story;

  const handleReadParagraph = (text: string, idx: number) => {
    sounds.playClick();
    setReadingParagraph(idx);
    speech.speak(text, () => {
      setReadingParagraph(null);
    });
  };

  const handleReadAll = () => {
    sounds.playClick();
    const fullStory = `${story.title}. ${story.paragraphs.join('. ')}`;
    setReadingParagraph(0);
    speech.speak(fullStory, () => {
      setReadingParagraph(null);
    });
  };

  return (
    <div className="bg-[#12161f] border border-[#21262d] rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col gap-6">
      {/* Story Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#21262d] pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-md">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base sm:text-lg">{story.title}</h3>
            <p className="text-xs text-slate-400">حكاية مشوقة من واحة الحروف لساجدة</p>
          </div>
        </div>

        <button
          onClick={handleReadAll}
          className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-colors flex items-center gap-1.5"
        >
          <Volume2 className="w-4 h-4 text-amber-400" />
          <span>استمعي للقصة كاملة</span>
        </button>
      </div>

      {/* Story Paragraphs */}
      <div className="space-y-4">
        {story.paragraphs.map((p, idx) => {
          const isCurrentlyReading = readingParagraph === idx;

          return (
            <div
              key={idx}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isCurrentlyReading
                  ? 'bg-amber-500/10 border-amber-500/50 shadow-md ring-1 ring-amber-400/30'
                  : 'bg-[#161b22] border-[#30363d]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
                  {p}
                </p>

                <button
                  onClick={() => handleReadParagraph(p, idx)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 transition-colors flex-shrink-0"
                  title="استمعي لهذه الفقرة"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Story Moral / Footer */}
      <div className="p-4 rounded-2xl bg-[#16202c] border border-[#2a384e] flex items-center gap-3 text-xs text-slate-300">
        <Heart className="w-5 h-5 text-rose-400 flex-shrink-0" />
        <p>
          الحكايات الجميلة تجعلنا نحب اللغة العربية ونكتشف معانيها العميقة بكل فخر واعتزاز! ❤️
        </p>
      </div>
    </div>
  );
};
