import React from 'react';
import { useNavigate } from 'react-router-dom';
import { C, SH } from '../lib/design';

interface Props {
  kidName: string;
  streak:  number;
  stars:   number;
  showSettings?: boolean;
}

export default function ScreenHeader({ kidName, streak, stars, showSettings = false }: Props) {
  const navigate = useNavigate();
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 20px 12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 12, flexShrink: 0,
          background: C.accentSoft, color: C.accentDeep,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 16,
        }}>{kidName.slice(0, 1)}</div>
        <div>
          <div style={{ fontSize: 11, color: C.t3, fontWeight: 500 }}>안녕,</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.t1, lineHeight: 1.1 }}>{kidName}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        {streak > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: '#FFEFE5', padding: '5px 10px',
            borderRadius: 99, fontSize: 12, fontWeight: 700, color: '#FF7A3D',
          }}>🔥 {streak}일</div>
        )}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: '#FFF6D9', padding: '5px 10px',
          borderRadius: 99, fontSize: 12, fontWeight: 700, color: '#C98B00',
        }}>⭐ {stars}</div>
        {showSettings && (
          <button
            onClick={() => navigate('/parent')}
            style={{
              width: 34, height: 34, borderRadius: 10, border: 'none',
              background: C.card, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: SH.card, marginLeft: 2,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.t2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
