import React, { useRef, useState, useEffect } from 'react';
import { LetterData } from '../types';
import { sounds } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { Eraser, RotateCcw, CheckCircle, Palette, Sparkles, Download } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DrawingCanvasProps {
  letter: LetterData;
  childName: string;
  onAwardXP: (amount: number) => void;
}

const COLORS = [
  { name: 'ذهبي سحري', hex: '#f59e0b', ring: 'ring-amber-400' },
  { name: 'وردي لطيف', hex: '#ec4899', ring: 'ring-pink-400' },
  { name: 'زمردي براق', hex: '#10b981', ring: 'ring-emerald-400' },
  { name: 'أزرق سماوي', hex: '#38bdf8', ring: 'ring-sky-400' },
  { name: 'بنفسجي ملكي', hex: '#a855f7', ring: 'ring-purple-400' },
];

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  letter,
  childName,
  onAwardXP,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState('#f59e0b');
  const [brushSize, setBrushSize] = useState(8);
  const [isEraser, setIsEraser] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokesHistory, setStrokesHistory] = useState<ImageData[]>([]);
  const [reviewed, setReviewed] = useState(false);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset when letter changes
    resetCanvas();
  }, [letter]);

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background
    ctx.fillStyle = '#0f141d';
    ctx.fillRect(0, 0, width, height);

    // Draw baseline guide
    ctx.strokeStyle = '#273549';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(30, height * 0.65);
    ctx.lineTo(width - 30, height * 0.65);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw translucent background letter for tracing
    ctx.font = `bold ${height * 0.55}px "Readex Pro", "Tajawal", "Arial", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
    ctx.fillText(letter.letter, width / 2, height * 0.5);

    // Subtle outline for tracing
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
    ctx.lineWidth = 3;
    ctx.strokeText(letter.letter, width / 2, height * 0.5);

    setStrokesHistory([]);
    setReviewed(false);
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setStrokesHistory((prev) => [...prev.slice(-10), data]);
  };

  const undo = () => {
    sounds.playClick();
    if (strokesHistory.length === 0) {
      resetCanvas();
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...strokesHistory];
    newHistory.pop();
    const previous = newHistory[newHistory.length - 1];

    if (previous) {
      ctx.putImageData(previous, 0, 0);
      setStrokesHistory(newHistory);
    } else {
      resetCanvas();
    }
  };

  // Pointer event handlers
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    saveState();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isEraser ? '#0f141d' : selectedColor;
    ctx.lineWidth = isEraser ? brushSize * 2.5 : brushSize;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const handleProfessorReview = () => {
    sounds.playReward();
    setReviewed(true);
    onAwardXP(15);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#ec4899', '#10b981', '#38bdf8'],
    });

    const compliments = [
      `يا ساجدة يا فنانة! خطك في حرف ${letter.name} رائع ومتقن كالأميرات! 👑`,
      `خطاطة ماهرة يا ساجدة! رسمك لحرف ${letter.letter} يستحق عشر نجوم ذهبية! ⭐`,
      `ما شاء الله، إبداع لا يوصف! الأستاذ AI فخور بيكي جداً! 🎨`,
    ];
    const praise = compliments[Math.floor(Math.random() * compliments.length)];
    speech.speak(praise);
  };

  return (
    <div className="bg-[#12161f] border border-[#21262d] rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-4">
      {/* Title & Hint */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#21262d] pb-3">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-white flex items-center gap-2">
            <span>سبورة الخط السحرية</span>
            <span className="text-amber-400">حرف {letter.name} ({letter.letter})</span>
          </h3>
          <p className="text-xs text-amber-300/80 mt-1">{letter.strokeHint}</p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Colors */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#161b22] border border-[#30363d]">
            {COLORS.map((c) => (
              <button
                key={c.hex}
                onClick={() => {
                  sounds.playClick();
                  setSelectedColor(c.hex);
                  setIsEraser(false);
                }}
                style={{ backgroundColor: c.hex }}
                className={`w-6 h-6 rounded-full transition-transform ${
                  !isEraser && selectedColor === c.hex
                    ? 'scale-125 ring-2 ring-white shadow-md'
                    : 'hover:scale-110'
                }`}
                title={c.name}
              />
            ))}
          </div>

          {/* Eraser */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsEraser(!isEraser);
            }}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1 transition-colors ${
              isEraser
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                : 'bg-[#161b22] border-[#30363d] text-slate-300 hover:text-white'
            }`}
            title="ممحاة"
          >
            <Eraser className="w-4 h-4" />
            <span className="hidden sm:inline">ممحاة</span>
          </button>

          {/* Undo */}
          <button
            onClick={undo}
            className="p-2 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-slate-300 hover:text-white transition-colors"
            title="تراجع"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Clear */}
          <button
            onClick={() => {
              sounds.playClick();
              resetCanvas();
            }}
            className="px-3 py-1.5 rounded-xl bg-[#161b22] hover:bg-rose-500/20 border border-[#30363d] hover:border-rose-500/40 text-xs text-rose-300 transition-colors"
          >
            مسح الكل
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[420px] rounded-2xl overflow-hidden border border-[#2c374d] shadow-inner bg-[#0f141d] touch-none">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="w-full h-full cursor-crosshair"
        />

        {reviewed && (
          <div className="absolute top-4 left-4 bg-amber-500/90 text-slate-950 font-black px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
            <Sparkles className="w-5 h-5" />
            <span>لوحة فنية ممتازة يا ساجدة! ⭐</span>
          </div>
        )}
      </div>

      {/* Bottom Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span>حجم الفرشاة:</span>
          <input
            type="range"
            min={4}
            max={20}
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-24 accent-amber-500"
          />
        </div>

        <button
          onClick={handleProfessorReview}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <Sparkles className="w-5 h-5 text-slate-950" />
          <span>أري الأستاذ رسمي السحري (+15 XP)</span>
        </button>
      </div>
    </div>
  );
};
