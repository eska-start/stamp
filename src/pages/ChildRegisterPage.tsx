import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Child } from '../types';
import { useApp } from '../contexts/AppContext';
import { C, SH } from '../lib/design';

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
      id: Date.now().toString(),
      name: name.trim(),
      avatarEmoji: avatar,
      stars: 0,
      stamps: [],
      streak: 0,
      lastCompletedDate: '',
    };
    addChild(child);
    navigate('/home');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '32px 24px', background: C.bg }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div className="float-anim" style={{ fontSize: 72, marginBottom: 12 }}>{avatar}</div>
        <h1 style={{ fontWeight: 900, fontSize: 28, color: C.t1, margin: 0 }}>아이 등록</h1>
        <p style={{ color: C.t2, fontSize: 14, marginTop: 8 }}>스탬프북의 주인공을 등록해요!</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Avatar picker */}
        <div>
          <div style={{ fontWeight: 700, color: C.t2, fontSize: 13, marginBottom: 10 }}>좋아하는 캐릭터 선택 👀</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {AVATARS.map(a => (
              <button
                key={a}
                onClick={() => setAvatar(a)}
                style={{
                  aspectRatio: '1',
                  borderRadius: 18,
                  fontSize: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: avatar === a ? C.accentSoft : C.card,
                  border: avatar === a ? `3px solid ${C.accent}` : `2px solid ${C.divider}`,
                  transform: avatar === a ? 'scale(1.08)' : 'scale(1)',
                  boxShadow: avatar === a ? SH.btn : SH.card,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}>
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Name input */}
        <div>
          <div style={{ fontWeight: 700, color: C.t2, fontSize: 13, marginBottom: 6 }}>아이 이름</div>
          <div style={{ display: 'flex', alignItems: 'center', background: C.soft, borderRadius: 16, padding: '14px 16px', border: `1.5px solid ${C.divider}`, gap: 10 }}>
            <span style={{ fontSize: 18 }}>✏️</span>
            <input
              type="text"
              placeholder="아이의 이름을 입력해주세요"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRegister()}
              style={{ flex: 1, outline: 'none', background: 'transparent', border: 'none', color: C.t1, fontSize: 15 }}
            />
          </div>
        </div>

        {error && (
          <div style={{ color: '#E53535', fontSize: 13, textAlign: 'center', padding: '6px 12px', background: '#FFF1F1', borderRadius: 10 }}>{error}</div>
        )}

        <button
          onClick={handleRegister}
          style={{
            width: '100%',
            padding: '16px 0',
            borderRadius: 16,
            fontWeight: 900,
            fontSize: 17,
            border: 'none',
            cursor: 'pointer',
            background: C.accent,
            color: '#fff',
            boxShadow: SH.btn,
          }}>
          스탬프북 시작하기! 🎉
        </button>
      </div>
    </div>
  );
}
