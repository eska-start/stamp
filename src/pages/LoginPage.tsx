import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useApp();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    if (!username.trim() || !pin) { setError('이름과 PIN을 입력해주세요.'); return; }
    setLoading(true);
    const user = await loginUser(username.trim(), pin);
    setLoading(false);
    if (!user) { setError('이름 또는 PIN이 올바르지 않습니다.'); return; }
    navigate(user.children.length > 0 ? '/home' : '/register/child');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #3730A3 0%, #6D28D9 50%, #7C3AED 100%)' }}>

      {/* 상단 장식 */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden" style={{ height: 300 }}>
        <div className="absolute rounded-full opacity-10" style={{ width: 300, height: 300, background: 'white', top: -100, left: -80 }} />
        <div className="absolute rounded-full opacity-10" style={{ width: 200, height: 200, background: '#F59E0B', top: 40, right: -60 }} />
        <div className="absolute rounded-full opacity-5" style={{ width: 150, height: 150, background: 'white', top: 180, left: 60 }} />
      </div>

      {/* 상단 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center pt-16 pb-8 px-6 relative z-10">

        {/* 마스코트 */}
        <div className="mb-6 float-anim">
          <div className="relative">
            <div className="rounded-3xl flex items-center justify-center shadow-2xl"
              style={{
                width: 120, height: 120,
                background: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)',
                border: '4px solid rgba(255,255,255,0.4)',
                fontSize: 68,
              }}>
              🦕
            </div>
            <div className="absolute -bottom-3 left-1/2 rounded-full px-3 py-1 shadow-lg text-white font-black text-xs"
              style={{ transform: 'translateX(-50%)', background: 'linear-gradient(90deg, #4F46E5, #7C3AED)', whiteSpace: 'nowrap' }}>
              STAMP BOOK
            </div>
          </div>
        </div>

        {/* 타이틀 */}
        <h1 className="text-4xl font-black text-white text-center mb-2" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
          칭찬 스탬프북 👑
        </h1>
        <p className="text-purple-200 text-sm text-center mb-8">매일의 작은 노력이 특별한 추억이 돼요</p>

        {/* 로그인 카드 */}
        <div className="w-full rounded-3xl p-6 shadow-2xl" style={{ background: 'white' }}>

          <div className="space-y-3 mb-5">
            <div className="flex items-center gap-3 rounded-2xl px-4 py-4" style={{ background: '#F5F3FF', border: '2px solid #EDE9FE' }}>
              <span className="text-xl">👤</span>
              <input
                type="text"
                placeholder="아이 이름"
                className="flex-1 outline-none bg-transparent font-medium"
                style={{ color: '#1F2937', fontSize: 15 }}
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div className="flex items-center gap-3 rounded-2xl px-4 py-4" style={{ background: '#F5F3FF', border: '2px solid #EDE9FE' }}>
              <span className="text-xl">🔒</span>
              <input
                type={showPin ? 'text' : 'password'}
                placeholder="부모 PIN (4자리)"
                className="flex-1 outline-none bg-transparent font-medium"
                style={{ color: '#1F2937', fontSize: 15 }}
                maxLength={4}
                value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
              <button onClick={() => setShowPin(!showPin)} className="text-xl">
                {showPin ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl px-4 py-2.5 mb-4 text-center text-sm font-bold"
              style={{ background: '#FEF2F2', color: '#EF4444' }}>
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-4 rounded-2xl text-white font-black text-base shadow-lg active:scale-95 transition-all"
            style={{ background: loading ? '#C4B5FD' : 'linear-gradient(135deg, #6D28D9 0%, #4F46E5 100%)', fontSize: 16 }}>
            {loading ? '🔄  확인 중...' : '로그인 →'}
          </button>

          <p className="text-center text-sm mt-5" style={{ color: '#9CA3AF' }}>
            처음이신가요?{' '}
            <Link to="/register" className="font-black" style={{ color: '#6D28D9' }}>계정 만들기</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
