import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUsers } from '../utils/storage';
import { useApp } from '../contexts/AppContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const { loginUser } = useApp();
  const navigate = useNavigate();

  const handleLogin = () => {
    setError('');
    if (!username || !pin) { setError('이름과 PIN을 입력해주세요.'); return; }
    const users = getUsers();
    const user = users.find(u => u.username === username && u.parentPin === pin);
    if (!user) { setError('이름 또는 PIN이 올바르지 않습니다.'); return; }
    loginUser(user.id, user.children[0]?.id);
    if (user.children.length > 0) navigate('/home');
    else navigate('/register/child');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between py-10 px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FFF8F0 0%, #FFE8D0 100%)' }}>

      <div className="absolute top-6 left-6 text-2xl float-anim">⭐</div>
      <div className="absolute top-10 right-10 text-xl float-anim" style={{ animationDelay: '1s' }}>💜</div>
      <div className="absolute top-24 left-14 text-lg float-anim" style={{ animationDelay: '0.5s' }}>🌟</div>
      <div className="absolute top-16 right-20 text-sm float-anim" style={{ animationDelay: '1.5s' }}>✨</div>

      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black leading-tight" style={{ color: '#8B5E3C' }}>칭찬</h1>
          <h1 className="text-5xl font-black leading-tight" style={{ color: '#7B5FBE' }}>스탬프북 👑</h1>
          <p className="text-gray-500 text-sm mt-3 leading-relaxed">매일의 작은 노력들이<br />특별한 추억이 돼요</p>
        </div>

        <div className="w-48 h-52 flex items-center justify-center mb-10 float-anim">
          <div className="relative">
            <div className="w-44 h-48 rounded-2xl flex items-center justify-center shadow-xl"
              style={{ background: 'linear-gradient(135deg, #FFE082 0%, #FFB300 100%)', border: '4px solid #FF8F00' }}>
              <div style={{ fontSize: 100 }}>🦕</div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-black shadow">
              MY STAMP BOOK
            </div>
          </div>
        </div>

        <div className="w-full space-y-3">
          <div className="flex items-center bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-gray-100">
            <span className="text-gray-400 mr-3 text-lg">👤</span>
            <input type="text" placeholder="아이 이름을 입력해주세요"
              className="flex-1 outline-none text-gray-700 bg-transparent"
              value={username} onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <div className="flex items-center bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-gray-100">
            <span className="text-gray-400 mr-3 text-lg">🔒</span>
            <input type={showPin ? 'text' : 'password'} placeholder="부모 PIN (4자리)"
              className="flex-1 outline-none text-gray-700 bg-transparent"
              maxLength={4} value={pin}
              onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            <button onClick={() => setShowPin(!showPin)} className="text-gray-400 text-lg">
              {showPin ? '🙈' : '👁️'}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button onClick={handleLogin}
            className="w-full py-4 rounded-2xl text-white font-black text-lg shadow-lg active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #9B7FD4 0%, #6D4EC4 100%)' }}>
            로그인 ›
          </button>
        </div>

        <p className="text-gray-500 text-sm mt-5">
          첫담이신가요?{' '}
          <Link to="/register" className="text-purple-600 font-black">계정 만들기</Link>
        </p>
      </div>
    </div>
  );
}
