import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';
import PinModal from '../components/PinModal';
import StampAnimation from '../components/StampAnimation';
import { StampType } from '../types';

const STAMP_TYPES: { type: StampType; label: string; color: string; emoji: string }[] = [
  { type: 'good',    label: 'GOOD!',    color: '#FF6B6B', emoji: '⭐' },
  { type: 'nice',    label: 'NICE!',    color: '#FFB800', emoji: '☀️' },
  { type: 'great',   label: 'GREAT!',   color: '#40C057', emoji: '🦕' },
  { type: 'wow',     label: 'WOW!',     color: '#845EF7', emoji: '👑' },
  { type: 'perfect', label: 'PERFECT!', color: '#339AF0', emoji: '💎' },
];

const STAMP_BG: Record<StampType, string> = {
  good: '#FFF0F0', nice: '#FFFBF0', great: '#F0FFF4', wow: '#F5F0FF', perfect: '#F0F8FF',
};

export default function HomePage() {
  const { currentUser, currentChild, getTodayMissions, completeMission, giveStamp } = useApp();
  const navigate = useNavigate();
  const [missionPinTarget, setMissionPinTarget] = useState<string | null>(null);
  const [showStampPin, setShowStampPin] = useState(false);
  const [showStampPicker, setShowStampPicker] = useState(false);
  const [stampAnim, setStampAnim] = useState<StampType | null>(null);

  if (!currentUser || !currentChild) return null;

  const missions = getTodayMissions();
  const completedCount = missions.filter(m => m.completed >= m.target).length;
  const recentStamps = [...currentChild.stamps].reverse().slice(0, 9);

  const handleMissionPinSuccess = () => {
    if (missionPinTarget) completeMission(missionPinTarget);
    setMissionPinTarget(null);
  };

  const handleStampPinSuccess = () => {
    setShowStampPin(false);
    setShowStampPicker(true);
  };

  const handlePickStamp = (type: StampType) => {
    setShowStampPicker(false);
    giveStamp(currentChild.id, type);
    setStampAnim(type);
  };

  return (
    <div className="min-h-screen flex flex-col pb-24" style={{ background: '#FFF8F0' }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md"
              style={{ background: 'linear-gradient(135deg, #FFE082 0%, #FFB300 100%)', width: 48, height: 48, minWidth: 48 }}>
              {currentChild.avatarEmoji}
            </div>
            <div>
              <div className="font-black text-gray-800 text-lg leading-tight">{currentChild.name}</div>
              {currentChild.streak > 0 && (
                <div className="text-xs text-orange-500 font-bold">🔥 {currentChild.streak}일 연속 성공!</div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white rounded-full px-3 py-1.5 shadow-sm border border-gray-100">
              <span className="text-lg">⭐</span>
              <span className="font-black text-gray-800 text-base">{currentChild.stars}</span>
            </div>
            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-lg">
              🔔
            </div>
          </div>
        </div>
      </div>

      {/* Today's Missions */}
      <div className="px-4 py-1">
        <div className="rounded-3xl p-4 shadow-md" style={{ background: 'linear-gradient(135deg, #B39DDB 0%, #7E57C2 100%)' }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-white font-black text-lg">오늘의 미션</span>
            <span className="text-purple-200 text-sm font-bold">{completedCount}/{missions.length} 완료 ›</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {missions.map(m => (
              <button key={m.id}
                onClick={() => m.completed < m.target && setMissionPinTarget(m.id)}
                className="bg-white rounded-2xl p-3 flex flex-col items-center shadow-sm active:scale-95 transition-transform relative">
                <div className="text-3xl mb-1">{m.icon}</div>
                <div className="text-gray-700 text-xs font-bold text-center leading-tight">{m.title}</div>
                <div className="mt-1.5">
                  {m.completed >= m.target
                    ? <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black"
                        style={{ background: '#7E57C2' }}>✓</div>
                    : <div className="text-gray-400 text-xs">{m.completed}/{m.target}</div>
                  }
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stamp Book Preview */}
      <div className="px-4 py-3">
        <div className="rounded-3xl overflow-hidden shadow-md relative"
          style={{ background: '#F5E6D0', border: '3px solid #C4A882' }}>
          <div className="flex justify-around px-4 pt-2 pb-1">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="w-4 h-4 rounded-full shadow-inner"
                style={{ background: 'linear-gradient(135deg, #D4A017 0%, #8B6914 100%)' }} />
            ))}
          </div>
          <div className="px-4 pb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600 font-medium text-sm">—</span>
              <span className="font-black text-gray-700 text-base">나의 스탬프북</span>
              <button onClick={() => navigate('/stampbook')} className="text-gray-500 text-sm font-medium">전체보기 ›</button>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {[...Array(9)].map((_, i) => {
                const stamp = recentStamps[i];
                const stype = STAMP_TYPES.find(s => s.type === stamp?.type);
                return (
                  <div key={i} className="aspect-square rounded-full flex flex-col items-center justify-center"
                    style={{
                      background: stype ? STAMP_BG[stamp.type] : '#E8D5B7',
                      border: stype ? `3px solid ${stype.color}` : '2px dashed #C4A882',
                    }}>
                    {stype ? (
                      <>
                        <div style={{ fontSize: 24 }}>{stype.emoji}</div>
                        <div className="font-black" style={{ color: stype.color, fontSize: 9 }}>{stype.label}</div>
                      </>
                    ) : (
                      <div className="w-5 h-5 rounded-full" style={{ background: '#C4A882', opacity: 0.3 }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="absolute right-3 top-16 text-xl float-anim">⭐</div>
        </div>
      </div>

      {/* Give Stamp CTA */}
      <div className="px-4 py-1">
        <button onClick={() => setShowStampPin(true)}
          className="w-full rounded-2xl p-4 flex items-center gap-3 shadow-md active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, #FFD740 0%, #FFA000 100%)' }}>
          <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm">📦</div>
          <div className="flex-1 text-left">
            <div className="font-black text-amber-900 text-base">도장 요청하기</div>
            <div className="text-amber-700 text-xs">부모님께 도장을 요청해보세요!</div>
          </div>
          <span className="text-amber-800 text-xl font-black">›</span>
        </button>
      </div>

      {/* Parent Mode */}
      <div className="px-4 py-1">
        <button onClick={() => navigate('/parent')}
          className="w-full rounded-2xl p-3.5 flex items-center gap-3 bg-white shadow-sm border border-gray-100 active:scale-95 transition-transform">
          <span className="text-xl">👨‍👩‍👧</span>
          <span className="font-bold text-gray-600 text-sm">부모 모드</span>
          <span className="text-gray-400 text-sm ml-auto">›</span>
        </button>
      </div>

      {/* Modals */}
      {missionPinTarget && (
        <PinModal
          title="미션 완료 확인"
          subtitle="부모님 PIN을 입력해주세요"
          correctPin={currentUser.parentPin}
          onSuccess={handleMissionPinSuccess}
          onClose={() => setMissionPinTarget(null)}
        />
      )}

      {showStampPin && (
        <PinModal
          title="도장 주기"
          subtitle="부모님 PIN을 입력해 도장을 주세요"
          correctPin={currentUser.parentPin}
          onSuccess={handleStampPinSuccess}
          onClose={() => setShowStampPin(false)}
        />
      )}

      {showStampPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
          onClick={() => setShowStampPicker(false)}>
          <div className="bg-white w-full rounded-t-3xl p-6 pb-8" onClick={e => e.stopPropagation()}
            style={{ animation: 'bounce-in 0.35s ease forwards', transformOrigin: 'bottom' }}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <h2 className="text-center font-black text-xl text-gray-800 mb-1">도장 선택하기 👑</h2>
            <p className="text-center text-gray-500 text-sm mb-5">{currentChild.name}에게 어떤 도장을 줄까요?</p>
            <div className="grid grid-cols-5 gap-2">
              {STAMP_TYPES.map(s => (
                <button key={s.type} onClick={() => handlePickStamp(s.type)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-2xl active:scale-90 transition-transform"
                  style={{ background: STAMP_BG[s.type], border: `2.5px solid ${s.color}` }}>
                  <div style={{ fontSize: 28 }}>{s.emoji}</div>
                  <div className="font-black text-center" style={{ color: s.color, fontSize: 10 }}>{s.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {stampAnim && (
        <StampAnimation
          stampType={stampAnim}
          childName={currentChild.name}
          onComplete={() => setStampAnim(null)}
        />
      )}

      <BottomNav active="home" />
    </div>
  );
}
