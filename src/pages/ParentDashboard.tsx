import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import PinModal from '../components/PinModal';

export default function ParentDashboard() {
  const navigate = useNavigate();
  const { currentUser, currentChild, logoutUser } = useApp();
  const [authed, setAuthed] = useState(false);

  if (!currentUser) return null;

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFF8F0' }}>
        <button onClick={() => navigate('/home')}
          className="absolute top-6 left-6 text-purple-600 font-black text-lg">‹ 뒤로</button>
        <PinModal
          title="부모 모드"
          subtitle="부모님 PIN을 입력해주세요"
          correctPin={currentUser.parentPin}
          onSuccess={() => setAuthed(true)}
          onClose={() => navigate('/home')}
        />
      </div>
    );
  }

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div className="min-h-screen" style={{ background: '#FFF8F0' }}>
      <div className="px-4 py-4 flex items-center"
        style={{ background: 'linear-gradient(135deg, #9B7FD4 0%, #6D4EC4 100%)' }}>
        <button onClick={() => navigate('/home')} className="text-white text-2xl mr-3">‹</button>
        <h1 className="text-white font-black text-xl flex-1 text-center">👨‍👩‍👧 부모 모드</h1>
        <div className="w-7" />
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Child card */}
        {currentChild && (
          <div className="bg-white rounded-3xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-md"
                style={{ background: 'linear-gradient(135deg, #FFE082 0%, #FFB300 100%)', fontSize: 32, minWidth: 56 }}>
                {currentChild.avatarEmoji}
              </div>
              <div className="flex-1">
                <div className="font-black text-gray-800 text-lg">{currentChild.name}</div>
                <div className="text-gray-500 text-sm">⭐ {currentChild.stars}개 · 🎉 {currentChild.stamps.length}개 스탬프</div>
                {currentChild.streak > 0 && (
                  <div className="text-orange-500 text-xs font-bold">🔥 {currentChild.streak}일 연속</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Menu */}
        <div className="space-y-3">
          <h2 className="font-black text-gray-600 text-sm uppercase tracking-wide">관리 메뉴</h2>
          {[
            { icon: '📋', title: '미션 관리', subtitle: '오늘의 미션을 수정해요', path: '/parent/missions', color: '#EDE7F6' },
            { icon: '🎁', title: '보상 관리', subtitle: '보상 목록을 수정해요', path: '/parent/rewards', color: '#FFFBF0' },
          ].map(item => (
            <button key={item.path} onClick={() => navigate(item.path)}
              className="w-full rounded-3xl p-4 flex items-center gap-4 shadow-sm active:scale-95 transition-transform text-left"
              style={{ background: item.color }}>
              <div className="text-3xl">{item.icon}</div>
              <div className="flex-1">
                <div className="font-black text-gray-800">{item.title}</div>
                <div className="text-gray-500 text-sm">{item.subtitle}</div>
              </div>
              <span className="text-gray-400 text-lg">›</span>
            </button>
          ))}
        </div>

        {/* Exchange history */}
        {currentUser.rewardExchanges.length > 0 && (
          <div>
            <h2 className="font-black text-gray-600 text-sm uppercase tracking-wide mb-2">교환 내역</h2>
            <div className="space-y-2">
              {[...currentUser.rewardExchanges].reverse().slice(0, 5).map(ex => (
                <div key={ex.id} className="bg-white rounded-2xl p-3 flex items-center gap-3 shadow-sm">
                  <span className="text-xl">🎁</span>
                  <div className="flex-1">
                    <div className="font-bold text-gray-700 text-sm">{ex.rewardName}</div>
                    <div className="text-gray-400 text-xs">{new Date(ex.exchangedAt).toLocaleDateString('ko-KR')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2">
          <button onClick={handleLogout}
            className="w-full py-3.5 rounded-2xl font-bold text-red-500 bg-red-50 border border-red-200 active:scale-95 transition-transform">
            🚪 로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
