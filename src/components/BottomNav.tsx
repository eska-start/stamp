import React from 'react';
import { useNavigate } from 'react-router-dom';

type Tab = 'home' | 'stampbook' | 'rewards';

const ITEMS = [
  { key: 'home' as Tab,      label: '홈',     icon: '🏠', path: '/home' },
  { key: 'stampbook' as Tab, label: '스탬프북', icon: '📖', path: '/stampbook' },
  { key: 'rewards' as Tab,   label: '보상',    icon: '🎁', path: '/rewards' },
];

export default function BottomNav({ active }: { active: Tab }) {
  const navigate = useNavigate();
  return (
    <div className="fixed bottom-0 z-40" style={{ left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430 }}>
      <div className="mx-3 mb-3 rounded-3xl px-2 py-2 flex shadow-2xl"
        style={{ background: 'white', border: '1px solid #EDE9FE', boxShadow: '0 8px 32px rgba(109,40,217,0.15)' }}>
        {ITEMS.map(item => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className="flex-1 flex flex-col items-center py-2 rounded-2xl transition-all"
              style={{ background: isActive ? 'linear-gradient(135deg, #6D28D9, #4F46E5)' : 'transparent' }}>
              <div className="text-xl">{item.icon}</div>
              <div className="text-xs font-black mt-0.5" style={{ color: isActive ? 'white' : '#9CA3AF' }}>{item.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
