import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Child } from '../types';
import { useApp } from '../contexts/AppContext';

const AVATARS = ['🦕', '🐸', '🐼', '🐨', '🦊', '🐰', '🐶', '🐱', '🐻', '🐧', '🦄', '🐥'];

export default function ChildRegisterPage() {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🦕');
  const [error, setError] = useState('');
  const { addChild } = useApp();
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!name.trim()) { setError('아이 이름을 입력해주세요.'); return; }
    const child: Child = {
      id: Date.now().toString(), name: name.trim(), avatarEmoji: avatar,
      stars: 0, stamps: [], streak: 0, lastCompletedDate: '',
    };
    addChild(child);
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col py-8 px-6"
      style={{ background: 'linear-gradient(180deg, #FFF8F0 0%, #FFE8D0 100%)' }}>
      <div className="text-center mb-8">
        <div className="text-7xl mb-3 float-anim">{avatar}</div>
        <h1 className="text-3xl font-black text-purple-700">아이 등록</h1>
        <p className="text-gray-500 text-sm mt-2">스탬프북의 주인공을 등록해요!</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-gray-600 font-bold text-sm mb-2 block">철릭하는 캐릭터 선택 👀</label>
          <div className="grid grid-cols-4 gap-3">
            {AVATARS.map(a => (
              <button key={a} onClick={() => setAvatar(a)}
                className="aspect-square rounded-2xl text-4xl flex items-center justify-center transition-all active:scale-90"
                style={{
                  background: avatar === a ? '#E8E0FF' : 'white',
                  border: avatar === a ? '3px solid #9B7FD4' : '2px solid #E5E5E5',
                  transform: avatar === a ? 'scale(1.08)' : 'scale(1)',
                  boxShadow: avatar === a ? '0 4px 12px rgba(155,127,212,0.3)' : '0 1px 3px rgba(0,0,0,0.08)',
                }}>
                {a}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-gray-600 font-bold text-sm mb-1 block">아이 이름</label>
          <div className="flex items-center bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-gray-100">
            <span className="text-gray-400 mr-3">✏️</span>
            <input type="text" placeholder="아이의 이름을 입력해주세요"
              className="flex-1 outline-none text-gray-700"
              value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRegister()}
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button onClick={handleRegister}
          className="w-full py-4 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, #FFD740 0%, #FF8F00 100%)', color: '#5D3A00' }}>
          스탬프북 시작하기! 🎉
        </button>
      </div>
    </div>
  );
}
