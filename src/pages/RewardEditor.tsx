import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Reward } from '../types';
import { C, SH } from '../lib/design';

const EMOJIS = ['🦕', '📓', '🖍️', '⭐', '🎮', '🏆', '🎠', '🍭', '🎪', '🌈', '🎸', '🎨', '🎡', '🐈', '💨', '🦄'];

export default function RewardEditor() {
  const navigate = useNavigate();
  const { currentUser, updateRewards } = useApp();
  const [rewards, setRewards] = useState<Reward[]>(
    currentUser?.rewards ? [...currentUser.rewards] : []
  );
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCost, setNewCost] = useState('10');
  const [newEmoji, setNewEmoji] = useState('🎁');
  const [saved, setSaved] = useState(false);

  const handleAdd = () => {
    if (!newName.trim()) return;
    setRewards([...rewards, {
      id: Date.now().toString(),
      name: newName.trim(),
      description: newDesc.trim(),
      cost: Math.max(1, parseInt(newCost) || 10),
      emoji: newEmoji,
      available: true,
    }]);
    setNewName('');
    setNewDesc('');
    setNewCost('10');
  };

  const handleToggle = (id: string) =>
    setRewards(rewards.map(r => r.id === id ? { ...r, available: !r.available } : r));

  const handleRemove = (id: string) => setRewards(rewards.filter(r => r.id !== id));

  const handleSave = () => {
    updateRewards(rewards);
    setSaved(true);
    setTimeout(() => navigate('/parent'), 900);
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 32, background: C.bg }}>
      {/* Header */}
      <div style={{ background: C.soft, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => navigate('/parent')}
          style={{ width: 36, height: 36, borderRadius: 12, background: C.card, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SH.card, color: C.t1, fontSize: 20, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
          ‹
        </button>
        <h1 style={{ flex: 1, textAlign: 'center', fontWeight: 900, fontSize: 18, color: C.t1, margin: 0 }}>보상 관리</h1>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Current rewards */}
        <div style={{ background: C.card, borderRadius: 20, padding: 16, boxShadow: SH.card }}>
          <div style={{ fontWeight: 900, color: C.t1, marginBottom: 12, fontSize: 15 }}>현재 보상 목록</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {rewards.map(r => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 14, background: r.available ? C.soft : C.divider + '44' }}>
                <span style={{ fontSize: 26 }}>{r.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: r.available ? C.t1 : C.t3, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</div>
                  <div style={{ color: C.accent, fontSize: 12, fontWeight: 700 }}>⭐ {r.cost}</div>
                </div>
                <button
                  onClick={() => handleToggle(r.id)}
                  style={{
                    fontSize: 12,
                    padding: '4px 10px',
                    borderRadius: 8,
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    background: r.available ? C.successSoft : C.divider,
                    color: r.available ? C.success : C.t3,
                  }}>
                  {r.available ? '활성' : '비활성'}
                </button>
                <button
                  onClick={() => handleRemove(r.id)}
                  style={{ width: 28, height: 28, borderRadius: 8, background: '#FFE5E5', color: '#E53535', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                  ✕
                </button>
              </div>
            ))}
            {rewards.length === 0 && (
              <div style={{ textAlign: 'center', color: C.t3, padding: '16px 0', fontSize: 14 }}>보상이 없습니다. 아래에서 추가해주세요!</div>
            )}
          </div>
        </div>

        {/* Add new reward */}
        <div style={{ background: C.card, borderRadius: 20, padding: 16, boxShadow: SH.card }}>
          <div style={{ fontWeight: 900, color: C.t1, marginBottom: 12, fontSize: 15 }}>보상 추가</div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: C.t2, fontSize: 13, marginBottom: 8, fontWeight: 600 }}>이모지 선택</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 6 }}>
              {EMOJIS.map(e => (
                <button
                  key={e}
                  onClick={() => setNewEmoji(e)}
                  style={{
                    aspectRatio: '1',
                    borderRadius: 10,
                    fontSize: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: newEmoji === e ? C.accentSoft : C.soft,
                    border: newEmoji === e ? `2px solid ${C.accent}` : '2px solid transparent',
                    cursor: 'pointer',
                  }}>
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              type="text"
              placeholder="보상 이름"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              style={{ background: C.soft, borderRadius: 12, padding: '10px 14px', border: `1.5px solid ${C.divider}`, outline: 'none', color: C.t1, fontSize: 14 }}
            />
            <input
              type="text"
              placeholder="설명 (선택)"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              style={{ background: C.soft, borderRadius: 12, padding: '10px 14px', border: `1.5px solid ${C.divider}`, outline: 'none', color: C.t1, fontSize: 14 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: C.t2, fontSize: 14, whiteSpace: 'nowrap' }}>⭐ 필요 별:</span>
              <input
                type="number"
                value={newCost}
                onChange={e => setNewCost(e.target.value)}
                min="1"
                style={{ flex: 1, background: C.soft, borderRadius: 12, padding: '10px 14px', border: `1.5px solid ${C.divider}`, outline: 'none', color: C.t1, fontSize: 14 }}
              />
            </div>
            <button
              onClick={handleAdd}
              style={{ padding: '12px 0', borderRadius: 12, background: C.accent, color: '#fff', fontWeight: 900, fontSize: 14, border: 'none', cursor: 'pointer', boxShadow: SH.btn }}>
              추가하기
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          style={{
            width: '100%',
            padding: '15px 0',
            borderRadius: 16,
            fontWeight: 900,
            fontSize: 16,
            border: 'none',
            cursor: 'pointer',
            background: saved ? C.success : C.accent,
            color: '#fff',
            boxShadow: saved ? 'none' : SH.btn,
            transition: 'background 0.3s',
          }}>
          {saved ? '✓ 저장됨!' : '저장하기'}
        </button>
      </div>
    </div>
  );
}
