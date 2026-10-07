import React, { useState } from 'react';
import { sounds } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { X, User, Sliders, RotateCcw, Check, Sparkles } from 'lucide-react';

interface ParentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  childName: string;
  onUpdateChildName: (name: string) => void;
  onResetProgress: () => void;
}

export const ParentSettingsModal: React.FC<ParentSettingsModalProps> = ({
  isOpen,
  onClose,
  childName,
  onUpdateChildName,
  onResetProgress,
}) => {
  const [nameInput, setNameInput] = useState(childName);
  const [speechRate, setSpeechRate] = useState(speech.rate);

  if (!isOpen) return null;

  const handleSave = () => {
    sounds.playClick();
    if (nameInput.trim()) {
      onUpdateChildName(nameInput.trim());
    }
    speech.rate = speechRate;
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من إعادة ضبط تقدم التعلم والبدء من جديد؟')) {
      sounds.playClick();
      onResetProgress();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#12161f] border border-[#262f40] rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-scaleIn">
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

        <h3 className="text-xl font-bold text-white mb-1">إعدادات التعلم والأهل</h3>
        <p className="text-xs text-slate-400 mb-5">تخصيص تجربة التعلّم لساجدة مع الأستاذ AI</p>

        {/* Child Name Setting */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-400" />
              <span>اسم الطفلة أو المتعلم</span>
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full bg-[#0c1017] border border-[#30363d] focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              placeholder="مثال: ساجدة"
            />
          </div>

          {/* Voice Speed */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>سرعة صوت المعلم</span>
              </span>
              <span className="text-xs text-amber-400">{speechRate.toFixed(2)}x</span>
            </label>
            <input
              type="range"
              min={0.7}
              max={1.2}
              step={0.05}
              value={speechRate}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setSpeechRate(val);
                speech.rate = val;
              }}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>هادئ جداً</span>
              <span>طبيعي</span>
              <span>سريع</span>
            </div>
          </div>

          {/* Reset progress */}
          <div className="pt-3 border-t border-[#21262d]">
            <button
              onClick={handleReset}
              className="w-full py-2.5 px-4 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-xs text-rose-300 font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة ضبط التقدم والبدء من جديد</span>
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="mt-6">
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>حفظ الإعدادات</span>
          </button>
        </div>
      </div>
    </div>
  );
};
