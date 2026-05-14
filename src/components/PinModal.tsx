import React, { useState, useRef, useEffect } from 'react';

interface Props {
  title: string;
  subtitle: string;
  correctPin: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function PinModal({ title, subtitle, correctPin, onSuccess, onClose }: Props) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  useEffect(() => { refs[0].current?.focus(); }, []);

  const handleChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...pin];
    next[idx] = val;
    setPin(next);
    setError(false);
    if (val && idx < 3) refs[idx + 1].current?.focus();
    if (idx === 3 && val) {
      const entered = [...next.slice(0, 3), val].join('');
      if (entered === correctPin) {
        onSuccess();
      } else {
        setError(true);
        setShaking(true);
        setTimeout(() => {
          setShaking(false);
          setPin(['', '', '', '']);
          refs[0].current?.focus();
        }, 600);
      }
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[idx] && idx > 0) refs[idx - 1].current?.focus();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-6" onClick={onClose}>
      <div
        className="bg-white rounded-3xl p-6 w-full shadow-2xl bounce-in-anim"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔐</div>
          <h2 className="font-black text-gray-800 text-xl">{title}</h2>
          <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        </div>
        <div className={`flex justify-center gap-3 mb-4 ${shaking ? 'shake-anim' : ''}`}>
          {pin.map((digit, i) => (
            <input
              key={i}
              ref={refs[i]}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className="w-14 h-14 text-center text-2xl font-black rounded-2xl border-2 outline-none transition-all"
              style={{
                borderColor: error ? '#FF6B6B' : digit ? '#9B7FD4' : '#E0E0E0',
                background: digit ? '#F0E8FF' : '#F8F8F8',
              }}
            />
          ))}
        </div>
        {error && <p className="text-red-500 text-sm text-center mb-3">PIN이 올바르지 않습니다</p>}
        <button onClick={onClose} className="w-full py-3 rounded-2xl bg-gray-100 text-gray-600 font-bold">취소</button>
      </div>
    </div>
  );
}
