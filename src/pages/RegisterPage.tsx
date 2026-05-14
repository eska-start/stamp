import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

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

  const fields = [
    { label: '아이 이름 (ID)', placeholder: '로그인 시 사용할 이름', icon: '👨‍👩‍👧', value: username, onChange: setUsername, type: 'text', max: undefined as number | undefined },
    { label: '부모 PIN (4자리)', placeholder: '숫자 4자리', icon: '🔒', value: pin, onChange: (v: string) => setPin(v.replace(/\D/g, '')), type: 'password', max: 4 },
    { label: 'PIN 확인', placeholder: 'PIN을 다시 입력해주세요', icon: '🔑', value: pinConfirm, onChange: (v: string) => setPinConfirm(v.replace(/\D/g, '')), type: 'password', max: 4 },
  ];

  return (
    <div className="min-h-screen flex flex-col py-8 px-6"
      style={{ background: 'linear-gradient(180deg, #FFF8F0 0%, #FFE8D0 100%)' }}>
      <Link to="/" className="text-purple-600 font-black text-lg mb-8">‹ 뒤로</Link>

      <div className="text-center mb-8">
        <div className="text-6xl mb-3 float-anim">📖</div>
        <h1 className="text-3xl font-black text-purple-700">계정 만들기</h1>
        <p className="text-gray-500 text-sm mt-2">스탬프북을 시작해요!</p>
      </div>

      <div className="space-y-4">
        {fields.map(f => (
          <div key={f.label}>
            <label className="text-gray-600 font-bold text-sm mb-1 block">{f.label}</label>
            <div className="flex items-center bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-gray-100">
              <span className="text-gray-400 mr-3">{f.icon}</span>
              <input type={f.type} placeholder={f.placeholder}
                className="flex-1 outline-none text-gray-700 bg-transparent"
                maxLength={f.max} value={f.value}
                onChange={e => f.onChange(e.target.value)}
              />
            </div>
          </div>
        ))}

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button onClick={handleRegister} disabled={loading}
          className="w-full py-4 rounded-2xl text-white font-black text-lg shadow-lg mt-2 active:scale-95 transition-transform"
          style={{ background: loading ? '#B0A0D4' : 'linear-gradient(135deg, #9B7FD4 0%, #6D4EC4 100%)' }}>
          {loading ? '🔄 생성 중...' : '다음 단계 ›'}
        </button>
      </div>

      <p className="text-gray-500 text-sm mt-5 text-center">
        이미 계정이 있으신가요?{' '}
        <Link to="/" className="text-purple-600 font-black">로그인</Link>
      </p>
    </div>
  );
}
