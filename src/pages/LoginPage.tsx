import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { C, SH } from '../lib/design';

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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: C.bg }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px 32px' }}>

        {/* Mascot */}
        <div className="float-anim" style={{ marginBottom: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 96, lineHeight: 1 }}>🦕</div>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: '.12em', marginBottom: 8 }}>STAMP BOOK</div>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: C.t1, letterSpacing: '-.02em' }}>칭찬 스탬프북</h1>
          <p style={{ margin: '8px 0 0', fontSize: 14, color: C.t2, fontWeight: 500, lineHeight: 1.6 }}>
            매일의 작은 노력들이<br/>특별한 추억이 돼요
          </p>
        </div>

        {/* Card */}
        <div style={{ width: '100%', background: C.card, borderRadius: 24, padding: 20, boxShadow: SH.lift }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: C.soft, borderRadius: 14, padding: '14px 16px',
              border: `1.5px solid ${C.divider}`,
            }}>
              <span style={{ fontSize: 18 }}>👤</span>
              <input
                type="text"
                placeholder="아이 이름"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={{
                  flex: 1, border: 'none', background: 'transparent', outline: 'none',
                  fontSize: 15, fontWeight: 600, color: C.t1, fontFamily: 'inherit',
                }}
              />
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: C.soft, borderRadius: 14, padding: '14px 16px',
              border: `1.5px solid ${C.divider}`,
            }}>
              <span style={{ fontSize: 18 }}>🔒</span>
              <input
                type={showPin ? 'text' : 'password'}
                placeholder="부모 PIN (4자리)"
                maxLength={4}
                value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={{
                  flex: 1, border: 'none', background: 'transparent', outline: 'none',
                  fontSize: 15, fontWeight: 600, color: C.t1, fontFamily: 'inherit',
                }}
              />
              <button onClick={() => setShowPin(v => !v)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18 }}>
                {showPin ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: '#FEF2F2', color: '#DC2626', borderRadius: 12,
              padding: '10px 14px', fontSize: 13, fontWeight: 700,
              textAlign: 'center', marginBottom: 12,
            }}>{error}</div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%', height: 54, border: 'none', borderRadius: 16,
              background: loading ? C.soft : C.accent,
              color: loading ? C.t3 : '#fff',
              fontSize: 16, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : SH.btn,
              transition: 'all .15s', fontFamily: 'inherit',
            }}
          >
            {loading ? '확인 중...' : '시작하기 →'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 13, color: C.t3, margin: '16px 0 0', fontWeight: 600 }}>
            처음이신가요?{' '}
            <Link to="/register" style={{ color: C.accent, fontWeight: 800, textDecoration: 'none' }}>계정 만들기</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
