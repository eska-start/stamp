import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';
import { C, SH } from '../lib/design';
import { StampType } from '../types';

const STAMP_DATA: Record<StampType, { label: string; color: string; emoji: string }> = {
  good:    { label: 'GOOD!',    color: C.accent,      emoji: '⭐' },
  nice:    { label: 'NICE!',    color: '#FFB800',      emoji: '☀️' },
  great:   { label: 'GREAT!',  color: C.success,      emoji: '🌿' },
  wow:     { label: 'WOW!',    color: C.accentDeep,   emoji: '👑' },
  perfect: { label: 'PERFECT!', color: '#E55E1F',     emoji: '💎' },
};

export default function StampBookPage() {
  const navigate = useNavigate();
  const { currentChild } = useApp();

  if (!currentChild) return null;

  const stamps = [...currentChild.stamps].reverse();
  const SLOTS = 18;

  const countByType = (arr: typeof currentChild.stamps) => {
    const counts: Partial<Record<StampType, number>> = {};
    arr.forEach(s => { counts[s.type] = (counts[s.type] || 0) + 1; });
    return counts;
  };
  const counts = countByType(currentChild.stamps);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 120, background: C.bg }}>
      {/* Header */}
      <div style={{ background: C.soft, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => navigate('/home')}
          style={{ width: 36, height: 36, borderRadius: 12, background: C.card, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SH.card, color: C.t1, fontSize: 20, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
          ‹
        </button>
        <h1 style={{ flex: 1, textAlign: 'center', fontWeight: 900, fontSize: 18, color: C.t1, margin: 0 }}>스탬프북</h1>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Stats */}
        <div style={{ background: C.card, borderRadius: 20, padding: 16, boxShadow: SH.card, display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
          {[
            { value: currentChild.stamps.length, label: '총 스탬프' },
            { value: `⭐ ${currentChild.stars}`, label: '보유 별' },
            { value: `🔥 ${currentChild.streak}`, label: '연속 일수' },
          ].map((s, i, arr) => (
            <React.Fragment key={s.label}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 900, fontSize: 22, color: C.t1 }}>{s.value}</div>
                <div style={{ color: C.t3, fontSize: 12, marginTop: 2 }}>{s.label}</div>
              </div>
              {i < arr.length - 1 && <div style={{ width: 1, height: 32, background: C.divider }} />}
            </React.Fragment>
          ))}
        </div>

        {/* Stamp type breakdown */}
        <div style={{ background: C.card, borderRadius: 20, padding: 16, boxShadow: SH.card }}>
          <div style={{ fontWeight: 900, color: C.t2, marginBottom: 12, fontSize: 14 }}>스탬프 종류</div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {(Object.entries(STAMP_DATA) as [StampType, typeof STAMP_DATA[StampType]][]).map(([type, data]) => (
              <div key={type} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: C.accentSoft, border: `2px solid ${data.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  {data.emoji}
                </div>
                <div style={{ fontWeight: 900, fontSize: 14, color: C.t1 }}>{counts[type] || 0}</div>
                <div style={{ color: data.color, fontSize: 9, fontWeight: 700 }}>{data.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stamp grid */}
        <div style={{ background: C.soft, borderRadius: 20, overflow: 'hidden', border: `2px solid ${C.divider}`, boxShadow: SH.card }}>
          <div style={{ padding: '14px 16px 6px', textAlign: 'center' }}>
            <span style={{ fontWeight: 900, color: C.t2, fontSize: 16 }}>— 나의 스탬프북 —</span>
          </div>
          <div style={{ padding: '8px 16px 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[...Array(SLOTS)].map((_, i) => {
              const stamp = stamps[i];
              const data = stamp ? STAMP_DATA[stamp.type] : null;
              return (
                <div
                  key={i}
                  className={data ? 'stamp-in-anim' : ''}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: data ? C.accentSoft : C.card,
                    border: data ? `3px solid ${data.color}` : `2px dashed ${C.divider}`,
                  }}>
                  {data ? (
                    <>
                      <div style={{ fontSize: 28 }}>{data.emoji}</div>
                      <div style={{ color: data.color, fontSize: 9, fontWeight: 700, marginTop: 2 }}>{data.label}</div>
                    </>
                  ) : (
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: C.divider }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tips */}
        <div style={{ background: C.accentSoft, borderRadius: 20, padding: 16, border: `1.5px solid ${C.accent}33` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 900, color: C.accent, marginBottom: 8, fontSize: 14 }}>⭐ 스탬프 모으는 방법!</div>
              {[
                '매일 미션을 모두 완료하면 스탬프 1개 획득',
                '연속 성공 보너스로 추가 스탬프 획득',
                '특별 이벤트 참여로 한정 스탬프 획득',
              ].map((tip, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: C.accentDeep, fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: C.accent, marginTop: 1 }}>✓</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
            <div className="float-anim" style={{ fontSize: 44 }}>🦕</div>
          </div>
        </div>
      </div>

      <BottomNav active="stampbook" />
    </div>
  );
}
