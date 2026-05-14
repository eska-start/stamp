import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';
import PinModal from '../components/PinModal';
import RewardAnimation from '../components/RewardAnimation';
import { C, SH } from '../lib/design';
import { Reward } from '../types';

export default function RewardsPage() {
  const navigate = useNavigate();
  const { currentUser, currentChild, exchangeReward } = useApp();
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showPin, setShowPin] = useState(false);
  const [animReward, setAnimReward] = useState<Reward | null>(null);

  if (!currentUser || !currentChild) return null;

  const exchangeCount = currentUser.rewardExchanges.filter(e => e.childId === currentChild.id).length;

  const handleClick = (reward: Reward) => {
    if (currentChild.stars < reward.cost) return;
    setSelectedReward(reward);
    setShowPin(true);
  };

  const handlePinSuccess = () => {
    setShowPin(false);
    if (!selectedReward) return;
    const result = exchangeReward(selectedReward.id);
    if (result) setAnimReward(selectedReward);
    setSelectedReward(null);
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 120, background: C.bg }}>
      {/* Header */}
      <div style={{ background: C.soft, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => navigate('/home')}
          style={{ width: 36, height: 36, borderRadius: 12, background: C.card, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SH.card, color: C.t1, fontSize: 20, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
          ‹
        </button>
        <h1 style={{ flex: 1, textAlign: 'center', fontWeight: 900, fontSize: 18, color: C.t1, margin: 0 }}>보상</h1>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Stats */}
        <div style={{ background: C.card, borderRadius: 20, padding: 16, boxShadow: SH.card, display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: 22, color: C.t1 }}>⭐ {currentChild.stars}</div>
            <div style={{ color: C.t3, fontSize: 12, marginTop: 2 }}>보유 별</div>
          </div>
          <div style={{ width: 1, height: 32, background: C.divider }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: 22, color: C.t1 }}>🎁 {exchangeCount}</div>
            <div style={{ color: C.t3, fontSize: 12, marginTop: 2 }}>획득한 선물</div>
          </div>
        </div>

        {/* Section title */}
        <div style={{ fontWeight: 900, color: C.t1, fontSize: 16 }}>별로 교환할 수 있는 선물들 ✨</div>

        {/* Rewards list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {currentUser.rewards.filter(r => r.available).map(reward => {
            const canAfford = currentChild.stars >= reward.cost;
            return (
              <div key={reward.id} style={{ background: C.card, borderRadius: 20, padding: 16, display: 'flex', alignItems: 'center', gap: 14, boxShadow: SH.card }}>
                <div style={{ width: 60, height: 60, borderRadius: 16, background: C.soft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, flexShrink: 0 }}>
                  {reward.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 900, color: C.t1, fontSize: 15 }}>{reward.name}</div>
                  {reward.description && (
                    <div style={{ color: C.t2, fontSize: 13, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{reward.description}</div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <span>⭐</span>
                    <span style={{ fontWeight: 900, color: C.t1, fontSize: 14 }}>{reward.cost}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleClick(reward)}
                  disabled={!canAfford}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 14,
                    fontWeight: 900,
                    fontSize: 13,
                    border: 'none',
                    cursor: canAfford ? 'pointer' : 'default',
                    background: canAfford ? C.accent : C.divider,
                    color: canAfford ? '#fff' : C.t3,
                    boxShadow: canAfford ? SH.btn : 'none',
                    whiteSpace: 'nowrap',
                    transition: 'transform 0.1s',
                  }}>
                  교환하기
                </button>
              </div>
            );
          })}
        </div>

        {/* Tips */}
        <div style={{ background: C.accentSoft, borderRadius: 20, padding: 16, border: `1.5px solid ${C.accent}33` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 900, color: C.accent, marginBottom: 8, fontSize: 14 }}>💡 보상 획득 팁!</div>
              {[
                '매일 꾸준히 미션을 완료해보세요',
                '연속 성공으로 더 많은 별을 모아보세요',
                '특별 이벤트에 참여하면 보너스 별을 드려요!',
              ].map((tip, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: C.accentDeep, fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: C.accent, marginTop: 1 }}>●</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
            <div className="float-anim" style={{ fontSize: 44 }}>🦕</div>
          </div>
        </div>
      </div>

      {showPin && selectedReward && (
        <PinModal
          title="부모님 PIN 확인"
          subtitle={`${selectedReward.name} (⭐${selectedReward.cost})을 교환할까요?`}
          correctPin={currentUser.parentPin}
          onSuccess={handlePinSuccess}
          onClose={() => { setShowPin(false); setSelectedReward(null); }}
        />
      )}

      {animReward && (
        <RewardAnimation
          rewardName={animReward.name}
          rewardEmoji={animReward.emoji}
          onComplete={() => setAnimReward(null)}
        />
      )}

      <BottomNav active="rewards" />
    </div>
  );
}
