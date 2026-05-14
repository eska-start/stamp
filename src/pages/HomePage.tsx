import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import ScreenHeader from '../components/ScreenHeader';
import BottomNav from '../components/BottomNav';
import PinModal from '../components/PinModal';
import StampAnimation from '../components/StampAnimation';
import { StampType } from '../types';
import { C, SH } from '../lib/design';

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
  const [pending, setPending] = useState<Set<string>>(new Set());
  const [showPin, setShowPin] = useState(false);
  const [showStampPicker, setShowStampPicker] = useState(false);
  const [stampAnim, setStampAnim] = useState<StampType | null>(null);

  if (!currentUser || !currentChild) return null;

  const missions = getTodayMissions();
  const doneCount = missions.filter(m => m.completed >= m.target).length;
  const allDone = doneCount === missions.length && missions.length > 0;
  const hasBlockingOverlay = showPin || showStampPicker || !!stampAnim;

  const toggleMission = (id: string) => {
    const m = missions.find(m => m.id === id);
    if (!m || m.completed >= m.target) return;
    setPending(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleApprove = () => {
    pending.forEach(id => completeMission(id));
    setPending(new Set());
    setShowPin(false);
    setShowStampPicker(true);
  };

  const subtitle =
    allDone      ? `오늘 미션을 모두 완료했어요! 🎉` :
    pending.size > 0 ? `${pending.size}개 완료했어요. 도장 받으러 갈까요?` :
                       '오늘은 무엇부터 시작해볼까요?';

  return (
    <div className="fade-in" style={{ height: '100dvh', background: C.bg, overflow: 'hidden', position: 'relative' }}>
      <div style={{ height: '100%', overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 132 }}>
        <ScreenHeader kidName={currentChild.name} streak={currentChild.streak} stars={currentChild.stars} showSettings />

        <div style={{ padding: '0 16px 4px' }}>
          <div style={{ background: C.card, borderRadius: 24, padding: '20px 20px 14px', boxShadow: SH.card, textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: '.08em', marginBottom: 8 }}>TODAY'S BUDDY</div>
            <div className="float-anim" style={{ fontSize: 88, lineHeight: 1, marginBottom: 10 }}>🦕</div>
            <div style={{ fontSize: 14, color: C.t2, fontWeight: 600, lineHeight: 1.5 }}>{subtitle}</div>
          </div>
        </div>

        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: C.t1, letterSpacing: '-.01em' }}>오늘의 미션</h2>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.t3 }}>
              <span style={{ color: C.accent }}>{doneCount}</span> / {missions.length}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {missions.map(m => {
              const done     = m.completed >= m.target;
              const selected = pending.has(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => toggleMission(m.id)}
                  style={{
                    background:  done ? C.successSoft : selected ? C.accentSoft : C.card,
                    border:      `2px solid ${done ? C.success : selected ? C.accent : 'transparent'}`,
                    padding:     '18px 12px 14px',
                    borderRadius: 20, cursor: done ? 'default' : 'pointer', textAlign: 'center',
                    boxShadow:   !done && !selected ? SH.card : 'none',
                    display:     'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    position:    'relative', transition: 'all .15s', fontFamily: 'inherit',
                  }}
                >
                  {(done || selected) && (
                    <div style={{
                      position: 'absolute', top: 8, right: 8,
                      width: 22, height: 22, borderRadius: 99,
                      background: done ? C.success : C.accent,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="11" height="11" viewBox="0 0 12 12">
                        <path d="M2 6 L5 9 L10 3" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  <div style={{ fontSize: 42 }}>{m.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.t1, textDecoration: done ? 'line-through' : 'none', textDecorationColor: C.t3 }}>{m.title}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ padding: '14px 16px 0' }}>
          <button
            disabled={pending.size === 0}
            onClick={() => setShowPin(true)}
            style={{
              width: '100%', height: 58, border: 'none', borderRadius: 18,
              cursor: pending.size === 0 ? 'not-allowed' : 'pointer',
              background: pending.size === 0 ? C.soft : C.accent,
              color: pending.size === 0 ? C.t3 : '#fff', fontSize: 16, fontWeight: 800,
              boxShadow: pending.size === 0 ? 'none' : SH.btn,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'all .15s', fontFamily: 'inherit',
            }}
          >
            도장 요청하기
            {pending.size > 0 && <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 99, fontSize: 13, padding: '2px 10px', fontWeight: 800 }}>{pending.size}</span>}
          </button>
        </div>

        <div style={{ padding: '10px 16px 0' }}>
          <button
            onClick={() => navigate('/stampbook')}
            style={{ width: '100%', background: C.card, border: 'none', borderRadius: 18, padding: '14px 18px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 14, boxShadow: SH.card }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 14, background: C.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>📖</div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>스탬프북</div>
              <div style={{ fontSize: 12, color: C.t3, fontWeight: 600, marginTop: 2 }}>모은 스탬프 {currentChild.stamps.length}개</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.t3} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18 L15 12 L9 6"/></svg>
          </button>
        </div>
      </div>

      {showPin && (
        <PinModal
          title="도장 요청"
          subtitle={`${currentChild.name}이가 미션 ${pending.size}개를 완료했어요`}
          correctPin={currentUser.parentPin}
          onSuccess={handleApprove}
          onClose={() => setShowPin(false)}
        />
      )}

      {showStampPicker && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(31,26,20,0.45)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
          onClick={() => setShowStampPicker(false)}
        >
          <div
            style={{ width: '100%', maxWidth: 430, background: C.card, borderRadius: '24px 24px 0 0', padding: '24px 20px max(44px, env(safe-area-inset-bottom))', animation: 'slide-up .3s ease' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: 36, height: 4, borderRadius: 99, background: C.divider, margin: '0 auto 20px' }} />
            <h3 style={{ textAlign: 'center', fontSize: 18, fontWeight: 800, color: C.t1, margin: '0 0 4px' }}>도장 선택하기</h3>
            <p style={{ textAlign: 'center', fontSize: 13, color: C.t2, margin: '0 0 20px', fontWeight: 600 }}>{currentChild.name}에게 어떤 도장을 줄까요?</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
              {STAMP_TYPES.map(s => (
                <button
                  key={s.type}
                  onClick={() => { setShowStampPicker(false); giveStamp(currentChild.id, s.type); setStampAnim(s.type); }}
                  style={{ background: s.bg, border: `2.5px solid ${s.color}`, borderRadius: 18, padding: '12px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  <span style={{ fontSize: 26 }}>{s.emoji}</span>
                  <span style={{ fontSize: 9, fontWeight: 800, color: s.color }}>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {stampAnim && <StampAnimation stampType={stampAnim} childName={currentChild.name} onComplete={() => setStampAnim(null)} />}
      {!hasBlockingOverlay && <BottomNav active="home" />}
    </div>
  );
}
