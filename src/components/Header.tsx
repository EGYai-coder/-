import React from 'react';
import { Volume2, VolumeX, Award, Settings, Sparkles, BookOpen, Users, Compass } from 'lucide-react';
import { sounds } from '../services/soundEffects';

interface HeaderProps {
  childName: string;
  xp: number;
  completedMissionsCount: number;
  totalMissions: number;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onOpenAchievements: () => void;
  onOpenParentDashboard: () => void;
  onOpenSettings: () => void;
  onToggleMissionsDrawer: () => void;
  xpPopping: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  childName,
  xp,
  completedMissionsCount,
  totalMissions,
  voiceEnabled,
  onToggleVoice,
  onOpenAchievements,
  onOpenParentDashboard,
  onOpenSettings,
  onToggleMissionsDrawer,
  xpPopping,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0d1117]/90 backdrop-blur-md border-b border-[#21262d] px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand & Missions Mobile Button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              sounds.playClick();
              onToggleMissionsDrawer();
            }}
            className="lg:hidden p-2 rounded-xl bg-[#161b22] border border-[#30363d] text-amber-400"
            title="خريطة المهام الـ ٥٤"
          >
            <Compass className="w-5 h-5" />
          </button>

          <div className="relative">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-lg sm:text-xl">
              س
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0d1117] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-sm sm:text-lg text-white tracking-wide">
                مغامرات <span className="text-amber-400">{childName}</span>
              </h1>
              <span className="hidden sm:inline-block text-[11px] text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                ٥٤ مهمة
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-400">
              ساجدة لا تسمع الدرس... بل تعيش الدرس!
            </p>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* XP Counter */}
          <div
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs sm:text-sm transition-transform ${
              xpPopping ? 'scale-110 shadow-lg shadow-amber-500/30 ring-2 ring-amber-400' : ''
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>{xp}</span>
            <span className="text-[10px] text-amber-400/80">XP</span>
          </div>

          {/* Missions Progress */}
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#161b22] border border-[#30363d] text-slate-300 text-xs sm:text-sm">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>{completedMissionsCount}</span>
            <span className="text-slate-500">/</span>
            <span>{totalMissions}</span>
          </div>

          {/* Parent Dashboard Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenParentDashboard();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1 font-semibold"
            title="لوحة ولي الأمر والمعلم"
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">ولي الأمر</span>
          </button>

          {/* Badges Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenAchievements();
            }}
            className="p-1.5 sm:p-2 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-amber-400 hover:text-amber-300 transition-colors"
            title="الأوسمة والإنجازات"
            aria-label="الأوسمة"
          >
            <Award className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Voice Audio Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              onToggleVoice();
            }}
            className={`p-1.5 sm:p-2 rounded-xl border transition-colors ${
              voiceEnabled
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
            }`}
            title={voiceEnabled ? 'صوت الأستاذ مفعل' : 'صوت الأستاذ مكتوم'}
            aria-label="صوت المعلم"
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Settings Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenSettings();
            }}
            className="p-1.5 sm:p-2 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-slate-300 hover:text-white transition-colors"
            title="الإعدادات"
            aria-label="الإعدادات"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

