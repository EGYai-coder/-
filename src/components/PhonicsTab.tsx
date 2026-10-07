import React from 'react';
import { LetterData, WordItem } from '../types';
import { sounds } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { Volume2, Sparkles, BookOpen } from 'lucide-react';

interface PhonicsTabProps {
  letter: LetterData;
  childName: string;
}

export const PhonicsTab: React.FC<PhonicsTabProps> = ({ letter, childName }) => {
  const vowelsList = [
    { name: 'الفَتْحَة', mark: 'َ', symbol: letter.vowels.fatha, soundDesc: 'نفتح الفم لأعلى' },
    { name: 'الضَّمَّة', mark: 'ُ', symbol: letter.vowels.damma, soundDesc: 'نضم الشفتين كالدائرة' },
    { name: 'الكَسْرَة', mark: 'ِ', symbol: letter.vowels.kasra, soundDesc: 'نبتسم ونكسر الصوت' },
    { name: 'السُّكُون', mark: 'ْ', symbol: letter.vowels.sukun, soundDesc: 'صوت هادئ ومستقر' },
  ];

  const handlePlayVowel = (item: (typeof vowelsList)[0]) => {
    sounds.playClick();
    speech.speak(`${letter.name} مع ${item.name}: ${item.symbol}`);
  };

  const handlePlayWord = (w: WordItem) => {
    sounds.playClick();
    speech.speak(`${w.word}، ${w.meaning}`);
  };

  return (
    <div className="bg-[#12161f] border border-[#21262d] rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-6">
      {/* Vowels Section */}
      <div>
        <div className="flex items-center justify-between mb-3 border-b border-[#21262d] pb-2">
          <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
            <span className="text-amber-400">حركات حرف {letter.name}</span>
            <span className="text-xs text-slate-400 font-normal">(اضغطي على البطاقة لسماع الصوت)</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {vowelsList.map((v, idx) => (
            <button
              key={idx}
              onClick={() => handlePlayVowel(v)}
              className="group p-4 rounded-2xl bg-[#161b22] hover:bg-[#1f2633] border border-[#30363d] hover:border-amber-400/60 transition-all text-center flex flex-col items-center justify-center cursor-pointer shadow-sm active:scale-95"
            >
              <span className="text-xs text-amber-400 font-semibold mb-1 group-hover:text-amber-300">
                {v.name}
              </span>
              <span className="text-4xl sm:text-5xl font-extrabold text-white my-2 group-hover:scale-110 transition-transform text-amber-300">
                {v.symbol}
              </span>
              <span className="text-[11px] text-slate-400 mb-2">{v.soundDesc}</span>
              <div className="p-1.5 rounded-full bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                <Volume2 className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Vocabulary Bank */}
      <div>
        <div className="flex items-center justify-between mb-3 border-b border-[#21262d] pb-2">
          <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <span>قاموس كلمات حرف {letter.name} المصورة</span>
          </h3>
          <span className="text-xs text-slate-400">{letter.words.length} كلمات مسلية</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {letter.words.map((w, idx) => (
            <button
              key={idx}
              onClick={() => handlePlayWord(w)}
              className="p-3.5 rounded-2xl bg-[#161b22] hover:bg-[#1a2332] border border-[#30363d] hover:border-emerald-500/50 transition-all text-right flex items-center gap-4 cursor-pointer group shadow-sm"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#0f141d] border border-[#2b3547] flex items-center justify-center text-3xl group-hover:scale-110 transition-transform flex-shrink-0 shadow-inner">
                {w.emoji}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                    {w.word}
                  </h4>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    {w.haraka}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed truncate">{w.meaning}</p>
              </div>

              <div className="p-2 rounded-xl text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors flex-shrink-0">
                <Volume2 className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
