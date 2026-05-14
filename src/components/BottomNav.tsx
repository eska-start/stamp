import React from 'react';
import { useNavigate } from 'react-router-dom';

type Tab = 'home' | 'stampbook' | 'rewards';

const ITEMS = [
  { key: 'home' as Tab, label: '홈', icon: '🏠', path: '/home' },
  { key: 'stampbook' as Tab, label: '스탬프북', icon: '📖', path: '/stampbook' },
  { key: 'rewards' as Tab, label: '보상', icon: '🎁', path: '/rewards' },
];

export default function BottomNav({ active }: { active: Tab }) {
  const navigate = useNavigate();
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40" style={{ maxWidth: 430, margin: '0 auto', left: '50%', transform: 'translateX(-50%)' }}>
      <div className="bg-white border-t border-gray-100 flex shadow-lg">
        {ITEMS.map(item => (
          <button
            key={item.key}
            onClick={() => navigate(item.path)}
            className="flex-1 py-3 flex flex-col items-center gap-0.5"
          >
            <div className={`text-2xl transition-transform ${active === item.key ? 'scale-110' : 'opacity-50'}`}>{item.icon}</div>
            <div className={`text-xs font-bold ${active === item.key ? 'text-purple-600' : 'text-gray-400'}`}>{item.label}</div>
            {active === item.key && <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />}
          </button>
        ))}
      </div>
    </div>
  );
}
