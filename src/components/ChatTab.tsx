import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Volume2, Sparkles, Lightbulb, HelpCircle } from 'lucide-react';
import { ChatMessage, LetterData } from '../types';
import { speech } from '../services/speechService';
import { sounds } from '../services/soundEffects';

interface ChatTabProps {
  letter: LetterData;
  childName: string;
  messages: ChatMessage[];
  isThinking: boolean;
  onSendMessage: (text: string) => void;
  statusText: string;
}

export const ChatTab: React.FC<ChatTabProps> = ({
  letter,
  childName,
  messages,
  isThinking,
  onSendMessage,
  statusText,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<ReturnType<typeof speech.createRecognizer> | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isThinking) return;

    sounds.playClick();
    onSendMessage(text);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (!speech.isSpeechRecognitionSupported()) {
      alert('الميكروفون غير مدعوم في هذا المتصفح، يمكنك استخدام الكتابة.');
      return;
    }

    sounds.playMicBeep();
    const recognizer = speech.createRecognizer(
      (transcript) => {
        if (transcript) {
          setInputText(transcript);
          handleSend(transcript);
        }
        setIsListening(false);
      },
      (err) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (recognizer) {
      recognitionRef.current = recognizer;
      setIsListening(true);
      try {
        recognizer.start();
      } catch (err) {
        console.warn('Failed to start recognizer:', err);
        setIsListening(false);
      }
    }
  };

  const handleReplayVoice = (text: string) => {
    sounds.playClick();
    speech.speak(text);
  };

  return (
    <div className="flex flex-col h-full bg-[#12161f] border border-[#21262d] rounded-2xl overflow-hidden shadow-xl">
      {/* Tab Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent px-4 py-3 border-b border-[#21262d] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
            {letter.letter}
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">حوار ذكي حول حرف {letter.name}</h4>
            <p className="text-[11px] text-slate-400">تحدثي مع الأستاذ AI بالكتابة أو بالصوت</p>
          </div>
        </div>
        <div className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
          حرف: {letter.letter}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[300px] max-h-[380px] scrollbar-thin scrollbar-thumb-slate-700">
        {messages.map((m) => {
          const isTeacher = m.role === 'teacher';
          return (
            <div
              key={m.id}
              className={`flex gap-2.5 ${isTeacher ? 'justify-start' : 'justify-end'}`}
            >
              {isTeacher && (
                <div className="w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-md flex-shrink-0 mt-0.5">
                  AI
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm text-sm sm:text-base leading-relaxed ${
                  isTeacher
                    ? 'bg-[#1a2130] border border-[#2c374d] text-slate-100 rounded-tr-none'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className={`text-[11px] font-bold ${
                      isTeacher ? 'text-amber-400' : 'text-slate-950/80'
                    }`}
                  >
                    {isTeacher ? 'الأستاذ AI' : childName}
                  </span>

                  {isTeacher && (
                    <button
                      onClick={() => handleReplayVoice(m.text)}
                      className="p-1 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-white/5 transition-colors"
                      title="استمعي للرسالة مجدداً"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="whitespace-pre-wrap">{m.text}</p>
              </div>

              {!isTeacher && (
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white font-bold text-xs flex items-center justify-center shadow-md flex-shrink-0 mt-0.5">
                  👧
                </div>
              )}
            </div>
          );
        })}

        {isThinking && (
          <div className="flex gap-2.5 justify-start items-center">
            <div className="w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-md flex-shrink-0">
              AI
            </div>
            <div className="bg-[#1a2130] border border-[#2c374d] rounded-2xl rounded-tr-none p-3.5 flex items-center gap-1.5">
              <span className="text-xs text-amber-400 font-medium">الأستاذ يفكر...</span>
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Suggestions */}
      <div className="px-4 py-2 bg-[#0e121a] border-t border-[#21262d] flex flex-wrap gap-1.5 items-center">
        <span className="text-[11px] text-slate-400 ml-1">اقتراحات سريعة:</span>
        {letter.words.slice(0, 3).map((w, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(w.word)}
            className="px-2.5 py-1 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-xs text-amber-300 transition-colors flex items-center gap-1"
          >
            <span>{w.emoji}</span>
            <span>{w.word}</span>
          </button>
        ))}

        <button
          onClick={() => handleSend('أعطني تلميحاً يا أستاذ!')}
          className="px-2.5 py-1 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-xs text-slate-300 transition-colors flex items-center gap-1"
        >
          <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
          <span>تلميح</span>
        </button>

        <button
          onClick={() => handleSend('لا أعرف')}
          className="px-2.5 py-1 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-xs text-slate-300 transition-colors flex items-center gap-1"
        >
          <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
          <span>لا أعرف</span>
        </button>
      </div>

      {/* Composer Input */}
      <div className="p-3 bg-[#12161f] border-t border-[#21262d]">
        <div className="flex items-center gap-2">
          {/* Mic Button */}
          <button
            onClick={toggleMic}
            className={`p-3 rounded-xl border transition-all ${
              isListening
                ? 'bg-rose-500 border-rose-400 text-white animate-pulse shadow-lg shadow-rose-500/30'
                : 'bg-[#161b22] border-[#30363d] text-slate-300 hover:text-amber-400 hover:border-amber-400/50'
            }`}
            title={isListening ? 'أوقف الاستماع' : 'تحدثي بالميكروفون يا ساجدة'}
          >
            {isListening ? <Mic className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`اكتبي إجابتك أو سؤالك عن حرف ${letter.name}...`}
            className="flex-1 bg-[#090d14] border border-[#30363d] focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
          />

          {/* Send Button */}
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isThinking}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            <span className="hidden sm:inline text-xs">إرسال</span>
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </div>

        {/* Live Mic or Status Note */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>{isListening ? '🎙️ الأستاذ يستمع لكِ الآن يا ساجدة...' : statusText}</span>
          <span className="text-amber-500/80">حرف {letter.letter} في واحة التعلم</span>
        </div>
      </div>
    </div>
  );
};
