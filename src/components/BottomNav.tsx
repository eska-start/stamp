import React from 'react';
import { useNavigate } from 'react-router-dom';
import { C, SH } from '../lib/design';

type Tab = 'home' | 'stampbook' | 'rewards';

function HomeIcon({ c }: { c: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11 L12 4 L20 11 V20 a1 1 0 0 1 -1 1 H5 a1 1 0 0 1 -1 -1 z"/>
      <path d="M10 21 v-6 h4 v6"/>
    </svg>
  );
}
function BookIcon({ c }: { c: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5 a2 2 0 0 1 2 -2 h12 a2 2 0 0 1 2 2 v14 a2 2 0 0 1 -2 2 H6 a2 2 0 0 1 -2 -2 z"/>
      <line x1="9" y1="3" x2="9" y2="21"/>
    </svg>
  );
}
function GiftIcon({ c }: { c: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12"/>
      <rect x="2" y="7" width="20" height="5"/>
      <line x1="12" y1="22" x2="12" y2="7"/>
      <path d="M12 7 H7.5 a2.5 2.5 0 0 1 0 -5 C11 2 12 7 12 7 z"/>
      <path d="M12 7 H16.5 a2.5 2.5 0 0 0 0 -5 C13 2 12 7 12 7 z"/>
    </svg>
  );
}

const ITEMS: { key: Tab; label: string; Icon: React.FC<{ c: string }>; path: string }[] = [
  { key: 'home',      label: '홈',      Icon: HomeIcon, path: '/home' },
  { key: 'stampbook', label: '스탬프북', Icon: BookIcon, path: '/stampbook' },
  { key: 'rewards',   label: '보상',    Icon: GiftIcon, path: '/rewards' },
];

export default function BottomNav({ active }: { active: Tab }) {
  const navigate = useNavigate();
  return (
    <div style={{
      position: 'fixed', bottom: 0, zIndex: 40,
      left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      paddingBottom: 24, paddingTop: 8,
      background: 'linear-gradient(180deg, rgba(246,243,236,0) 0%, rgba(246,243,236,1) 36%)',
    }}>
      <div style={{
        margin: '0 14px', background: C.card, borderRadius: 24, padding: 6,
        boxShadow: '0 4px 24px rgba(31,26,20,0.10), 0 1px 4px rgba(31,26,20,0.06)',
        display: 'flex', gap: 4,
      }}>
        {ITEMS.map(({ key, label, Icon, path }) => {
          const on = active === key;
          return (
            <button
              key={key}
              onClick={() => navigate(path)}
              style={{
                flex: 1, border: 'none', cursor: 'pointer',
                background: on ? C.accent : 'transparent',
                borderRadius: 18, padding: '10px 0',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                transition: 'all .18s', fontFamily: 'inherit',
              }}
            >
              <Icon c={on ? '#fff' : C.t3} />
              <span style={{ fontSize: 11, fontWeight: 700, color: on ? '#fff' : C.t3 }}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
