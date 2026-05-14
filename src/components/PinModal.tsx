import React, { useState, useEffect } from 'react';
import { C, SH } from '../lib/design';

interface Props {
  title:      string;
  subtitle:   string;
  correctPin: string;
  onSuccess:  () => void;
  onClose:    () => void;
}

export default function PinModal({ title, subtitle, correctPin, onSuccess, onClose }: Props) {
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (pin.length !== 4) return;
    if (pin === correctPin) {
      setOk(true);
      setTimeout(onSuccess, 500);
    } else {
      setShake(true);
      setTimeout(() => { setShake(false); setPin(''); }, 500);
    }
  }, [pin]);

  const press = (n: string) => { if (pin.length < 4 && !ok) setPin(p => p + n); };
  const back  = () => setPin(p => p.slice(0, -1));

  return (
    <div style={{
      position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430, height: '100%', zIndex: 50,
      background: C.bg, display: 'flex', flexDirection: 'column',
      animation: 'fade-in .2s',
    }}>
      {/* back */}
      <div style={{ padding: '54px 20px 0' }}>
        <button onClick={onClose} style={{
          width: 36, height: 36, borderRadius: 12, border: 'none',
          background: C.card, cursor: 'pointer', boxShadow: SH.card,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M10 2 L4 7 L10 12" stroke={C.t2} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '28px 28px 48px' }}>
        {/* header */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: '.08em', marginBottom: 6 }}>PARENT</div>
          <h1 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 800, color: C.t1 }}>{title}</h1>
          <div style={{ fontSize: 14, color: C.t2, fontWeight: 600, lineHeight: 1.5 }}>{subtitle}</div>
        </div>

        {/* dots */}
        <div style={{
          display: 'flex', gap: 14, justifyContent: 'center',
          animation: shake ? 'wiggle .45s' : 'none',
        }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              width: 16, height: 16, borderRadius: 99, transition: 'all .15s',
              background: ok ? C.success : pin.length > i ? C.accent : 'transparent',
              border: (pin.length > i || ok) ? '2px solid transparent' : `2px solid ${C.divider}`,
            }}/>
          ))}
        </div>

        {/* keypad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <Key key={n} onTap={() => press(String(n))}>{n}</Key>
          ))}
          <div/>
          <Key onTap={() => press('0')}>0</Key>
          <Key onTap={back} ghost>
            <svg width="22" height="18" viewBox="0 0 24 20">
              <path d="M9 2 H22 a2 2 0 0 1 2 2 V16 a2 2 0 0 1 -2 2 H9 L2 10 z" fill="none" stroke={C.t2} strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M13 7 L19 13 M19 7 L13 13" stroke={C.t2} strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </Key>
        </div>
      </div>
    </div>
  );
}

function Key({ children, onTap, ghost }: { children: React.ReactNode; onTap: () => void; ghost?: boolean }) {
  const [down, setDown] = useState(false);
  return (
    <button
      onClick={onTap}
      onPointerDown={() => setDown(true)}
      onPointerUp={() => setDown(false)}
      onPointerLeave={() => setDown(false)}
      style={{
        height: 62, border: 'none', borderRadius: 16, cursor: 'pointer', fontFamily: 'inherit',
        background: ghost ? 'transparent' : down ? '#EDE9E0' : C.card,
        fontSize: 24, fontWeight: 600, color: C.t1,
        boxShadow: ghost ? 'none' : down ? 'none' : '0 1px 2px rgba(31,26,20,0.04), 0 4px 14px rgba(31,26,20,0.05)',
        transition: 'all .1s',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >{children}</button>
  );
}
