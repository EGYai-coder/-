import React, { useState } from 'react';
import { MissionData } from '../types';
import { UNITS } from '../data/missionsData';
import { sounds } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { Check, Compass, Layers, Search, ChevronDown, Sparkles } from 'lucide-react';

interface MissionsSidebarProps {
  missions: MissionData[];
  currentMissionId: number;
  completedMissions: number[];
  onSelectMission: (id: number) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const MissionsSidebar: React.FC<MissionsSidebarProps> = ({
  missions,
  currentMissionId,
  completedMissions,
  onSelectMission,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMissions = missions.filter((m) => {
    const matchesUnit = selectedUnit === null || m.unitNumber === selectedUnit;
    const matchesSearch =
      searchQuery === '' ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(m.id).includes(searchQuery);
    return matchesUnit && matchesSearch;
  });

  const handleMissionClick = (id: number) => {
    sounds.playClick();
    onSelectMission(id);
    const m = missions.find((item) => item.id === id);
    if (m) {
      speech.speak(`المهمة رقم ${m.id}: ${m.title}`);
    }
    if (isOpenMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      className={`fixed lg:static inset-y-0 right-0 z-40 w-80 lg:w-72 bg-[#0e1219] border-l border-[#21262d] flex flex-col transition-transform duration-300 ${
        isOpenMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-[#21262d]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-sm sm:text-base">خريطة الـ ٥٤ مهمة</h3>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            {completedMissions.length} / 54
          </span>
        </div>

        {/* Search input */}
        <div className="relative mt-2">
          <input
            type="text"
            placeholder="ابحثي عن مهمة أو حرف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161b22] border border-[#30363d] focus:border-amber-400 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Unit Selector Pills */}
      <div className="p-2 border-b border-[#21262d] flex gap-1.5 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setSelectedUnit(null)}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedUnit === null
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-[#161b22] text-slate-400 hover:text-white'
          }`}
        >
          الكل (٥٤)
        </button>
        {UNITS.map((u) => {
          const unitCompletedCount = missions
            .filter((m) => m.unitNumber === u.number)
            .filter((m) => completedMissions.includes(m.id)).length;
          const unitTotalCount = u.endMission - u.startMission + 1;

          return (
            <button
              key={u.number}
              onClick={() => setSelectedUnit(u.number)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                selectedUnit === u.number
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-[#161b22] text-slate-400 hover:text-white'
              }`}
            >
              <span>{u.icon}</span>
              <span>{u.name}</span>
              <span className="text-[10px] opacity-75">
                ({unitCompletedCount}/{unitTotalCount})
              </span>
            </button>
          );
        })}
      </div>

      {/* Missions List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
        {filteredMissions.map((m) => {
          const isActive = m.id === currentMissionId;
          const isDone = completedMissions.includes(m.id);

          return (
            <button
              key={m.id}
              onClick={() => handleMissionClick(m.id)}
              className={`w-full text-right p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                isActive
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400/50 shadow-md'
                  : isDone
                  ? 'bg-[#141d18] border-emerald-500/30 text-emerald-200 hover:border-emerald-400/60'
                  : 'bg-[#141820] border-[#252b36] text-slate-300 hover:bg-[#1a212d] hover:border-slate-500'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center flex-shrink-0 ${
                    isActive
                      ? 'bg-amber-400 text-slate-950'
                      : isDone
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-[#202530] text-slate-400'
                  }`}
                >
                  {isDone ? '✓' : m.id}
                </span>

                <div className="truncate">
                  <div className="text-xs font-bold truncate">{m.title}</div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {m.unit} • {m.type}
                  </div>
                </div>
              </div>

              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/5 flex-shrink-0">
                {m.type}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
