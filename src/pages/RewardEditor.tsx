import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Reward } from '../types';

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
      id: Date.now().toString(), name: newName.trim(),
      description: newDesc.trim(), cost: Math.max(1, parseInt(newCost) || 10),
      emoji: newEmoji, available: true,
    }]);
    setNewName(''); setNewDesc(''); setNewCost('10');
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
    <div className="min-h-screen pb-6" style={{ background: '#FFF8F0' }}>
      <div className="px-4 py-4 flex items-center"
        style={{ background: 'linear-gradient(135deg, #FFD740 0%, #FFA000 100%)' }}>
        <button onClick={() => navigate('/parent')} className="text-amber-900 text-2xl mr-3">‹</button>
        <h1 className="text-amber-900 font-black text-xl flex-1 text-center">보상 관리</h1>
        <div className="w-7" />
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Current rewards */}
        <div className="bg-white rounded-3xl p-4 shadow-sm">
          <h2 className="font-black text-gray-700 mb-3">현재 보상 목록</h2>
          <div className="space-y-2">
            {rewards.map(r => (
              <div key={r.id} className="flex items-center gap-3 p-3 rounded-2xl"
                style={{ background: r.available ? '#FFFBF0' : '#F5F5F5' }}>
                <span style={{ fontSize: 28 }}>{r.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-700 text-sm truncate">{r.name}</div>
                  <div className="text-yellow-500 text-xs font-bold">⭐ {r.cost}</div>
                </div>
                <button onClick={() => handleToggle(r.id)}
                  className="text-xs px-2.5 py-1 rounded-lg font-bold"
                  style={{
                    background: r.available ? '#E8F5E9' : '#EEEEEE',
                    color: r.available ? '#2E7D32' : '#9E9E9E',
                  }}>
                  {r.available ? '활성' : '비활성'}
                </button>
                <button onClick={() => handleRemove(r.id)} className="text-red-400 text-lg w-7 h-7 flex items-center justify-center">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* Add new */}
        <div className="bg-white rounded-3xl p-4 shadow-sm">
          <h2 className="font-black text-gray-700 mb-3">보상 추가</h2>
          <div className="mb-3">
            <label className="text-gray-500 text-sm mb-2 block">이모지 선택</label>
            <div className="grid grid-cols-8 gap-1.5">
              {EMOJIS.map(e => (
                <button key={e} onClick={() => setNewEmoji(e)}
                  className="aspect-square rounded-xl text-xl flex items-center justify-center"
                  style={{
                    background: newEmoji === e ? '#FFF8E0' : '#F5F5F5',
                    border: newEmoji === e ? '2px solid #FFB300' : '2px solid transparent',
                  }}>
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <input type="text" placeholder="보상 이름" value={newName} onChange={e => setNewName(e.target.value)}
              className="w-full bg-gray-50 rounded-xl px-3 py-2.5 outline-none border border-gray-200 text-gray-700" />
            <input type="text" placeholder="설명 (선택)" value={newDesc} onChange={e => setNewDesc(e.target.value)}
              className="w-full bg-gray-50 rounded-xl px-3 py-2.5 outline-none border border-gray-200 text-gray-700" />
            <div className="flex items-center gap-3">
              <label className="text-gray-500 text-sm whitespace-nowrap">⭐ 필요 별:</label>
              <input type="number" value={newCost} onChange={e => setNewCost(e.target.value)} min="1"
                className="flex-1 bg-gray-50 rounded-xl px-3 py-2.5 outline-none border border-gray-200 text-gray-700" />
            </div>
            <button onClick={handleAdd}
              className="w-full py-3 rounded-xl font-black"
              style={{ background: 'linear-gradient(135deg, #FFD740 0%, #FFA000 100%)', color: '#5D3A00' }}>
              추가하기
            </button>
          </div>
        </div>

        <button onClick={handleSave}
          className="w-full py-4 rounded-2xl font-black text-lg shadow-md"
          style={{ background: saved ? '#40C057' : 'linear-gradient(135deg, #FFD740 0%, #FFA000 100%)', color: saved ? 'white' : '#5D3A00' }}>
          {saved ? '✓ 저장됨!' : '저장하기'}
        </button>
      </div>
    </div>
  );
}
