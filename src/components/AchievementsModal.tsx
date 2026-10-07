import React, { useState } from 'react';
import { BadgeItem } from '../types';
import { sounds } from '../services/soundEffects';
import { Award, X, Sparkles, Trophy, Star, CheckCircle, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: BadgeItem[];
  xp: number;
  completedLettersCount: number;
  childName: string;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  badges,
  xp,
  completedLettersCount,
  childName,
}) => {
  const [showCertificate, setShowCertificate] = useState(false);

  if (!isOpen) return null;

  const handlePrintCertificate = () => {
    sounds.playReward();
    confetti({
      particleCount: 70,
      spread: 90,
      origin: { y: 0.5 },
    });
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#12161f] border border-[#262f40] rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative my-8 animate-scaleIn">
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute top-5 left-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20 mb-3 font-bold text-2xl">
            🏆
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">لوحة إنجازات {childName}</h2>
          <p className="text-xs text-slate-400 mt-1">الأوسمة والجوائز التي حصلتِ عليها في رحلتكِ</p>
        </div>

        {/* Summary Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-[#161b22] border border-[#30363d] text-center">
            <div className="text-xs text-slate-400 mb-1">النقاط الكلية</div>
            <div className="text-xl font-black text-amber-400">{xp} XP</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#161b22] border border-[#30363d] text-center">
            <div className="text-xs text-slate-400 mb-1">الحروف المكتملة</div>
            <div className="text-xl font-black text-emerald-400">{completedLettersCount} / 28</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#161b22] border border-[#30363d] text-center">
            <div className="text-xs text-slate-400 mb-1">الأوسمة المفتوحة</div>
            <div className="text-xl font-black text-sky-400">
              {badges.filter((b) => b.unlocked).length} / {badges.length}
            </div>
          </div>
        </div>

        {/* Tabs: Badges / Certificate */}
        <div className="flex gap-2 mb-5 border-b border-[#21262d] pb-2">
          <button
            onClick={() => {
              sounds.playClick();
              setShowCertificate(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              !showCertificate
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            الأوسمة والنجوم 🏅
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setShowCertificate(true);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              showCertificate
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            شهادة التقدير الملكية 📜
          </button>
        </div>

        {/* Content */}
        {!showCertificate ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-3.5 rounded-2xl border flex items-center gap-3.5 transition-all ${
                  b.unlocked
                    ? 'bg-[#18212e] border-amber-500/40 text-white'
                    : 'bg-[#141820]/60 border-[#262c37] text-slate-500 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                    b.unlocked ? 'bg-amber-500/20 shadow-md' : 'bg-white/5'
                  }`}
                >
                  {b.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm truncate">{b.title}</h4>
                    {b.unlocked && <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-400 leading-tight mt-0.5">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Certificate View */
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#182232] to-[#0e141f] border-2 border-amber-400/50 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-2 left-2 text-amber-400/20 text-6xl select-none">👑</div>
            <div className="text-xs text-amber-400 font-bold uppercase tracking-widest mb-1">
              أكاديمية الأستاذ AI للغة العربية
            </div>
            <h3 className="text-2xl font-black text-white mb-2">شهادة تفوق وتقدير</h3>
            <p className="text-sm text-slate-300 mb-4">
              نُشهد بأن البطلة المتألقة والأميرة المبدعة:
            </p>
            <div className="text-3xl font-black text-amber-400 py-2 border-y border-amber-500/30 my-2">
              {childName}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto my-3">
              قد أظهرت تفوقاً وبراعة في خوض مغامرات الحروف وقراءة الكلمات ونطق الأصوات بكل ثقة واجتهاد!
            </p>
            <div className="flex justify-between items-center text-xs text-slate-400 pt-3 border-t border-[#263245] mt-4 px-4">
              <div>
                <span>التوقيع: </span>
                <span className="text-amber-400 font-bold">الأستاذ AI 🎓</span>
              </div>
              <div className="text-emerald-400 font-bold">الدرجة: امتياز مع مرتبة الشرف ⭐</div>
            </div>

            <button
              onClick={handlePrintCertificate}
              className="mt-5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-transform active:scale-95 inline-flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / حفظ الشهادة</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
