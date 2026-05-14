import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';
import PinModal from '../components/PinModal';
import StampAnimation from '../components/StampAnimation';
import { StampType } from '../types';

const STAMP_TYPES: { type: StampType; label: string; color: string; bg: string; emoji: string }[] = [
  { type: 'good',    label: 'GOOD!',    color: '#EF4444', bg: '#FEF2F2', emoji: '⭐' },
  { type: 'nice',    label: 'NICE!',    color: '#F59E0B', bg: '#FFFBEB', emoji: '☀️' },
  { type: 'great',   label: 'GREAT!',   color: '#10B981', bg: '#ECFDF5', emoji: '🦕' },
  { type: 'wow',     label: 'WOW!',     color: '#8B5CF6', bg: '#F5F3FF', emoji: '👑' },
  { type: 'perfect', label: 'PERFECT!', color: '#3B82F6', bg: '#EFF6FF', emoji: '💎' },
];

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

  return (
    <div className="min-h-screen flex flex-col pb-24" style={{ background: '#F5F3FF' }}>

      {/* 헤더 */}
      <div className="px-5 pt-6 pb-5" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl flex items-center justify-center shadow-md text-3xl"
              style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #FDE68A, #F59E0B)', minWidth: 52 }}>
              {currentChild.avatarEmoji}
            </div>
            <div>
              <div className="font-black text-white text-lg leading-tight">{currentChild.name}</div>
              {currentChild.streak > 0
                ? <div className="text-yellow-300 text-xs font-bold mt-0.5">🔥 {currentChild.streak}일 연속 달성 중!</div>
                : <div className="text-purple-200 text-xs mt-0.5">오늘도 파이팅! 💪</div>
              }
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-2xl px-4 py-2.5 shadow-md"
            style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}>
            <span className="text-xl">⭐</span>
            <span className="font-black text-white text-lg">{currentChild.stars}</span>
          </div>
        </div>
      </div>

      {/* 미션 카드 */}
      <div className="px-4 pt-5">
        <div className="rounded-3xl p-5 shadow-lg" style={{ background: 'white', border: '1px solid #EDE9FE' }}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="font-black text-gray-900 text-base">오늘의 미션 📋</div>
              <div className="text-xs mt-0.5" style={{ color: '#8B5CF6' }}>
                {completedCount === missions.length && missions.length > 0
                  ? '🎉 모두 완료했어요!'
                  : `${completedCount}/${missions.length} 완료`
                }
              </div>
            </div>
            <div className="flex gap-1">
              {missions.map((m, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full transition-all"
                  style={{ background: m.completed >= m.target ? '#7C3AED' : '#EDE9FE' }} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {missions.map(m => {
              const done = m.completed >= m.target;
              return (
                <button key={m.id}
                  onClick={() => !done && setMissionPinTarget(m.id)}
                  className="rounded-2xl p-3 flex flex-col items-center active:scale-95 transition-all relative"
                  style={{
                    background: done ? 'linear-gradient(135deg, #6D28D9, #4F46E5)' : '#F5F3FF',
                    border: done ? 'none' : '2px solid #EDE9FE',
                    boxShadow: done ? '0 4px 12px rgba(109,40,217,0.3)' : 'none',
                  }}>
                  <div className="text-3xl mb-1">{m.icon}</div>
                  <div className="text-xs font-bold text-center leading-tight" style={{ color: done ? 'white' : '#6B7280' }}>{m.title}</div>
                  {done && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs font-black" style={{ color: '#6D28D9' }}>✓</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 스탬프북 미리보기 */}
      <div className="px-4 pt-4">
        <div className="rounded-3xl p-5 shadow-lg" style={{ background: 'white', border: '1px solid #EDE9FE' }}>
          <div className="flex justify-between items-center mb-4">
            <div className="font-black text-gray-900 text-base">나의 스탬프 📚</div>
            <button onClick={() => navigate('/stampbook')} className="text-xs font-bold rounded-xl px-3 py-1.5" style={{ color: '#6D28D9', background: '#F5F3FF' }}>전체보기 →</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(9)].map((_, i) => {
              const stamp = recentStamps[i];
              const stype = STAMP_TYPES.find(s => s.type === stamp?.type);
              return (
                <div key={i} className="aspect-square rounded-2xl flex flex-col items-center justify-center"
                  style={{
                    background: stype ? stype.bg : '#F9F7FF',
                    border: stype ? `2.5px solid ${stype.color}` : '2px dashed #DDD6FE',
                  }}>
                  {stype ? (
                    <>
                      <div style={{ fontSize: 26 }}>{stype.emoji}</div>
                      <div className="font-black mt-0.5" style={{ color: stype.color, fontSize: 9 }}>{stype.label}</div>
                    </>
                  ) : (
                    <div className="w-6 h-6 rounded-full" style={{ background: '#EDE9FE' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 도장 요청 버튼 */}
      <div className="px-4 pt-4">
        <button
          onClick={() => setShowStampPin(true)}
          className="w-full rounded-3xl p-5 flex items-center gap-4 shadow-lg active:scale-95 transition-all"
          style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}>
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-md">📦</div>
          <div className="flex-1 text-left">
            <div className="font-black text-amber-900 text-base">도장 요청하기</div>
            <div className="text-amber-700 text-xs mt-0.5">부모님께 도장을 받아보세요!</div>
          </div>
          <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center" style={{ opacity: 0.8 }}>
            <span className="font-black text-amber-700">→</span>
          </div>
        </button>
      </div>

      {/* 부모 모드 버튼 */}
      <div className="px-4 pt-3">
        <button
          onClick={() => navigate('/parent')}
          className="w-full rounded-2xl px-5 py-4 flex items-center gap-3 active:scale-95 transition-all"
          style={{ background: 'white', border: '1.5px solid #EDE9FE', boxShadow: '0 2px 8px rgba(109,40,217,0.06)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl" style={{ background: '#F5F3FF' }}>👨‍👩‍👧</div>
          <span className="font-bold text-sm" style={{ color: '#4B5563' }}>부모 모드</span>
          <span className="ml-auto font-bold" style={{ color: '#9CA3AF' }}>→</span>
        </button>
      </div>

      {/* 모달 */}
      {missionPinTarget && (
        <PinModal
          title="미션 완료 확인" subtitle="부모님 PIN을 입력해주세요"
          correctPin={currentUser.parentPin}
          onSuccess={() => { completeMission(missionPinTarget!); setMissionPinTarget(null); }}
          onClose={() => setMissionPinTarget(null)}
        />
      )}
      {showStampPin && (
        <PinModal
          title="도장 주기" subtitle="부모님 PIN을 입력해 도장을 주세요"
          correctPin={currentUser.parentPin}
          onSuccess={() => { setShowStampPin(false); setShowStampPicker(true); }}
          onClose={() => setShowStampPin(false)}
        />
      )}
      {showStampPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
          onClick={() => setShowStampPicker(false)}>
          <div className="w-full rounded-t-3xl p-6 pb-8 slide-up-anim"
            style={{ background: 'white', maxWidth: 430 }}
            onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h2 className="text-center font-black text-xl text-gray-900 mb-1">도장 선택 👑</h2>
            <p className="text-center text-sm mb-5" style={{ color: '#6B7280' }}>{currentChild.name}에게 어떤 도장을 줄까요?</p>
            <div className="grid grid-cols-5 gap-2">
              {STAMP_TYPES.map(s => (
                <button key={s.type}
                  onClick={() => { setShowStampPicker(false); giveStamp(currentChild.id, s.type); setStampAnim(s.type); }}
                  className="flex flex-col items-center gap-1 p-3 rounded-2xl active:scale-90 transition-transform"
                  style={{ background: s.bg, border: `2.5px solid ${s.color}` }}>
                  <div style={{ fontSize: 26 }}>{s.emoji}</div>
                  <div className="font-black text-center" style={{ color: s.color, fontSize: 9 }}>{s.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {stampAnim && (
        <StampAnimation stampType={stampAnim} childName={currentChild.name} onComplete={() => setStampAnim(null)} />
      )}

      <BottomNav active="home" />
    </div>
  );
}
