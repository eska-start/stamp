import React, { useEffect, useState } from 'react';
import { StampType } from '../types';

const STAMP_DATA: Record<StampType, { label: string; color: string; emoji: string; bg: string }> = {
  good:    { label: 'GOOD!',    color: '#FF6B6B', emoji: '⭐', bg: '#FFF0F0' },
  nice:    { label: 'NICE!',    color: '#FFB800', emoji: '☀️', bg: '#FFFBF0' },
  great:   { label: 'GREAT!',   color: '#40C057', emoji: '🦕', bg: '#F0FFF4' },
  wow:     { label: 'WOW!',     color: '#845EF7', emoji: '👑', bg: '#F5F0FF' },
  perfect: { label: 'PERFECT!', color: '#339AF0', emoji: '💎', bg: '#F0F8FF' },
};

const CONFETTI = ['⭐', '🌟', '✨', '💫', '🎉', '🎊', '💥'];

interface Props {
  stampType: StampType;
  childName: string;
  onComplete: () => void;
}

export default function StampAnimation({ stampType, childName, onComplete }: Props) {
  const [phase, setPhase] = useState<'stamp' | 'celebrate'>('stamp');
  const data = STAMP_DATA[stampType];

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('celebrate'), 700);
    const t2 = setTimeout(() => onComplete(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.75)' }}>
      {phase === 'celebrate' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-30px',
                animation: `confetti-fall ${1.2 + Math.random() * 1.8}s ease-in forwards`,
                animationDelay: `${Math.random() * 0.6}s`,
              }}
            >
              {CONFETTI[Math.floor(Math.random() * CONFETTI.length)]}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col items-center gap-5">
        <div
          className="w-52 h-52 rounded-full flex flex-col items-center justify-center shadow-2xl"
          style={{
            background: data.bg,
            border: `8px solid ${data.color}`,
            animation: phase === 'stamp' ? 'stamp-in 0.7s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards' : undefined,
          }}
        >
          <div className="text-7xl mb-1">{data.emoji}</div>
          <div className="font-black text-2xl" style={{ color: data.color }}>{data.label}</div>
        </div>

        {phase === 'celebrate' && (
          <div className="text-center bounce-in-anim">
            <div className="text-white font-black text-3xl">🎉 획득!</div>
            <div className="text-yellow-300 font-bold text-xl mt-1">{childName}에게 ⭐ +1!</div>
          </div>
        )}
      </div>
    </div>
  );
}
