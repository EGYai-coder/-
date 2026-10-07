import React from 'react';
import { UNITS } from '../data/missionsData';
import { sounds } from '../services/soundEffects';
import { X, Award, CheckCircle, BarChart3, HeartHandshake, Printer, Sparkles, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ParentDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  childName: string;
  completedMissions: number[];
  totalMissions: number;
  xp: number;
  badges: string[];
}

export const ParentDashboardModal: React.FC<ParentDashboardModalProps> = ({
  isOpen,
  onClose,
  childName,
  completedMissions,
  totalMissions,
  xp,
  badges,
}) => {
  if (!isOpen) return null;

  const percentage = Math.round((completedMissions.length / totalMissions) * 100);

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
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 mb-3 font-bold text-2xl">
            👨‍👩‍👧
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">لوحة ولي الأمر والمعلم</h2>
          <p className="text-xs text-slate-400 mt-1">تقرير تفصيلي عن إنجازات وتطور {childName} في المنهج</p>
        </div>

        {/* Big Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-[#161b22] border border-[#30363d] text-center">
            <div className="text-[11px] text-slate-400 mb-1">نسبة الإنجاز</div>
            <div className="text-2xl font-black text-emerald-400">{percentage}%</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#161b22] border border-[#30363d] text-center">
            <div className="text-[11px] text-slate-400 mb-1">المهام المكتملة</div>
            <div className="text-2xl font-black text-amber-400">
              {completedMissions.length} <span className="text-xs text-slate-500">/ 54</span>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#161b22] border border-[#30363d] text-center">
            <div className="text-[11px] text-slate-400 mb-1">نقاط الخبرة</div>
            <div className="text-2xl font-black text-amber-300">{xp} XP</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#161b22] border border-[#30363d] text-center">
            <div className="text-[11px] text-slate-400 mb-1">الشارات المكتسبة</div>
            <div className="text-2xl font-black text-sky-400">{badges.length}</div>
          </div>
        </div>

        {/* Units Breakdown */}
        <div className="space-y-3 mb-6">
          <h4 className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>التقدم في الوحدات الدراسية الأربع:</span>
          </h4>

          {UNITS.map((u) => {
            const unitMissions = Array.from(
              { length: u.endMission - u.startMission + 1 },
              (_, i) => u.startMission + i
            );
            const doneInUnit = unitMissions.filter((id) => completedMissions.includes(id)).length;
            const unitPercent = Math.round((doneInUnit / unitMissions.length) * 100);

            return (
              <div key={u.number} className="p-3 rounded-xl bg-[#161b22] border border-[#30363d]">
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="flex items-center gap-1.5 text-white">
                    <span>{u.icon}</span>
                    <span>
                      الوحدة {u.number}: {u.name}
                    </span>
                  </span>
                  <span className="text-amber-400">
                    {doneInUnit} / {unitMissions.length} ({unitPercent}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#0c1017] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${unitPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Badges Vault */}
        <div className="mb-6">
          <h4 className="font-bold text-sm text-slate-200 mb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>خزنة الشارات التقديرية:</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {badges.map((b, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1.5"
              >
                <span>{b}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Teacher Note */}
        <div className="p-4 rounded-2xl bg-[#16212e] border border-[#2b3a4f] text-xs text-slate-300 leading-relaxed mb-6">
          <div className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>تقرير الأستاذ AI التقييمي:</span>
          </div>
          <p>
            {childName} تظهر شغفاً استثنائياً وتفاعلاً عالياً مع الأنشطة اللغوية والصوتية. قدرتها على
            الاستنتاج في محطات البحث الخمس تدل على ذكاء لغوي متقدم ورغبة دائمة في الاستكشاف!
          </p>
        </div>

        {/* Certificate Button */}
        <button
          onClick={handlePrintCertificate}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة تقرير التقدم والشهادة الملكية</span>
        </button>
      </div>
    </div>
  );
};
