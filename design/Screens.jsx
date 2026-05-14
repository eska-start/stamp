// Screens.jsx — screen components for the design-canvas preview.
// Loaded after DesignCanvas.jsx; exposes globals via Object.assign(window,…)

const { useState } = React;

const C = {
  bg:'#F6F3EC', card:'#FFFFFF', soft:'#F1EDE4',
  t1:'#1F1A14', t2:'#6B6358', t3:'#A29888',
  accent:'#FF7F45', accentSoft:'#FFF0E5', accentDeep:'#E55E1F',
  success:'#4FB377', successSoft:'#E7F4EC', divider:'#ECE6D9',
};

// ─── Stamp metadata ───────────────────────────────────────────
const STAMP_META = {
  good:    { label:'GOOD!',    color:'#FF7F45', emoji:'⭐' },
  nice:    { label:'NICE!',    color:'#FFB800', emoji:'☀️'  },
  great:   { label:'GREAT!',   color:'#4FB377', emoji:'🌿' },
  wow:     { label:'WOW!',     color:'#E55E1F', emoji:'👑' },
  perfect: { label:'PERFECT!', color:'#339AF0', emoji:'💎' },
};

// ─── CSS (injected once) ──────────────────────────────────────
if (typeof document !== 'undefined' && !document.getElementById('sc-styles')) {
  const s = document.createElement('style');
  s.id = 'sc-styles';
  s.textContent = [
    '@keyframes sc-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}',
    '@keyframes sc-toast{0%{opacity:0;transform:translateX(-50%) translateY(10px)}',
    '15%,85%{opacity:1;transform:translateX(-50%) translateY(0)}',
    '100%{opacity:0;transform:translateX(-50%) translateY(-6px)}}',
    '.sc-float{animation:sc-float 3s ease-in-out infinite}',
    '.sc-toast{position:absolute;bottom:90px;left:50%;transform:translateX(-50%);',
    '  background:rgba(31,26,20,.88);color:#fff;padding:10px 20px;border-radius:20px;',
    '  font-size:13px;font-weight:700;white-space:nowrap;pointer-events:none;',
    '  z-index:200;animation:sc-toast 2.2s ease forwards}',
  ].join('');
  document.head.appendChild(s);
}

// ─── SVG icons ────────────────────────────────────────────────
const HomeIcon = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9L10 3l7 6v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9z"/>
    <path d="M7 19v-7h6v7"/>
  </svg>
);
const BookIcon = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 3h5a2 2 0 012 2v13a2 2 0 00-2-2H4V3z"/>
    <path d="M16 3h-5a2 2 0 00-2 2v13a2 2 0 012-2h5V3z"/>
  </svg>
);
const GiftIcon = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="8" width="16" height="12" rx="1"/>
    <path d="M1 8h18V6a1 1 0 00-1-1H2a1 1 0 00-1 1v2z"/>
    <path d="M10 5v15"/>
    <path d="M7 5a3 3 0 010-4c2 0 3 2 3 4"/>
    <path d="M13 5a3 3 0 000-4c-2 0-3 2-3 4"/>
  </svg>
);

// ─── IOSDevice — phone chrome ─────────────────────────────────
function IOSDevice({ width, height, dark=false, children }) {
  const inkColor = dark ? '#fff' : C.t1;
  return (
    <div style={{ width:'100%', height:'100%', background: C.bg, position:'relative',
      fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif',
      overflow:'hidden', boxSizing:'border-box' }}>
      {/* Status bar */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:44, zIndex:100,
        display:'flex', alignItems:'flex-end', padding:'0 20px 8px',
        justifyContent:'space-between', pointerEvents:'none' }}>
        <span style={{ fontSize:12, fontWeight:700, color:inkColor }}>9:41</span>
        {/* Dynamic island */}
        <div style={{ position:'absolute', top:10, left:'50%', transform:'translateX(-50%)',
          width:110, height:30, background: dark?'#000':'#1F1A14', borderRadius:20 }} />
        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
          <svg width="15" height="11" viewBox="0 0 15 11" fill={inkColor}>
            <rect x="0" y="3" width="2.5" height="8" rx="1" opacity=".4"/>
            <rect x="4" y="2" width="2.5" height="9" rx="1" opacity=".6"/>
            <rect x="8" y="0" width="2.5" height="11" rx="1" opacity=".8"/>
            <rect x="12" y="0" width="2.5" height="11" rx="1"/>
          </svg>
          <span style={{ fontSize:12, fontWeight:700, color:inkColor }}>100%</span>
        </div>
      </div>
      {/* Content */}
      <div style={{ position:'absolute', top:44, bottom:20, left:0, right:0, overflow:'hidden' }}>
        {children}
      </div>
      {/* Home indicator */}
      <div style={{ position:'absolute', bottom:6, left:'50%', transform:'translateX(-50%)',
        width:120, height:5, borderRadius:3,
        background: dark?'rgba(255,255,255,.3)':'rgba(0,0,0,.18)' }} />
    </div>
  );
}

// ─── TabBar ───────────────────────────────────────────────────
function TabBar({ active, onChange }) {
  const tabs = [
    { id:'home',   label:'홈',      Icon:HomeIcon },
    { id:'book',   label:'스탬프북', Icon:BookIcon },
    { id:'reward', label:'보상',     Icon:GiftIcon },
  ];
  return (
    <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'#fff',
      borderTop:`1px solid ${C.divider}`,
      boxShadow:'0 -2px 20px rgba(31,26,20,.06)', display:'flex', zIndex:50 }}>
      {tabs.map(({ id, label, Icon }) => {
        const on = active === id;
        return (
          <button key={id} onClick={() => onChange(id)}
            style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
              gap:3, background:'none', border:'none', cursor:'pointer',
              padding:'10px 0 8px', fontFamily:'inherit' }}>
            <div style={{ width:36, height:28, borderRadius:10,
              background: on ? C.accent : 'transparent',
              display:'flex', alignItems:'center', justifyContent:'center',
              transition:'background .15s' }}>
              <Icon size={18} color={on ? '#fff' : C.t3} />
            </div>
            <span style={{ fontSize:10, fontWeight: on?700:500, color: on?C.accent:C.t3 }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── PinOverlay ───────────────────────────────────────────────
function PinOverlay({ onSuccess, onClose }) {
  const [digits, setDigits] = useState([]);
  const [shake, setShake]   = useState(false);
  const DEMO_PIN = '1234';

  const add = (d) => {
    if (digits.length >= 4) return;
    const next = [...digits, d];
    setDigits(next);
    if (next.length === 4) {
      if (next.join('') === DEMO_PIN) { setTimeout(onSuccess, 300); }
      else { setShake(true); setTimeout(() => { setDigits([]); setShake(false); }, 600); }
    }
  };

  const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫'];
  return (
    <div style={{ position:'absolute', inset:0, background:C.bg, zIndex:80,
      display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'center', gap:24 }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontWeight:900, fontSize:12, color:C.accent,
          letterSpacing:'0.12em', marginBottom:8 }}>PARENT</div>
        <div style={{ fontWeight:900, fontSize:22, color:C.t1, marginBottom:4 }}>부모님 확인</div>
        <div style={{ color:C.t3, fontSize:13 }}>PIN: 1234 (데모)</div>
      </div>

      {/* Dots */}
      <div style={{ display:'flex', gap:14,
        transform: shake ? 'translateX(6px)' : 'none',
        transition: shake ? 'none' : 'transform .1s' }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ width:14, height:14, borderRadius:'50%',
            background: i < digits.length ? C.accent : C.divider,
            transition:'background .12s' }} />
        ))}
      </div>

      {/* Numpad */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, width:230 }}>
        {keys.map((k, i) => (
          <button key={i}
            onClick={() => { if (k === '⌫') setDigits(d => d.slice(0,-1)); else if (k) add(k); }}
            style={{ height:62, borderRadius:14,
              background: k==='' ? 'transparent' : C.card,
              border: k==='' ? 'none' : `1.5px solid ${C.divider}`,
              fontSize: k==='⌫' ? 20 : 24, fontWeight:600, color:C.t1,
              cursor: k==='' ? 'default' : 'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow: k==='' ? 'none' : '0 1px 2px rgba(31,26,20,.04)',
              fontFamily:'inherit' }}>
            {k}
          </button>
        ))}
      </div>
      <button onClick={onClose}
        style={{ background:'none', border:'none', cursor:'pointer',
          color:C.t3, fontSize:14, fontFamily:'inherit' }}>취소</button>
    </div>
  );
}

// ─── StampPicker bottom sheet ─────────────────────────────────
function StampPicker({ onPick, onClose }) {
  const stamps = Object.entries(STAMP_META).map(([type, m]) => ({ type, ...m }));
  return (
    <div style={{ position:'absolute', inset:0, zIndex:70 }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(31,26,20,.45)' }}
        onClick={onClose} />
      <div style={{ position:'absolute', bottom:0, left:0, right:0,
        background:C.card, borderRadius:'24px 24px 0 0', padding:'20px 18px 28px' }}>
        <div style={{ fontWeight:900, fontSize:17, color:C.t1, marginBottom:14 }}>도장 선택</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10 }}>
          {stamps.map(s => (
            <button key={s.type} onClick={() => onPick(s.type)}
              style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4,
                background:C.accentSoft, borderRadius:14, padding:'12px 4px',
                border:`2px solid ${s.color}44`, cursor:'pointer' }}>
              <span style={{ fontSize:26 }}>{s.emoji}</span>
              <span style={{ fontSize:8, fontWeight:700, color:s.color }}>{s.label}</span>
            </button>
          ))}
        </div>
        <button onClick={onClose}
          style={{ marginTop:12, width:'100%', background:C.soft, border:'none',
            borderRadius:12, padding:'12px 0', color:C.t2, fontWeight:700,
            fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>취소</button>
      </div>
    </div>
  );
}

// ─── LoginScreen ──────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [name, setName] = useState('태온');
  return (
    <div style={{ width:'100%', height:'100%', background:C.bg, display:'flex',
      flexDirection:'column', alignItems:'center', padding:'44px 24px 28px',
      boxSizing:'border-box', overflowY:'auto' }}>
      <div className="sc-float" style={{ fontSize:70, marginBottom:6 }}>🦕</div>
      <div style={{ fontWeight:900, fontSize:26, color:C.t1, marginBottom:4 }}>칭찬 스탬프북</div>
      <div style={{ color:C.t2, fontSize:14, marginBottom:32 }}>오늘도 멋진 하루 만들자!</div>

      <div style={{ width:'100%', background:C.card, borderRadius:20, padding:20,
        boxShadow:'0 1px 2px rgba(31,26,20,.04), 0 4px 14px rgba(31,26,20,.05)' }}>
        <div style={{ fontWeight:700, fontSize:13, color:C.t2, marginBottom:6 }}>아이 이름</div>
        <div style={{ display:'flex', alignItems:'center', background:C.soft, borderRadius:12,
          padding:'0 14px', border:`1.5px solid ${C.divider}`, marginBottom:14 }}>
          <input value={name} onChange={e => setName(e.target.value)}
            style={{ flex:1, background:'transparent', border:'none', outline:'none',
              padding:'12px 0', fontSize:15, color:C.t1, fontFamily:'inherit' }} />
        </div>
        <div style={{ fontWeight:700, fontSize:13, color:C.t2, marginBottom:6 }}>부모 PIN</div>
        <div style={{ display:'flex', alignItems:'center', background:C.soft, borderRadius:12,
          padding:'0 14px', border:`1.5px solid ${C.divider}`, marginBottom:16 }}>
          <input type="password" defaultValue="1234" maxLength={4}
            style={{ flex:1, background:'transparent', border:'none', outline:'none',
              padding:'12px 0', fontSize:15, color:C.t1, fontFamily:'inherit' }} />
        </div>
        <button onClick={onLogin}
          style={{ width:'100%', background:C.accent, color:'#fff', border:'none',
            borderRadius:14, padding:'14px 0', fontWeight:900, fontSize:16,
            cursor:'pointer', boxShadow:'0 2px 8px rgba(255,127,69,.3)',
            fontFamily:'inherit' }}>시작하기 →</button>
      </div>

      <div style={{ marginTop:18, color:C.t3, fontSize:13 }}>
        계정이 없으신가요?{' '}
        <span style={{ color:C.accent, fontWeight:700, cursor:'pointer' }}>회원가입</span>
      </div>
    </div>
  );
}

// ─── HomeScreen ───────────────────────────────────────────────
function HomeScreen({ ctx, onTab }) {
  const { state, setState } = ctx;
  const [pending, setPending] = useState(new Set());
  const [showPin,    setShowPin]    = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const toggle = (id) => {
    const m = state.missions.find(m => m.id === id);
    if (m?.done) return;
    setPending(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const onStamp = (type) => {
    setState(s => {
      const stamps = [...s.stamps];
      const idx = stamps.indexOf(null);
      if (idx >= 0) stamps[idx] = type;
      return {
        ...s, stamps,
        missions: s.missions.map(m =>
          pending.has(m.id) ? { ...m, done:true, completed:m.target } : m),
      };
    });
    setPending(new Set());
    setShowPicker(false);
    ctx.showToast('도장을 받았어요! 🎉');
  };

  const count = pending.size;

  return (
    <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column',
      background:C.bg, position:'relative' }}>
      {/* Header */}
      <div style={{ background:C.soft, padding:'10px 18px 14px', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:C.accentSoft,
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:22,
              border:`2px solid ${C.accent}33` }}>🦕</div>
            <div style={{ fontWeight:900, fontSize:16, color:C.t1 }}>{state.user}</div>
          </div>
          <div style={{ display:'flex', gap:6 }}>
            <span style={{ background:C.accentSoft, color:C.accent, fontWeight:700,
              fontSize:11, padding:'4px 10px', borderRadius:10 }}>🔥 {state.streak}일</span>
            <span style={{ background:C.soft, color:C.t1, fontWeight:700,
              fontSize:11, padding:'4px 10px', borderRadius:10 }}>⭐ {state.stars}</span>
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex:1, overflowY:'auto', padding:'14px 14px 100px' }}>
        <div style={{ fontWeight:900, fontSize:18, color:C.t1, marginBottom:12 }}>오늘의 미션</div>

        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {state.missions.map(m => {
            const sel = pending.has(m.id);
            return (
              <div key={m.id} onClick={() => toggle(m.id)}
                style={{ background: m.done ? C.successSoft : sel ? C.accentSoft : C.card,
                  borderRadius:16, padding:'14px 14px',
                  display:'flex', alignItems:'center', gap:12,
                  border:`1.5px solid ${m.done ? C.success+'44' : sel ? C.accent : C.divider}`,
                  cursor: m.done ? 'default' : 'pointer', transition:'all .12s' }}>
                <div style={{ width:44, height:44, borderRadius:14, background:m.bg,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:24, flexShrink:0 }}>{m.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:15,
                    color: m.done ? C.success : C.t1,
                    textDecoration: m.done ? 'line-through' : 'none' }}>{m.title}</div>
                  <div style={{ fontSize:12, marginTop:2,
                    color: m.done ? C.success : sel ? C.accent : C.t3 }}>
                    {m.done ? '완료! ✓' : sel ? '선택됨' : '탭해서 선택'}
                  </div>
                </div>
                <div style={{ width:22, height:22, borderRadius:'50%', flexShrink:0,
                  background: m.done ? C.success : sel ? C.accent : C.divider,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  transition:'background .15s' }}>
                  {(m.done || sel) && (
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M2 5.5l2.5 2.5 4.5-4.5" stroke="#fff"
                        strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stamp book teaser */}
        <div onClick={() => onTab('book')}
          style={{ marginTop:14, background:C.card, borderRadius:16, padding:'14px 16px',
            display:'flex', alignItems:'center', gap:12,
            boxShadow:'0 1px 2px rgba(31,26,20,.04), 0 4px 14px rgba(31,26,20,.05)',
            cursor:'pointer', border:`1.5px solid ${C.divider}` }}>
          <div style={{ fontSize:32 }}>📖</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, color:C.t1, fontSize:14 }}>스탬프북 보기</div>
            <div style={{ color:C.t3, fontSize:12 }}>스탬프 {state.stamps.filter(Boolean).length}개 모았어요!</div>
          </div>
          <span style={{ color:C.t3, fontSize:20 }}>›</span>
        </div>
      </div>

      {/* Floating CTA */}
      {count > 0 && (
        <div style={{ position:'absolute', bottom:52, left:12, right:12 }}>
          <button onClick={() => setShowPin(true)}
            style={{ width:'100%', background:C.accent, color:'#fff', border:'none',
              borderRadius:16, padding:'15px 0', fontWeight:900, fontSize:16,
              cursor:'pointer', boxShadow:'0 4px 16px rgba(255,127,69,.4)',
              fontFamily:'inherit' }}>
            도장 요청하기 ({count})
          </button>
        </div>
      )}

      {showPin    && <PinOverlay onSuccess={() => { setShowPin(false); setShowPicker(true); }} onClose={() => setShowPin(false)} />}
      {showPicker && <StampPicker onPick={onStamp} onClose={() => setShowPicker(false)} />}
    </div>
  );
}

// ─── StampBookScreen ──────────────────────────────────────────
function StampBookScreen({ ctx }) {
  const { state } = ctx;
  const total = state.stamps.filter(Boolean).length;

  return (
    <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column',
      background:C.bg, position:'relative' }}>
      <div style={{ background:C.soft, padding:'10px 18px 14px', flexShrink:0, textAlign:'center' }}>
        <div style={{ fontWeight:900, fontSize:18, color:C.t1 }}>스탬프북</div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'14px 14px 80px' }}>
        {/* Stats */}
        <div style={{ display:'flex', gap:8, marginBottom:14 }}>
          {[
            { label:'총 스탬프', value: total },
            { label:'보유 별',   value:`⭐ ${state.stars}` },
            { label:'연속',      value:`🔥 ${state.streak}` },
          ].map(s => (
            <div key={s.label} style={{ flex:1, background:C.card, borderRadius:14,
              padding:'10px 0', textAlign:'center',
              boxShadow:'0 1px 2px rgba(31,26,20,.04)' }}>
              <div style={{ fontWeight:900, fontSize:16, color:C.t1 }}>{s.value}</div>
              <div style={{ fontSize:10, color:C.t3, marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Stamp grid */}
        <div style={{ background:C.soft, borderRadius:20, padding:'14px 12px 18px',
          border:`2px solid ${C.divider}` }}>
          <div style={{ textAlign:'center', fontWeight:900, color:C.t2, fontSize:14,
            marginBottom:12 }}>— 나의 스탬프북 —</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {state.stamps.map((type, i) => {
              const meta = type ? STAMP_META[type] : null;
              return (
                <div key={i} style={{ aspectRatio:'1', borderRadius:'50%',
                  display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'center',
                  background: meta ? C.accentSoft : C.card,
                  border: meta ? `3px solid ${meta.color}` : `2px dashed ${C.divider}` }}>
                  {meta ? (
                    <>
                      <div style={{ fontSize:22 }}>{meta.emoji}</div>
                      <div style={{ fontSize:7, fontWeight:700, color:meta.color, marginTop:2 }}>{meta.label}</div>
                    </>
                  ) : (
                    <div style={{ width:14, height:14, borderRadius:'50%', background:C.divider }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tips */}
        <div style={{ marginTop:14, background:C.accentSoft, borderRadius:18, padding:14,
          border:`1.5px solid ${C.accent}22`, display:'flex', alignItems:'flex-start', gap:10 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:900, color:C.accent, fontSize:13, marginBottom:6 }}>⭐ 스탬프 모으는 방법!</div>
            {['매일 미션을 완료하면 스탬프 획득','연속 성공으로 추가 스탬프!','이벤트 참여로 한정 스탬프!'].map((t,i) => (
              <div key={i} style={{ fontSize:12, color:C.accentDeep, marginBottom:3, display:'flex', gap:6 }}>
                <span style={{ color:C.accent }}>✓</span>{t}
              </div>
            ))}
          </div>
          <div className="sc-float" style={{ fontSize:38 }}>🦕</div>
        </div>
      </div>
    </div>
  );
}

// ─── RewardScreen ─────────────────────────────────────────────
function RewardScreen({ ctx }) {
  const { state, setState } = ctx;

  const redeem = (r) => {
    if (state.stars < r.cost) return;
    setState(s => ({ ...s, stars: s.stars - r.cost, redeemed: (s.redeemed || 0) + 1 }));
    ctx.showToast(`${r.name} 교환 완료! 🎉`);
  };

  return (
    <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column',
      background:C.bg, position:'relative' }}>
      <div style={{ background:C.soft, padding:'10px 18px 14px', flexShrink:0, textAlign:'center' }}>
        <div style={{ fontWeight:900, fontSize:18, color:C.t1 }}>보상</div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'14px 14px 80px' }}>
        {/* Stats */}
        <div style={{ display:'flex', gap:8, marginBottom:14 }}>
          {[
            { emoji:'⭐', label:'보유 별',   value: state.stars },
            { emoji:'🎁', label:'획득한 선물', value: state.redeemed || 0 },
          ].map(s => (
            <div key={s.label} style={{ flex:1, background:C.card, borderRadius:16,
              padding:'12px 14px', display:'flex', alignItems:'center', gap:10,
              boxShadow:'0 1px 2px rgba(31,26,20,.04)' }}>
              <span style={{ fontSize:26 }}>{s.emoji}</span>
              <div>
                <div style={{ fontWeight:900, fontSize:18, color:C.t1 }}>{s.value}</div>
                <div style={{ fontSize:11, color:C.t3 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontWeight:900, fontSize:15, color:C.t1, marginBottom:10 }}>
          별로 교환할 수 있는 선물들 ✨
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {state.rewards.map(r => {
            const can = state.stars >= r.cost;
            return (
              <div key={r.id} style={{ background:C.card, borderRadius:18, padding:'12px 14px',
                display:'flex', alignItems:'center', gap:12,
                boxShadow:'0 1px 2px rgba(31,26,20,.04)' }}>
                <div style={{ width:52, height:52, borderRadius:16, background:r.bg,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:30, flexShrink:0 }}>{r.emoji}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:900, fontSize:14, color:C.t1 }}>{r.name}</div>
                  <div style={{ color:C.t2, fontSize:12, marginTop:1 }}>{r.desc}</div>
                  <div style={{ fontWeight:700, fontSize:12, color:C.t1, marginTop:3 }}>⭐ {r.cost}</div>
                </div>
                <button onClick={() => redeem(r)} disabled={!can}
                  style={{ padding:'8px 14px', borderRadius:12, fontWeight:900, fontSize:12,
                    border:'none', cursor: can?'pointer':'default',
                    background: can ? C.accent : C.divider,
                    color: can ? '#fff' : C.t3,
                    boxShadow: can ? '0 2px 8px rgba(255,127,69,.3)' : 'none',
                    fontFamily:'inherit', whiteSpace:'nowrap' }}>교환</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  IOSDevice, TabBar,
  LoginScreen, HomeScreen, StampBookScreen, RewardScreen,
  PinOverlay, StampPicker,
});
