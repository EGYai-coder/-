import React, { useState } from 'react';
import { LetterData } from '../types';
import { sounds } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { CheckCircle2, XCircle, Sparkles, HelpCircle, ArrowLeft, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizTabProps {
  letter: LetterData;
  childName: string;
  onAwardXP: (amount: number) => void;
  onCompleteLetter: (letterChar: string, stars: number) => void;
  onNextLetter: () => void;
  hasNextLetter: boolean;
}

export const QuizTab: React.FC<QuizTabProps> = ({
  letter,
  childName,
  onAwardXP,
  onCompleteLetter,
  onNextLetter,
  hasNextLetter,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const quiz = letter.quiz;

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;

    sounds.playClick();
    setSelectedOption(opt);
    setIsAnswered(true);

    const correct = opt === quiz.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      sounds.playSuccess();
      onAwardXP(20);
      onCompleteLetter(letter.letter, 3);

      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
      });

      speech.speak(`إجابة صحيحة يا ${childName}! ${quiz.explanation}`);
    } else {
      sounds.playEncouragement();
      speech.speak(`حاولي مرة أخرى يا ${childName}، اقرأي التلميح وجربي ثانية!`);
    }
  };

  const handleRetry = () => {
    sounds.playClick();
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  return (
    <div className="bg-[#12161f] border border-[#21262d] rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col gap-6">
      {/* Quiz Header */}
      <div className="flex items-center justify-between border-b border-[#21262d] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base sm:text-lg">تحدي الذكاء مع حرف {letter.name}</h3>
            <p className="text-xs text-slate-400">اختبري معلوماتك واكسبي ٢٠ نقطة XP ذهبية</p>
          </div>
        </div>
        <div className="text-xs text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          +20 XP
        </div>
      </div>

      {/* Riddle or Question Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#161f2e] to-[#0f1520] border border-[#28354a] shadow-inner text-center">
        <div className="text-xs text-amber-400 font-medium mb-2">السؤال:</div>
        <h4 className="text-lg sm:text-xl font-bold text-white leading-relaxed mb-3">
          {quiz.question}
        </h4>

        {/* Hint toggle */}
        <button
          onClick={() => {
            sounds.playClick();
            setShowHint(!showHint);
          }}
          className="text-xs text-slate-400 hover:text-amber-300 inline-flex items-center gap-1 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>{showHint ? 'إخفاء التلميح' : 'أحتاج تلميحاً يا أستاذ 💡'}</span>
        </button>

        {showHint && (
          <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs animate-fadeIn">
            {quiz.hint}
          </div>
        )}
      </div>

      {/* Options List */}
      <div className="grid grid-cols-1 gap-3">
        {quiz.options.map((opt, idx) => {
          const isSelected = selectedOption === opt;
          const isThisCorrect = opt === quiz.correctAnswer;

          let btnStyle = 'bg-[#161b22] border-[#30363d] text-white hover:border-amber-400/60 hover:bg-[#1c232f]';

          if (isAnswered) {
            if (isThisCorrect) {
              btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-400/40';
            } else if (isSelected && !isCorrect) {
              btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
            } else {
              btnStyle = 'bg-[#161b22]/50 border-[#262c35] text-slate-500 opacity-60';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(opt)}
              disabled={isAnswered}
              className={`p-4 rounded-2xl border text-base sm:text-lg font-bold text-right flex items-center justify-between transition-all cursor-pointer shadow-sm active:scale-98 ${btnStyle}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-white/5 flex items-center justify-center text-xs text-slate-400">
                  {idx + 1}
                </span>
                <span>{opt}</span>
              </div>

              {isAnswered && isThisCorrect && (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-bounce" />
              )}
              {isAnswered && isSelected && !isCorrect && (
                <XCircle className="w-6 h-6 text-rose-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Result & Actions */}
      {isAnswered && (
        <div className="p-4 rounded-2xl bg-[#161b22] border border-[#30363d] flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-sm text-white">
                {isCorrect ? '🎉 إجابة عبقرية يا ساجدة!' : '💡 محاولة لطيفة!'}
              </span>
            </div>
            <p className="text-xs text-slate-400">{quiz.explanation}</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {!isCorrect ? (
              <button
                onClick={handleRetry}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-white text-xs font-bold transition-colors"
              >
                جربي ثانية
              </button>
            ) : (
              hasNextLetter && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    onNextLetter();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-1.5"
                >
                  <span>الحرف التالي</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};
