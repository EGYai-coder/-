/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { MISSIONS, UNITS } from './data/missionsData';
import { ARABIC_LETTERS, BADGES } from './data/lettersData';
import { MissionData, LearningMode, ChatMessage, LetterData } from './types';
import { Header } from './components/Header';
import { ProfessorAvatar } from './components/ProfessorAvatar';
import { MissionsSidebar } from './components/MissionsSidebar';
import { ResearchStationsCard } from './components/ResearchStationsCard';
import { MissionActivityCard } from './components/MissionActivityCard';
import { ChatTab } from './components/ChatTab';
import { DrawingCanvas } from './components/DrawingCanvas';
import { PhonicsTab } from './components/PhonicsTab';
import { AchievementsModal } from './components/AchievementsModal';
import { ParentDashboardModal } from './components/ParentDashboardModal';
import { ParentSettingsModal } from './components/ParentSettingsModal';
import { askProfessorAI } from './services/apiService';
import { speech } from './services/speechService';
import { sounds } from './services/soundEffects';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Target,
  FlaskConical,
  MessageSquare,
  Paintbrush,
  Volume2,
  Trophy,
  Compass,
} from 'lucide-react';

export default function App() {
  // Stored States
  const [childName, setChildName] = useState<string>(() => {
    return localStorage.getItem('sajada_child_name') || 'ساجدة';
  });

  const [currentMissionId, setCurrentMissionId] = useState<number>(() => {
    const saved = localStorage.getItem('sajada_mission_id');
    return saved !== null ? Math.min(54, Math.max(1, Number(saved))) : 1;
  });

  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('sajada_xp');
    return saved !== null ? Number(saved) : 0;
  });

  const [completedMissions, setCompletedMissions] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('sajada_completed_missions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [badgesVault, setBadgesVault] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sajada_badges_vault');
      return saved ? JSON.parse(saved) : ['🚀 أول خطوة'];
    } catch {
      return ['🚀 أول خطوة'];
    }
  });

  // UI States
  const [activeMode, setActiveMode] = useState<LearningMode>('mission');
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [xpPopping, setXpPopping] = useState<boolean>(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState<boolean>(false);
  const [isParentDashboardOpen, setIsParentDashboardOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isMissionsDrawerOpen, setIsMissionsDrawerOpen] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>('الأستاذ AI جاهز للمغامرة معكِ! 🚀');

  const currentMission: MissionData = useMemo(() => {
    return MISSIONS.find((m) => m.id === currentMissionId) || MISSIONS[0];
  }, [currentMissionId]);

  // Find associated letter data if applicable
  const associatedLetter: LetterData = useMemo(() => {
    if (currentMission.letterKey) {
      const found = ARABIC_LETTERS.find((l) => l.letter === currentMission.letterKey);
      if (found) return found;
    }
    return ARABIC_LETTERS[0];
  }, [currentMission]);

  // Conversation history for active mission
  const [conversation, setConversation] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'teacher',
      text: `أهلاً يا ${childName} يا بطلة! 🌟 نحن الآن في المهمة رقم ${currentMission.id}: «${currentMission.title}». جاهزة نسأل ونكتشف ونفوز؟`,
      timestamp: Date.now(),
    },
  ]);

  // Listen to speech synthesis
  useEffect(() => {
    const unsub = speech.subscribeSpeaking((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => unsub();
  }, []);

  // Save state to LocalStorage
  useEffect(() => {
    localStorage.setItem('sajada_child_name', childName);
  }, [childName]);

  useEffect(() => {
    localStorage.setItem('sajada_mission_id', String(currentMissionId));
  }, [currentMissionId]);

  useEffect(() => {
    localStorage.setItem('sajada_xp', String(xp));
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('sajada_completed_missions', JSON.stringify(completedMissions));
  }, [completedMissions]);

  useEffect(() => {
    localStorage.setItem('sajada_badges_vault', JSON.stringify(badgesVault));
  }, [badgesVault]);

  // Handle mission selection
  const handleSelectMission = (id: number) => {
    if (id === currentMissionId) return;
    setCurrentMissionId(id);
    const m = MISSIONS.find((item) => item.id === id) || MISSIONS[0];
    const welcome = `أهلاً يا ${childName} في المهمة ${m.id}: «${m.title}»! هيا نبدأ الاستكشاف! 🌟`;
    setConversation([
      {
        id: `intro-${Date.now()}`,
        role: 'teacher',
        text: welcome,
        timestamp: Date.now(),
      },
    ]);
    speech.speak(welcome);
  };

  const handleNextMission = () => {
    if (currentMissionId < 54) {
      handleSelectMission(currentMissionId + 1);
    }
  };

  const handlePrevMission = () => {
    if (currentMissionId > 1) {
      handleSelectMission(currentMissionId - 1);
    }
  };

  const handleAwardXP = (amount: number) => {
    const newXP = xp + amount;
    setXp(newXP);
    setXpPopping(true);
    setTimeout(() => setXpPopping(false), 600);
  };

  const handleFinishMission = () => {
    if (!completedMissions.includes(currentMissionId)) {
      const updated = [...completedMissions, currentMissionId];
      setCompletedMissions(updated);

      // Check badges unlocks
      const newBadges = [...badgesVault];
      if (updated.length >= 8 && !newBadges.includes('🔤 مكتشف الحروف')) {
        newBadges.push('🔤 مكتشف الحروف');
      }
      if (updated.length >= 17 && !newBadges.includes('🏠 بطل الأسرة')) {
        newBadges.push('🏠 بطل الأسرة');
      }
      if (updated.length >= 31 && !newBadges.includes('🐾 صديق الحيوانات')) {
        newBadges.push('🐾 صديق الحيوانات');
      }
      if (updated.length >= 44 && !newBadges.includes('🧍 خبير الجسم')) {
        newBadges.push('🧍 خبير الجسم');
      }
      if (updated.length >= 53 && !newBadges.includes('🏫 بطل المدرسة')) {
        newBadges.push('🏫 بطل المدرسة');
      }
      if (updated.length === 54 && !newBadges.includes('🏆 فاتح الكنز')) {
        newBadges.push('🏆 فاتح الكنز');
      }
      setBadgesVault(newBadges);
    }
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    const newConvo = [...conversation, userMsg];
    setConversation(newConvo);
    setIsThinking(true);
    setStatusText('الأستاذ AI يفكر في إجابة ذكية...');

    try {
      const reply = await askProfessorAI(text, associatedLetter, newConvo, childName);
      setIsThinking(false);

      const teacherMsg: ChatMessage = {
        id: `teacher-${Date.now()}`,
        role: 'teacher',
        text: reply,
        timestamp: Date.now(),
      };

      setConversation((prev) => [...prev, teacherMsg]);
      setStatusText('أحسنتِ يا ساجدة! ⭐');
      sounds.playSuccess();
      handleAwardXP(10);
      speech.speak(reply);
    } catch (err) {
      setIsThinking(false);
      setStatusText('تعذر إرسال الرسالة، جربي ثانية');
    }
  };

  const handleToggleVoice = () => {
    const nextVal = !voiceEnabled;
    setVoiceEnabled(nextVal);
    speech.enabled = nextVal;
    sounds.enabled = nextVal;
    if (!nextVal) speech.stop();
  };

  const handleResetProgress = () => {
    setXp(0);
    setCurrentMissionId(1);
    setCompletedMissions([]);
    setBadgesVault(['🚀 أول خطوة']);
    setConversation([
      {
        id: 'reset-1',
        role: 'teacher',
        text: `أهلاً من جديد يا ${childName}! نبدأ من المهمة الأولى بكل حماس وطاقة! 🚀`,
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-[#f7f7f4] flex flex-col font-['Readex_Pro',sans-serif]">
      {/* Header */}
      <Header
        childName={childName}
        xp={xp}
        completedMissionsCount={completedMissions.length}
        totalMissions={54}
        voiceEnabled={voiceEnabled}
        onToggleVoice={handleToggleVoice}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onOpenParentDashboard={() => setIsParentDashboardOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleMissionsDrawer={() => setIsMissionsDrawerOpen(!isMissionsDrawerOpen)}
        xpPopping={xpPopping}
      />

      <div className="flex-1 flex max-w-[1550px] w-full mx-auto relative">
        {/* Main Workspace */}
        <main className="flex-1 p-3 sm:p-6 space-y-5 overflow-hidden">
          {/* Hero Banner with Professor AI Avatar */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#171a22] via-[#101319] to-[#090b0f] border border-[#4b3b17]/60 p-5 sm:p-7 shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="text-center md:text-right flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-2">
                  <span>{currentMission.unit}</span>
                  <span>•</span>
                  <span>المهمة {String(currentMission.id).padStart(2, '0')}</span>
                  <span>({currentMission.type})</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-2">
                  {currentMission.title}
                </h2>

                <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed mb-4">
                  {currentMission.description}
                </p>

                {/* Hero Action Controls */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                  <button
                    onClick={() => {
                      sounds.playSuccess();
                      handleAwardXP(5);
                      speech.speak(
                        `هيا بنا نبدأ المهمة ${currentMission.id}: ${currentMission.title}! أنتِ بطلة ذكية يا ${childName}!`
                      );
                    }}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>ابدأ المهمة (+5 XP)</span>
                  </button>

                  <button
                    onClick={handlePrevMission}
                    disabled={currentMissionId === 1}
                    className="px-3.5 py-2 rounded-xl bg-[#161b22] hover:bg-[#21262d] disabled:opacity-30 disabled:cursor-not-allowed border border-[#30363d] text-xs text-slate-300 transition-colors flex items-center gap-1"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>السابقة</span>
                  </button>

                  <button
                    onClick={handleNextMission}
                    disabled={currentMissionId === 54}
                    className="px-3.5 py-2 rounded-xl bg-[#161b22] hover:bg-[#21262d] disabled:opacity-30 disabled:cursor-not-allowed border border-[#30363d] text-xs text-slate-300 transition-colors flex items-center gap-1"
                  >
                    <span>المهمة التالية</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Professor AI Mascot Orb & Avatar */}
              <div className="flex-shrink-0">
                <ProfessorAvatar isSpeaking={isSpeaking} childName={childName} />
              </div>
            </div>

            {/* Subtle glow background */}
            <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          </section>

          {/* Quick Learning Mode Switcher */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#21262d]">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveMode('mission');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeMode === 'mission'
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-102 font-black'
                  : 'bg-[#141820] text-slate-400 hover:text-white border border-[#272d38]'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>مهمة اليوم التفاعلية</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveMode('research');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeMode === 'research'
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-102 font-black'
                  : 'bg-[#141820] text-slate-400 hover:text-white border border-[#272d38]'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              <span>محطات البحث الـ ٥</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveMode('chat');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeMode === 'chat'
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-102 font-black'
                  : 'bg-[#141820] text-slate-400 hover:text-white border border-[#272d38]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>حوار الأستاذ AI</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveMode('drawing');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeMode === 'drawing'
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-102 font-black'
                  : 'bg-[#141820] text-slate-400 hover:text-white border border-[#272d38]'
              }`}
            >
              <Paintbrush className="w-4 h-4" />
              <span>سبورة الخط والرسم</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveMode('phonics');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeMode === 'phonics'
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-102 font-black'
                  : 'bg-[#141820] text-slate-400 hover:text-white border border-[#272d38]'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>أصوات الحركات</span>
            </button>
          </div>

          {/* Active View Container */}
          <div>
            {activeMode === 'mission' && (
              <div className="space-y-5">
                <MissionActivityCard
                  mission={currentMission}
                  childName={childName}
                  isCompleted={completedMissions.includes(currentMissionId)}
                  onFinishMission={handleFinishMission}
                  onNextMission={handleNextMission}
                  hasNextMission={currentMissionId < 54}
                  onAwardXP={handleAwardXP}
                  onOpenDrawingMode={() => setActiveMode('drawing')}
                />
                <ResearchStationsCard research={currentMission.research} childName={childName} />
              </div>
            )}

            {activeMode === 'research' && (
              <ResearchStationsCard research={currentMission.research} childName={childName} />
            )}

            {activeMode === 'chat' && (
              <ChatTab
                letter={associatedLetter}
                childName={childName}
                messages={conversation}
                isThinking={isThinking}
                onSendMessage={handleSendMessage}
                statusText={statusText}
              />
            )}

            {activeMode === 'drawing' && (
              <DrawingCanvas
                letter={associatedLetter}
                childName={childName}
                onAwardXP={handleAwardXP}
              />
            )}

            {activeMode === 'phonics' && (
              <PhonicsTab letter={associatedLetter} childName={childName} />
            )}
          </div>
        </main>

        {/* 54 Missions Sidebar (Sticky on Desktop, Drawer on Mobile) */}
        <MissionsSidebar
          missions={MISSIONS}
          currentMissionId={currentMissionId}
          completedMissions={completedMissions}
          onSelectMission={handleSelectMission}
          isOpenMobile={isMissionsDrawerOpen}
          onCloseMobile={() => setIsMissionsDrawerOpen(false)}
        />
      </div>

      {/* Footer */}
      <footer className="mt-auto py-4 border-t border-[#1c2330] bg-[#090b10] text-center text-xs text-slate-500 px-4">
        <p>
          مغامرات {childName} مع الأستاذ AI — منهج الـ ٥٤ مهمة التفاعلي للصف الأول الابتدائي بالصوت
          والذكاء الاصطناعي 🌟
        </p>
      </footer>

      {/* Parent Dashboard Modal */}
      <ParentDashboardModal
        isOpen={isParentDashboardOpen}
        onClose={() => setIsParentDashboardOpen(false)}
        childName={childName}
        completedMissions={completedMissions}
        totalMissions={54}
        xp={xp}
        badges={badgesVault}
      />

      {/* Achievements Modal */}
      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        badges={BADGES}
        xp={xp}
        completedLettersCount={completedMissions.length}
        childName={childName}
      />

      {/* Settings Modal */}
      <ParentSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        childName={childName}
        onUpdateChildName={setChildName}
        onResetProgress={handleResetProgress}
      />
    </div>
  );
}
