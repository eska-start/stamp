import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';
import { StampType } from '../types';

const STAMP_DATA: Record<StampType, { label: string; color: string; emoji: string; bg: string }> = {
  good:    { label: 'GOOD!',    color: '#FF6B6B', emoji: '⭐', bg: '#FFF0F0' },
  nice:    { label: 'NICE!',    color: '#FFB800', emoji: '☀️', bg: '#FFFBF0' },
  great:   { label: 'GREAT!',   color: '#40C057', emoji: '🦕', bg: '#F0FFF4' },
  wow:     { label: 'WOW!',     color: '#845EF7', emoji: '👑', bg: '#F5F0FF' },
  perfect: { label: 'PERFECT!', color: '#339AF0', emoji: '💎', bg: '#F0F8FF' },
};

export default function StampBookPage() {
  const navigate = useNavigate();
  const { currentChild } = useApp();

  if (!currentChild) return null;

  const stamps = [...currentChild.stamps].reverse();
  const SLOTS = 18;

  const countByType = (stamps: typeof currentChild.stamps) => {
    const counts: Partial<Record<StampType, number>> = {};
    stamps.forEach(s => { counts[s.type] = (counts[s.type] || 0) + 1; });
    return counts;
  };
  const counts = countByType(currentChild.stamps);

  return (
    <div className="min-h-screen pb-24" style={{ background: '#FFF8F0' }}>
      <div className="px-4 py-4 flex items-center"
        style={{ background: 'linear-gradient(135deg, #B39DDB 0%, #7E57C2 100%)' }}>
        <button onClick={() => navigate('/home')} className="text-white text-2xl mr-3">‹</button>
        <h1 className="text-white font-black text-xl flex-1 text-center">스탬프북</h1>
        <div className="w-7" />
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Stats bar */}
        <div className="bg-white rounded-3xl p-4 flex items-center justify-around shadow-sm">
          <div className="text-center">
            <div className="font-black text-2xl text-gray-800">{currentChild.stamps.length}</div>
            <div className="text-gray-500 text-xs">총 스탬프</div>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="text-center">
            <div className="font-black text-2xl text-gray-800">⭐ {currentChild.stars}</div>
            <div className="text-gray-500 text-xs">보유 별</div>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="text-center">
            <div className="font-black text-2xl text-gray-800">🔥 {currentChild.streak}</div>
            <div className="text-gray-500 text-xs">연속 일수</div>
          </div>
        </div>

        {/* Stamp type breakdown */}
        <div className="bg-white rounded-3xl p-4 shadow-sm">
          <div className="font-black text-gray-700 mb-3">스탬프 종류</div>
          <div className="flex justify-between">
            {(Object.entries(STAMP_DATA) as [StampType, typeof STAMP_DATA[StampType]][]).map(([type, data]) => (
              <div key={type} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: data.bg, border: `2px solid ${data.color}` }}>
                  <span style={{ fontSize: 18 }}>{data.emoji}</span>
                </div>
                <div className="font-black text-sm text-gray-700">{counts[type] || 0}</div>
                <div className="font-bold" style={{ color: data.color, fontSize: 9 }}>{data.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stamp book grid */}
        <div className="rounded-3xl overflow-hidden shadow-md" style={{ background: '#F5E6D0', border: '3px solid #C4A882' }}>
          <div className="flex justify-around px-4 pt-2 pb-1">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-4 h-4 rounded-full"
                style={{ background: 'linear-gradient(135deg, #D4A017 0%, #8B6914 100%)' }} />
            ))}
          </div>
          <div className="px-4 pb-5">
            <div className="text-center mb-3">
              <span className="font-black text-gray-700 text-lg">— 나의 스탬프북 —</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[...Array(SLOTS)].map((_, i) => {
                const stamp = stamps[i];
                const data = stamp ? STAMP_DATA[stamp.type] : null;
                return (
                  <div key={i}
                    className="aspect-square rounded-full flex flex-col items-center justify-center"
                    style={{
                      background: data ? data.bg : '#E8D5B7',
                      border: data ? `3px solid ${data.color}` : '2px dashed #C4A882',
                    }}>
                    {data ? (
                      <>
                        <div style={{ fontSize: 30 }}>{data.emoji}</div>
                        <div className="font-black mt-0.5" style={{ color: data.color, fontSize: 9 }}>{data.label}</div>
                      </>
                    ) : (
                      <div className="w-6 h-6 rounded-full" style={{ background: '#C4A882', opacity: 0.25 }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* How to get stamps */}
        <div className="rounded-3xl p-4 shadow-sm" style={{ background: '#EDE7F6' }}>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="font-black text-purple-800 mb-2">⭐ 스탬프 모으는 방법!</div>
              {[
                '매일 미션을 모두 완료하면 스탬프 1개 획득',
                '연속 성공 보너스로 추가 스탬프 획득',
                '특별 이벤트 참여로 한정 스탬프 획득',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-purple-700 text-sm mb-1">
                  <span className="text-purple-400 mt-0.5">✓</span><span>{tip}</span>
                </div>
              ))}
            </div>
            <div className="text-5xl float-anim">🦕</div>
          </div>
        </div>
      </div>

      <BottomNav active="stampbook" />
    </div>
  );
}
