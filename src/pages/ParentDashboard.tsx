import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import PinModal from '../components/PinModal';
import { C, SH } from '../lib/design';

export default function ParentDashboard() {
  const navigate = useNavigate();
  const { currentUser, currentChild, logoutUser, isParentAuthed, setParentAuthed } = useApp();

  if (!currentUser) return null;

  if (!isParentAuthed) {
    return (
      <PinModal
        title="부모 모드"
        subtitle="부모님 PIN을 입력해주세요"
        correctPin={currentUser.parentPin}
        onSuccess={() => setParentAuthed(true)}
        onClose={() => navigate('/home')}
      />
    );
  }

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const menuItems = [
    { icon: '📋', title: '미션 관리', subtitle: '오늘의 미션을 수정해요', path: '/parent/missions' },
    { icon: '🎁', title: '보상 관리', subtitle: '보상 목록을 수정해요', path: '/parent/rewards' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: C.bg }}>
      <div style={{ background: C.soft, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => navigate('/home')}
          style={{ width: 36, height: 36, borderRadius: 12, background: C.card, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SH.card, color: C.t1, fontSize: 20, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
          ‹
        </button>
        <h1 style={{ flex: 1, textAlign: 'center', fontWeight: 900, fontSize: 18, color: C.t1, margin: 0 }}>부모 모드</h1>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {currentChild && (
          <div style={{ background: C.card, borderRadius: 20, padding: 16, boxShadow: SH.card, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: C.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, flexShrink: 0, border: `2px solid ${C.accent}33` }}>
              {currentChild.avatarEmoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 900, color: C.t1, fontSize: 17 }}>{currentChild.name}</div>
              <div style={{ color: C.t2, fontSize: 13, marginTop: 2 }}>⭐ {currentChild.stars}개 · 🎉 {currentChild.stamps.length}개 스탬프</div>
              {currentChild.streak > 0 && (
                <div style={{ color: C.accent, fontSize: 12, fontWeight: 700, marginTop: 2 }}>🔥 {currentChild.streak}일 연속</div>
              )}
            </div>
          </div>
        )}

        <div style={{ fontWeight: 900, color: C.t3, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>관리 메뉴</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {menuItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{ background: C.card, borderRadius: 20, padding: 16, display: 'flex', alignItems: 'center', gap: 14, boxShadow: SH.card, border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: C.soft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 900, color: C.t1, fontSize: 15 }}>{item.title}</div>
                <div style={{ color: C.t2, fontSize: 13, marginTop: 2 }}>{item.subtitle}</div>
              </div>
              <span style={{ color: C.t3, fontSize: 20, fontWeight: 300 }}>›</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleLogout}
          style={{ width: '100%', padding: '14px 0', borderRadius: 16, fontWeight: 700, fontSize: 15, background: '#FFF1F1', color: '#E53535', border: '1.5px solid #FFD0D0', cursor: 'pointer' }}>
          🚪 로그아웃
        </button>
      </div>
    </div>
  );
}
