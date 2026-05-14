import React, { useEffect, useState } from 'react';

const CONFETTI = ['🎁', '🎉', '⭐', '🌟', '✨', '💫'];

interface Props {
  rewardName: string;
  rewardEmoji: string;
  onComplete: () => void;
}

export default function RewardAnimation({ rewardName, rewardEmoji, onComplete }: Props) {
  const [phase, setPhase] = useState<'enter' | 'celebrate'>('enter');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('celebrate'), 500);
    const t2 = setTimeout(() => onComplete(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.82)' }}>
      {phase === 'celebrate' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="absolute text-3xl"
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

      <div className="flex flex-col items-center gap-5 bounce-in-anim">
        <div
          className="w-44 h-44 rounded-3xl flex items-center justify-center shadow-2xl"
          style={{ background: 'white', fontSize: 96 }}
        >
          {rewardEmoji}
        </div>
        <div className="text-center">
          <div className="text-white font-black text-3xl">🎉 교환 완료!</div>
          <div className="font-black text-2xl mt-2" style={{ color: '#FFD740' }}>{rewardName}</div>
          <div className="text-gray-300 text-sm mt-1">부모님께 알려드려요!</div>
        </div>
      </div>
    </div>
  );
}
