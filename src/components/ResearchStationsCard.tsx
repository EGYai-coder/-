import React, { useState } from 'react';
import { ResearchStations } from '../types';
import { sounds } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { HelpCircle, Search, FolderKanban, Wrench, Trophy, Volume2, Sparkles } from 'lucide-react';

interface ResearchStationsCardProps {
  research: ResearchStations;
  childName: string;
}

export const ResearchStationsCard: React.FC<ResearchStationsCardProps> = ({
  research,
  childName,
}) => {
  const [activeStation, setActiveStation] = useState<'ask' | 'discover' | 'organize' | 'tryIt' | 'treasure'>('ask');

  const stations = [
    {
      key: 'ask' as const,
      icon: '❓',
      title: 'نسأل',
      subtitle: 'فضول البطلة',
      color: 'border-amber-400 bg-amber-500/10 text-amber-300',
      activeBg: 'bg-amber-500 text-slate-950 font-bold',
      content: research.ask,
    },
    {
      key: 'discover' as const,
      icon: '🔎',
      title: 'نكتشف',
      subtitle: 'ملاحظة ذكية',
      color: 'border-sky-400 bg-sky-500/10 text-sky-300',
      activeBg: 'bg-sky-500 text-slate-950 font-bold',
      content: research.discover,
    },
    {
      key: 'organize' as const,
      icon: '🗂️',
      title: 'ننظم',
      subtitle: 'ترتيب الأفكار',
      color: 'border-emerald-400 bg-emerald-500/10 text-emerald-300',
      activeBg: 'bg-emerald-500 text-slate-950 font-bold',
      content: research.organize,
    },
    {
      key: 'tryIt' as const,
      icon: '🛠️',
      title: 'نجرّب',
      subtitle: 'تطبيق عملي',
      color: 'border-purple-400 bg-purple-500/10 text-purple-300',
      activeBg: 'bg-purple-500 text-slate-950 font-bold',
      content: research.tryIt,
    },
    {
      key: 'treasure' as const,
      icon: '🏆',
      title: 'الكنز',
      subtitle: 'جوهرة الإنجاز',
      color: 'border-yellow-400 bg-yellow-500/10 text-yellow-300',
      activeBg: 'bg-yellow-400 text-slate-950 font-bold',
      content: research.treasure,
    },
  ];

  const handleSelect = (key: typeof activeStation, content: string) => {
    sounds.playClick();
    setActiveStation(key);
    speech.speak(content);
  };

  const current = stations.find((s) => s.key === activeStation) || stations[0];

  return (
    <div className="bg-[#12161f] border border-[#21262d] rounded-2xl p-4 sm:p-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-[#21262d] pb-3 mb-4">
        <div>
          <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
            <span>🧪 رحلة البحث والاستكشاف العلمية</span>
          </h3>
          <p className="text-xs text-slate-400">
            طريقة العلماء الصغار: نسأل ➔ نكتشف ➔ ننظم ➔ نجرّب ➔ نصل للكنز!
          </p>
        </div>
        <span className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
          ٥ محطات
        </span>
      </div>

      {/* Five Stations Buttons */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-4">
        {stations.map((st) => {
          const isActive = activeStation === st.key;
          return (
            <button
              key={st.key}
              onClick={() => handleSelect(st.key, st.content)}
              className={`p-2 sm:p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                isActive
                  ? `${st.activeBg} shadow-lg shadow-amber-500/20 scale-103 ring-2 ring-white/50`
                  : 'bg-[#161b22] border-[#30363d] text-slate-300 hover:border-slate-500 hover:bg-[#1f2633]'
              }`}
            >
              <span className="text-xl sm:text-2xl">{st.icon}</span>
              <span className="text-xs sm:text-sm font-bold truncate">{st.title}</span>
              <span className="hidden sm:inline-block text-[10px] opacity-75 truncate">
                {st.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Station Content Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#161f2e] to-[#0f141d] border border-[#2a364a] shadow-inner relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">{current.icon}</span>
            <div>
              <div className="text-xs font-bold text-amber-400">
                محطة: {current.title} ({current.subtitle})
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white mt-0.5 leading-relaxed">
                {current.content}
              </h4>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              speech.speak(current.content);
            }}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 transition-colors flex-shrink-0"
            title="استمعي لصوت الأستاذ AI"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
