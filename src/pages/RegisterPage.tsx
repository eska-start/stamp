import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { C, SH } from '../lib/design';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { registerUser } = useApp();
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError('');
    if (!username.trim())   { setError('아이 이름을 입력해주세요.'); return; }
    if (pin.length !== 4)   { setError('PIN은 4자리 숫자여야 합니다.'); return; }
    if (pin !== pinConfirm) { setError('PIN이 일치하지 않습니다.'); return; }

    setLoading(true);
    const result = await registerUser(username.trim(), pin);
    setLoading(false);

    if (result === 'taken')  { setError('이미 사용 중인 이름입니다.'); return; }
    if (result === 'error')  { setError('오류가 발생했습니다. 다시 시도해주세요.'); return; }
    navigate('/register/child');
  };

  const inputStyle = {
    flex: 1,
    outline: 'none',
    background: 'transparent',
    border: 'none',
    color: C.t1,
    fontSize: 15,
  };

  const fieldWrapStyle = {
    display: 'flex',
    alignItems: 'center',
    background: C.soft,
    borderRadius: 16,
    padding: '14px 16px',
    border: `1.5px solid ${C.divider}`,
    gap: 10,
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '32px 24px', background: C.bg }}>
      <Link to="/" style={{ color: C.accent, fontWeight: 900, fontSize: 17, textDecoration: 'none', marginBottom: 28 }}>‹ 뒤로</Link>

      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div className="float-anim" style={{ fontSize: 64, marginBottom: 12 }}>📖</div>
        <h1 style={{ fontWeight: 900, fontSize: 28, color: C.t1, margin: 0 }}>계정 만들기</h1>
        <p style={{ color: C.t2, fontSize: 14, marginTop: 8 }}>스탬프북을 시작해요!</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={{ fontWeight: 700, color: C.t2, fontSize: 13, marginBottom: 6 }}>아이 이름 (ID)</div>
          <div style={fieldWrapStyle}>
            <span style={{ fontSize: 18 }}>👨‍👩‍👧</span>
            <input
              type="text"
              placeholder="로그인 시 사용할 이름"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, color: C.t2, fontSize: 13, marginBottom: 6 }}>부모 PIN (4자리)</div>
          <div style={fieldWrapStyle}>
            <span style={{ fontSize: 18 }}>🔒</span>
            <input
              type="password"
              placeholder="숫자 4자리"
              maxLength={4}
              value={pin}
              onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, color: C.t2, fontSize: 13, marginBottom: 6 }}>PIN 확인</div>
          <div style={fieldWrapStyle}>
            <span style={{ fontSize: 18 }}>🔑</span>
            <input
              type="password"
              placeholder="PIN을 다시 입력해주세요"
              maxLength={4}
              value={pinConfirm}
              onChange={e => setPinConfirm(e.target.value.replace(/\D/g, ''))}
              style={inputStyle}
            />
          </div>
        </div>

        {error && (
          <div style={{ color: '#E53535', fontSize: 13, textAlign: 'center', padding: '6px 12px', background: '#FFF1F1', borderRadius: 10 }}>{error}</div>
        )}

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px 0',
            borderRadius: 16,
            fontWeight: 900,
            fontSize: 17,
            border: 'none',
            cursor: loading ? 'default' : 'pointer',
            background: loading ? C.divider : C.accent,
            color: loading ? C.t3 : '#fff',
            boxShadow: loading ? 'none' : SH.btn,
            marginTop: 4,
          }}>
          {loading ? '🔄 생성 중...' : '다음 단계 →'}
        </button>
      </div>

      <p style={{ color: C.t2, fontSize: 14, textAlign: 'center', marginTop: 24 }}>
        이미 계정이 있으신가요?{' '}
        <Link to="/" style={{ color: C.accent, fontWeight: 900, textDecoration: 'none' }}>로그인</Link>
      </p>
    </div>
  );
}
