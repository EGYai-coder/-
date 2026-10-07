import React, { useState, useEffect } from 'react';
import { MissionData } from '../types';
import { sounds } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { CheckCircle2, XCircle, Sparkles, Volume2, ArrowLeft, Trophy, Music, BookOpen, Gamepad2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MissionActivityCardProps {
  mission: MissionData;
  childName: string;
  isCompleted: boolean;
  onFinishMission: () => void;
  onNextMission: () => void;
  hasNextMission: boolean;
  onAwardXP: (amount: number) => void;
  onOpenDrawingMode?: () => void;
}

export const MissionActivityCard: React.FC<MissionActivityCardProps> = ({
  mission,
  childName,
  isCompleted,
  onFinishMission,
  onNextMission,
  hasNextMission,
  onAwardXP,
  onOpenDrawingMode,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Reset state when mission changes
  useEffect(() => {
    setSelectedOption(null);
    setFeedback(null);
    setIsCorrect(null);
  }, [mission.id]);

  const act = mission.activity;

  const handleSelectOption = (opt: string) => {
    sounds.playClick();
    setSelectedOption(opt);

    const correct = act.correctAnswer ? opt === act.correctAnswer : true;
    setIsCorrect(correct);

    if (correct) {
      sounds.playSuccess();
      setFeedback(act.explanation || `أحسنتِ يا ${childName}! إجابة رائعة وصحيحة! 🌟`);
      onAwardXP(15);
      onFinishMission();

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#38bdf8', '#ec4899'],
      });

      speech.speak(act.explanation || `ممتازة يا ${childName}! إجابة صحيحة وموفقة!`);
    } else {
      sounds.playEncouragement();
      setFeedback('قريب جداً! فكري في التلميح وحاولي مرة ثانية يا بطلة!');
      speech.speak('حاولي مرة أخرى يا ساجدة، اقرئي جيداً وجربي ثانية!');
    }
  };

  const handleReadText = (text: string) => {
    sounds.playClick();
    speech.speak(text);
  };

  return (
    <div className="bg-[#12161f] border border-[#21262d] rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col gap-5">
      {/* Activity Header */}
      <div className="flex items-center justify-between border-b border-[#21262d] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
            {mission.type === 'نشيد' ? (
              <Music className="w-5 h-5" />
            ) : mission.type === 'قصة' ? (
              <BookOpen className="w-5 h-5" />
            ) : mission.type === 'لعبة' ? (
              <Gamepad2 className="w-5 h-5" />
            ) : mission.type === 'اختبار' || mission.type === 'نهائي' ? (
              <Trophy className="w-5 h-5" />
            ) : (
              <span>🎯</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base sm:text-lg">{mission.title}</h3>
              <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                {mission.type}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{mission.description}</p>
          </div>
        </div>

        {isCompleted && (
          <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>مُنجزة ✓</span>
          </span>
        )}
      </div>

      {/* Specific Activity Body */}
      {/* 1. Song lyrics view */}
      {act.songLines && (
        <div className="p-4 rounded-2xl bg-[#161f2e] border border-[#2a384e] space-y-2.5 text-center">
          <div className="text-xs font-bold text-amber-400 mb-2">كلمات النشيد اللحنية 🎵</div>
          {act.songLines.map((line, idx) => (
            <div
              key={idx}
              className="text-base sm:text-lg font-medium text-slate-200 py-1 hover:text-amber-300 transition-colors flex items-center justify-center gap-2"
            >
              <span>{line}</span>
              <button
                onClick={() => handleReadText(line)}
                className="p-1 rounded-md text-slate-400 hover:text-amber-400"
                title="استمعي لهذا البيت"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 2. Story paragraphs view */}
      {act.storyParagraphs && (
        <div className="p-4 rounded-2xl bg-[#161f2e] border border-[#2a384e] space-y-2.5">
          <div className="text-xs font-bold text-amber-400 mb-2">مشاهد القصة المصورة 📖</div>
          {act.storyParagraphs.map((par, idx) => (
            <div key={idx} className="flex items-start justify-between gap-3 text-sm sm:text-base text-slate-200 leading-relaxed">
              <p>{par}</p>
              <button
                onClick={() => handleReadText(par)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 flex-shrink-0"
                title="استمعي للفقرة"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 3. Question & Options */}
      {act.question && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-base sm:text-lg text-white">{act.question}</h4>
            <button
              onClick={() => handleReadText(act.question!)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400"
              title="استمعي للسؤال"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {act.options?.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrectOpt = act.correctAnswer ? opt === act.correctAnswer : true;

              let btnStyle = 'bg-[#161b22] border-[#30363d] text-white hover:border-amber-400/60 hover:bg-[#1c2432]';

              if (selectedOption) {
                if (isCorrectOpt) {
                  btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                } else {
                  btnStyle = 'bg-[#161b22]/40 border-[#262c35] text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  disabled={Boolean(selectedOption && isCorrect)}
                  className={`p-3.5 sm:p-4 rounded-xl border text-right font-medium transition-all cursor-pointer flex items-center justify-between shadow-sm active:scale-98 ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-xs text-slate-400">
                      {idx + 1}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {selectedOption && isCorrectOpt && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
                  )}
                  {selectedOption && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Letter Direct Action Shortcut if applicable */}
      {mission.letterKey && onOpenDrawingMode && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>يمكنك أيضاً ممارسة رسم وتتبع حرف «{mission.letterKey}» على السبورة!</span>
          </div>
          <button
            onClick={onOpenDrawingMode}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
          >
            سبورة الخط 🎨
          </button>
        </div>
      )}

      {/* Feedback Message */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs sm:text-sm font-medium ${
            isCorrect
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {feedback}
        </div>
      )}

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#21262d]">
        {!isCompleted ? (
          <button
            onClick={() => {
              sounds.playReward();
              onAwardXP(20);
              onFinishMission();
              confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.6 },
              });
              speech.speak(`مبروك يا ${childName}! أنجزتِ المهمة رقم ${mission.id} بنجاح!`);
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>أنجزت المهمة ✓ (+20 XP)</span>
          </button>
        ) : (
          <div className="text-xs text-emerald-400 font-bold">
            ✓ تم الحصول على وسام وجوهرة هذه المهمة!
          </div>
        )}

        {hasNextMission && (
          <button
            onClick={() => {
              sounds.playClick();
              onNextMission();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-slate-200 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>المهمة التالية</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
