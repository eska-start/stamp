import React from 'react';
import { useNavigate } from 'react-router-dom';
import { C, SH } from '../lib/design';

export default function RewardEditor() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: C.bg, paddingBottom: 32 }}>
      <div style={{ background: C.soft, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => navigate('/parent')}
          style={{ width: 36, height: 36, borderRadius: 12, background: C.card, boxShadow: SH.card, color: C.t1, fontSize: 20, fontWeight: 700, border: 'none', cursor: 'pointer' }}
        >
          Back
        </button>
        <h1 style={{ flex: 1, textAlign: 'center', fontWeight: 900, fontSize: 18, color: C.t1, margin: 0 }}>보상 관리</h1>
        <div style={{ width: 36 }} />
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ background: C.card, borderRadius: 20, padding: 16, boxShadow: SH.card }}>
          <div style={{ fontWeight: 900, color: C.t1, marginBottom: 8 }}>보상 관리 화면 복구됨</div>
          <div style={{ color: C.t2, fontSize: 14 }}>배포 오류 방지를 위한 임시 복구 화면입니다.</div>
        </div>
      </div>
    </div>
  );
}
