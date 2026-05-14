import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { DailyMissionTemplate } from '../types';

const ICONS = ['🪷', '📚', '🧺', '🏃', '🎨', '🍳', '💤', '🧹', '🌿', '🧘', '✏️', '🎵', '🙏', '🤗', '💕', '🍼'];

export default function MissionEditor() {
  const navigate = useNavigate();
  const { currentUser, updateMissionTemplates } = useApp();
  const [templates, setTemplates] = useState<DailyMissionTemplate[]>(
    currentUser?.missionTemplates ? [...currentUser.missionTemplates] : []
  );
  const [newTitle, setNewTitle] = useState('');
  const [newIcon, setNewIcon] = useState('📋');
  const [saved, setSaved] = useState(false);

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    setTemplates([...templates, { id: Date.now().toString(), title: newTitle.trim(), icon: newIcon, target: 1 }]);
    setNewTitle('');
  };

  const handleRemove = (id: string) => setTemplates(templates.filter(t => t.id !== id));

  const handleSave = () => {
    updateMissionTemplates(templates);
    setSaved(true);
    setTimeout(() => navigate('/parent'), 900);
  };

  return (
    <div className="min-h-screen pb-6" style={{ background: '#FFF8F0' }}>
      <div className="px-4 py-4 flex items-center"
        style={{ background: 'linear-gradient(135deg, #B39DDB 0%, #7E57C2 100%)' }}>
        <button onClick={() => navigate('/parent')} className="text-white text-2xl mr-3">‹</button>
        <h1 className="text-white font-black text-xl flex-1 text-center">미션 관리</h1>
        <div className="w-7" />
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Current missions */}
        <div className="bg-white rounded-3xl p-4 shadow-sm">
          <h2 className="font-black text-gray-700 mb-3">현재 미션 목록</h2>
          {templates.length === 0 && (
            <div className="text-center text-gray-400 py-4">미션이 없습니다. 아래에서 추가해주세요!</div>
          )}
          <div className="space-y-2">
            {templates.map(t => (
              <div key={t.id} className="flex items-center gap-3 p-3 rounded-2xl"
                style={{ background: '#F5F0FF' }}>
                <span className="text-2xl">{t.icon}</span>
                <span className="flex-1 font-bold text-gray-700">{t.title}</span>
                <button onClick={() => handleRemove(t.id)} className="text-red-400 text-xl w-7 h-7 flex items-center justify-center">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* Add new mission */}
        <div className="bg-white rounded-3xl p-4 shadow-sm">
          <h2 className="font-black text-gray-700 mb-3">미션 추가</h2>
          <div className="mb-3">
            <label className="text-gray-500 text-sm mb-2 block">아이콘 선택</label>
            <div className="grid grid-cols-8 gap-1.5">
              {ICONS.map(icon => (
                <button key={icon} onClick={() => setNewIcon(icon)}
                  className="aspect-square rounded-xl text-xl flex items-center justify-center transition-all"
                  style={{
                    background: newIcon === icon ? '#E8E0FF' : '#F5F5F5',
                    border: newIcon === icon ? '2px solid #9B7FD4' : '2px solid transparent',
                  }}>
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="미션 이름 입력"
              className="flex-1 bg-gray-50 rounded-xl px-3 py-2.5 outline-none border border-gray-200 text-gray-700"
              value={newTitle} onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
            <button onClick={handleAdd}
              className="px-5 py-2.5 rounded-xl text-white font-black"
              style={{ background: 'linear-gradient(135deg, #9B7FD4 0%, #6D4EC4 100%)' }}>
              추가
            </button>
          </div>
        </div>

        <button onClick={handleSave}
          className="w-full py-4 rounded-2xl font-black text-lg shadow-md transition-all"
          style={{ background: saved ? '#40C057' : 'linear-gradient(135deg, #9B7FD4 0%, #6D4EC4 100%)', color: 'white' }}>
          {saved ? '✓ 저장됨!' : '저장하기'}
        </button>
      </div>
    </div>
  );
}
