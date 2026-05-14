import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { DailyMissionTemplate } from '../types';
import { C, SH } from '../lib/design';

const ICONS = ['🪷', '📚', '🧺', '🏃', '🎨', '🍳', '💤', '🧹', '🌿', '🧘', '✏️', '🎵', '🙏', '🤗', '💕', '🍼'];

export default function MissionEditor() {
  const navigate = useNavigate();
  const { currentUser, updateMissionTemplates } = useApp();
  const [templates, setTemplates] = useState<DailyMissionTemplate[]>(currentUser?.missionTemplates ? [...currentUser.missionTemplates] : []);
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
    <div style={{ minHeight: '100vh', paddingBottom: 32, background: C.bg, overflowX: 'hidden' }}>
      <div style={{ background: C.soft, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('/parent')} style={{ width: 36, height: 36, borderRadius: 12, background: C.card, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SH.card, color: C.t1, fontSize: 20, fontWeight: 700, border: 'none', cursor: 'pointer', flexShrink: 0 }}>‹</button>
        <h1 style={{ flex: 1, textAlign: 'center', fontWeight: 900, fontSize: 18, color: C.t1, margin: 0 }}>미션 관리</h1>
        <div style={{ width: 36, flexShrink: 0 }} />
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: C.card, borderRadius: 20, padding: 16, boxShadow: SH.card, boxSizing: 'border-box' }}>
          <div style={{ fontWeight: 900, color: C.t1, marginBottom: 12, fontSize: 15 }}>현재 미션 목록</div>
          {templates.length === 0 && <div style={{ textAlign: 'center', color: C.t3, padding: '16px 0', fontSize: 14 }}>미션이 없습니다. 아래에서 추가해주세요!</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {templates.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 14, background: C.soft, minWidth: 0 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{t.icon}</span>
                <span style={{ flex: 1, minWidth: 0, fontWeight: 700, color: C.t1, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</span>
                <button onClick={() => handleRemove(t.id)} style={{ width: 28, height: 28, borderRadius: 8, background: '#FFE5E5', color: '#E53535', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>✕</button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: C.card, borderRadius: 20, padding: 16, boxShadow: SH.card, boxSizing: 'border-box' }}>
          <div style={{ fontWeight: 900, color: C.t1, marginBottom: 12, fontSize: 15 }}>미션 추가</div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: C.t2, fontSize: 13, marginBottom: 8, fontWeight: 600 }}>아이콘 선택</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, minmax(0, 1fr))', gap: 6 }}>
              {ICONS.map(icon => (
                <button key={icon} onClick={() => setNewIcon(icon)} style={{ aspectRatio: '1', minWidth: 0, borderRadius: 10, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', background: newIcon === icon ? C.accentSoft : C.soft, border: newIcon === icon ? `2px solid ${C.accent}` : '2px solid transparent', cursor: 'pointer', transition: 'all 0.15s', padding: 0 }}>{icon}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input type="text" placeholder="미션 이름 입력" value={newTitle} onChange={e => setNewTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} style={{ width: '100%', boxSizing: 'border-box', background: C.soft, borderRadius: 12, padding: '12px 14px', border: `1.5px solid ${C.divider}`, outline: 'none', color: C.t1, fontSize: 14 }} />
            <button onClick={handleAdd} style={{ width: '100%', padding: '12px 0', borderRadius: 12, background: C.accent, color: '#fff', fontWeight: 900, fontSize: 14, border: 'none', cursor: 'pointer', boxShadow: SH.btn }}>추가</button>
          </div>
        </div>

        <button onClick={handleSave} style={{ width: '100%', padding: '15px 0', borderRadius: 16, fontWeight: 900, fontSize: 16, border: 'none', cursor: 'pointer', background: saved ? C.success : C.accent, color: '#fff', boxShadow: saved ? 'none' : SH.btn, transition: 'background 0.3s' }}>{saved ? '✓ 저장됨!' : '저장하기'}</button>
      </div>
    </div>
  );
}
