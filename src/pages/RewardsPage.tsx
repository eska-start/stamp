import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';
import PinModal from '../components/PinModal';
import RewardAnimation from '../components/RewardAnimation';
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
    <div className="min-h-screen pb-24" style={{ background: '#FFF8F0' }}>
      <div className="px-4 py-4 flex items-center"
        style={{ background: 'linear-gradient(135deg, #FFD740 0%, #FFA000 100%)' }}>
        <button onClick={() => navigate('/home')} className="text-amber-900 text-2xl mr-3">‹</button>
        <h1 className="text-amber-900 font-black text-xl flex-1 text-center">보상</h1>
        <div className="w-7" />
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Stats */}
        <div className="bg-white rounded-3xl p-4 flex items-center justify-around shadow-sm">
          <div className="text-center">
            <div className="font-black text-2xl text-gray-800">⭐ {currentChild.stars}</div>
            <div className="text-gray-500 text-xs">보유 별</div>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="text-center">
            <div className="font-black text-2xl text-gray-800">🎁 {exchangeCount}</div>
            <div className="text-gray-500 text-xs">획득한 선물</div>
          </div>
        </div>

        {/* Rewards list */}
        <h2 className="font-black text-gray-700 text-lg">별로 교환할 수 있는 선물들 ✨</h2>
        <div className="space-y-3">
          {currentUser.rewards.filter(r => r.available).map(reward => {
            const canAfford = currentChild.stars >= reward.cost;
            return (
              <div key={reward.id} className="bg-white rounded-3xl p-4 flex items-center gap-4 shadow-sm">
                <div className="rounded-2xl flex items-center justify-center"
                  style={{ width: 64, height: 64, background: '#F5F0FF', fontSize: 40, minWidth: 64 }}>
                  {reward.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-gray-800 truncate">{reward.name}</div>
                  <div className="text-gray-500 text-sm truncate">{reward.description}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-black text-gray-700">{reward.cost}</span>
                  </div>
                </div>
                <button onClick={() => handleClick(reward)}
                  disabled={!canAfford}
                  className="px-4 py-2 rounded-xl font-black text-sm transition-all active:scale-95 whitespace-nowrap"
                  style={{
                    background: canAfford ? 'linear-gradient(135deg, #9B7FD4 0%, #6D4EC4 100%)' : '#E0E0E0',
                    color: canAfford ? 'white' : '#999',
                  }}>
                  교환하기
                </button>
              </div>
            );
          })}
        </div>

        {/* Tips */}
        <div className="rounded-3xl p-4 shadow-sm" style={{ background: '#FFFBF0', border: '1.5px solid #FFE082' }}>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="font-black text-amber-700 mb-2">💡 보상 획득 팁!</div>
              {[
                '매일 꼬준히 미션을 완료해보세요',
                '연속 성공으로 더 많은 별을 모아보세요',
                '특별 이벤트에 참여하면 보너스 별을 드려요!',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-amber-600 text-sm mb-1">
                  <span style={{ color: '#FFB300' }}>●</span><span>{tip}</span>
                </div>
              ))}
            </div>
            <div className="text-5xl float-anim">🦕</div>
          </div>
        </div>
      </div>

      {showPin && selectedReward && (
        <PinModal
          title="부모님 PIN 확인"
          subtitle={`${selectedReward.name} (⭐${selectedReward.cost})을 교환할가요?`}
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
