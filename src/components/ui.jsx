import React, { useState, useEffect, useRef } from 'react';
import { ChessScene } from '../engine/ChessScene.js';

// ============================================================================
// SUMI-E / GHIBLI DARK UI — Warm ink-wash palette with washi paper feel
// Rich dark browns, aged cream, gold-leaf accents
// ============================================================================

const FONT = 'Georgia, "Times New Roman", serif';

// Warm layered panel style — like washi paper by lamplight
export const panelStyle = `
  bg-gradient-to-br from-[#1e1610] via-[#1a1410] to-[#16120e]
  border-2 border-[#4a3520]
  rounded-2xl
  shadow-[2px_2px_0_0_rgba(0,0,0,0.5),inset_0_1px_8px_rgba(180,140,80,0.06)]
`;

// Lacquerware-style buttons with warm tactile feel
export function BrainButton({ children, onClick, variant = 'primary', size = 'md', className = '', disabled = false }) {
  const variants = {
    primary: 'bg-gradient-to-b from-[#5c3a18] via-[#4a2c10] to-[#3a2008] border-[#2a1808] hover:from-[#6c4a28] text-[#ede4d0]',
    success: 'bg-gradient-to-b from-[#2a4830] via-[#1c3820] to-[#0e2810] border-[#0a1a08] hover:from-[#3a5840] text-[#d0e8d4]',
    secondary: 'bg-gradient-to-b from-[#3a3428] via-[#2a2418] to-[#1a1810] border-[#0e0a08] hover:from-[#4a4438] text-[#d0ccbe]',
    danger: 'bg-gradient-to-b from-[#5a2218] via-[#481810] to-[#381008] border-[#2a0808] hover:from-[#6a3228] text-[#e8d0c8]',
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-3 text-base',
    lg: 'px-7 py-4 text-xl',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        font-bold rounded-xl ${variants[variant]} border-2
        shadow-[2px_2px_0_0_rgba(0,0,0,0.5)]
        transition-all duration-75
        active:translate-x-[1px] active:translate-y-[1px] active:shadow-none
        disabled:opacity-50 disabled:pointer-events-none
        ${sizes[size]} ${className}
      `}
      style={{ fontFamily: FONT, letterSpacing: '0.02em' }}
    >
      {children}
    </button>
  );
}

// Paper texture overlay
export function PaperTexture() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-10"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.05,
        mixBlendMode: 'overlay'
      }}
    />
  );
}

// Portrait orientation warning — asks mobile users to rotate to landscape
export function PortraitWarning() {
  const [isPortrait, setIsPortrait] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const mobile = /android|iphone|ipad|ipod|windows phone/.test(ua);
    setIsMobileDevice(mobile);
    if (!mobile) return;

    const check = () => setIsPortrait(window.innerHeight > window.innerWidth);
    check();
    window.addEventListener('resize', check);
    // Also listen for orientation change (some browsers fire this first)
    window.addEventListener('orientationchange', () => setTimeout(check, 100));
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);

  if (!isMobileDevice || !isPortrait) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6"
         style={{ background: 'linear-gradient(160deg, #0e0c0a 0%, #1a1612 50%, #0e0c0a 100%)' }}>
      <div className="text-center">
        {/* Rotate phone icon */}
        <div className="mb-6 inline-block animate-pulse">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Phone outline (portrait) */}
            <rect x="24" y="10" width="32" height="52" rx="4" stroke="#ffd050" strokeWidth="2" fill="none" opacity="0.3" />
            {/* Phone outline (landscape, rotated) */}
            <rect x="14" y="24" width="52" height="32" rx="4" stroke="#ffd050" strokeWidth="2.5" fill="none" />
            {/* Rotation arrow */}
            <path d="M58 18 Q 66 18 66 26" stroke="#d4a850" strokeWidth="2" fill="none" strokeLinecap="round" />
            <polyline points="63,26 66,26 66,23" stroke="#d4a850" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[#ede4d0] mb-2" style={{ fontFamily: FONT }}>
          Rotate to Landscape
        </h2>
        <p className="text-[#a08860] text-sm max-w-[260px] mx-auto" style={{ fontFamily: FONT }}>
          Turn your phone sideways for the best experience. The 3D board requires landscape orientation.
        </p>
      </div>
    </div>
  );
}

// 3D Chess board wrapper
export function ChessBoard({ pieces, selected, validMoves, hintPiece, hintSquare, showMove, onSquareClick, sceneRef }) {
  const containerRef = useRef(null);
  const callbackRef = useRef(onSquareClick);

  useEffect(() => { callbackRef.current = onSquareClick; }, [onSquareClick]);

  useEffect(() => {
    if (!containerRef.current) return;
    sceneRef.current = new ChessScene(containerRef.current, (f, r, t) => callbackRef.current?.(f, r, t));
    return () => { sceneRef.current?.dispose(); sceneRef.current = null; };
  }, [sceneRef]);

  useEffect(() => { sceneRef.current?.setPieces(pieces); }, [pieces, sceneRef]);
  useEffect(() => { sceneRef.current?.setSelection(selected, validMoves); }, [selected, validMoves, sceneRef]);
  useEffect(() => { sceneRef.current?.setHints(hintPiece, hintSquare); }, [hintPiece, hintSquare, sceneRef]);
  useEffect(() => {
    if (showMove) sceneRef.current?.showCorrectMove(showMove.from, showMove.to);
    else sceneRef.current?.clearCorrectMove();
  }, [showMove, sceneRef]);

  return <div ref={containerRef} className="w-full h-full" style={{ touchAction: 'none' }} />;
}

// ============================================================================
// GAMEPLAY UI — Compact single-line stats at top, prompt+hints at bottom
// ============================================================================

// Japanese house silhouette SVG — custom icon for home/menu button
function JapaneseHouseIcon({ size = 32, color = '#ffd050' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Curved Japanese roof */}
      <path d="M16 3 L4 13 Q2 14 3 15 L5 15 L5 27 L27 27 L27 15 L29 15 Q30 14 28 13 Z"
            fill={color} opacity="0.15" />
      <path d="M16 3 L4 13 Q2 14 3 15 L5 15" stroke={color} strokeWidth="1.5" fill="none"
            strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 3 L28 13 Q30 14 29 15 L27 15" stroke={color} strokeWidth="1.5" fill="none"
            strokeLinecap="round" strokeLinejoin="round" />
      {/* Eave extensions — curved upward like Japanese roof */}
      <path d="M3 15 Q1.5 14.5 1 13" stroke={color} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M29 15 Q30.5 14.5 31 13" stroke={color} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      {/* Walls */}
      <path d="M5 15 L5 27 L27 27 L27 15" stroke={color} strokeWidth="1.5" fill="none"
            strokeLinecap="round" strokeLinejoin="round" />
      {/* Door — shoji style */}
      <rect x="12" y="18" width="8" height="9" stroke={color} strokeWidth="1.2" fill="none" rx="0.5" />
      <line x1="16" y1="18" x2="16" y2="27" stroke={color} strokeWidth="0.8" />
      <line x1="12" y1="22" x2="20" y2="22" stroke={color} strokeWidth="0.8" />
    </svg>
  );
}

// Fullscreen toggle button — uses Fullscreen API
function FullscreenButton() {
  const [isFS, setIsFS] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFS(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggle = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  // Only show if Fullscreen API is available
  if (!document.documentElement.requestFullscreen) return null;

  return (
    <button
      onClick={toggle}
      className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg
                 bg-[#0e0c0a]/50 hover:bg-[#0e0c0a]/70 border border-[#4a3520]/40
                 transition-colors active:scale-95"
      title={isFS ? "Exit fullscreen" : "Fullscreen"}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        {isFS ? (
          // Exit fullscreen icon (inward arrows)
          <>
            <polyline points="6,1 6,6 1,6" stroke="#ffd050" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="10,1 10,6 15,6" stroke="#ffd050" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="6,15 6,10 1,10" stroke="#ffd050" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="10,15 10,10 15,10" stroke="#ffd050" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : (
          // Fullscreen icon (outward arrows at corners)
          <>
            <polyline points="1,6 1,1 6,1" stroke="#ffd050" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="10,1 15,1 15,6" stroke="#ffd050" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="15,10 15,15 10,15" stroke="#ffd050" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="6,15 1,15 1,10" stroke="#ffd050" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
      </svg>
    </button>
  );
}

// Navigation bar during gameplay — home button + fullscreen + mode indicator
export function GameNav({ mode, openingName, onHome }) {
  return (
    <div className="absolute top-0 left-0 z-40 flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2">
      <button
        onClick={onHome}
        className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg
                   bg-[#0e0c0a]/50 hover:bg-[#0e0c0a]/70 border border-[#4a3520]/40
                   transition-colors active:scale-95"
        title="Return to menu"
      >
        <JapaneseHouseIcon size={20} color="#ffd050" />
      </button>
      <FullscreenButton />
      <span className="text-[#ffd050] text-xs sm:text-sm font-bold" style={{ fontFamily: FONT, letterSpacing: '0.06em' }}>
        {mode}
      </span>
      {openingName && (
        <>
          <span className="text-[#3a2e20]">|</span>
          <span className="text-[#a08860] text-xs sm:text-sm font-semibold truncate max-w-[120px] sm:max-w-[200px]"
                style={{ fontFamily: FONT }}>
            {openingName}
          </span>
        </>
      )}
    </div>
  );
}

// Lighting control panel — collapsible dropdown from a lightbulb button
export function LightingPanel({ sceneRef }) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({
    hemisphere: 1.00,
    readingLamp: 15.0,
    cameraFill: 5.0,
    cameraFillHigh: 5.0,
    stationaryLanterns: 2.0,
    passingLanterns: 0.50,
    boardGlow: 0.15,
    pieceGlow: 0.12,
  });

  // Sync from scene on open
  useEffect(() => {
    if (open && sceneRef.current) {
      setValues(sceneRef.current.getLightIntensities());
    }
  }, [open, sceneRef]);

  const lights = [
    { key: 'hemisphere', label: 'Ambient', step: 0.05, min: 0, max: 2.0 },
    { key: 'readingLamp', label: 'Lamp', step: 0.5, min: 0, max: 25.0 },
    { key: 'cameraFill', label: 'Fill', step: 0.2, min: 0, max: 10.0 },
    { key: 'cameraFillHigh', label: 'Fill 2', step: 0.2, min: 0, max: 10.0 },
    { key: 'stationaryLanterns', label: 'Lanterns', step: 0.1, min: 0, max: 5.0 },
    { key: 'passingLanterns', label: 'Passing', step: 0.1, min: 0, max: 5.0 },
    { key: 'boardGlow', label: 'Brd Glow', step: 0.02, min: 0, max: 1.0 },
    { key: 'pieceGlow', label: 'Pc Glow', step: 0.02, min: 0, max: 1.0 },
  ];

  const update = (key, newVal) => {
    const spec = lights.find(l => l.key === key);
    const v = Math.max(spec.min, Math.min(spec.max, Math.round(newVal * 100) / 100));
    setValues(prev => ({ ...prev, [key]: v }));
    sceneRef.current?.setLightIntensity(key, v);
  };

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg
                   bg-[#0e0c0a]/50 hover:bg-[#0e0c0a]/70 border border-[#4a3520]/40
                   transition-colors active:scale-95 ${open ? 'border-[#d4a850]/60' : ''}`}
        title="Lighting controls"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 1.5 C5.24 1.5 3 3.74 3 6.5 C3 8.28 3.93 9.84 5.33 10.7 L5.33 12.5 C5.33 13.33 6 14 6.83 14 L9.17 14 C10 14 10.67 13.33 10.67 12.5 L10.67 10.7 C12.07 9.84 13 8.28 13 6.5 C13 3.74 10.76 1.5 8 1.5Z" stroke="#ffd050" strokeWidth="1.3" fill="none" />
          <line x1="6" y1="11.5" x2="10" y2="11.5" stroke="#ffd050" strokeWidth="0.8" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 bg-[#141210]/95 border border-[#4a3520]/60 rounded-xl p-2 shadow-lg backdrop-blur-sm z-50"
             style={{ minWidth: '250px' }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[#ffd050] text-[10px] font-bold uppercase" style={{ letterSpacing: '0.08em' }}>Lights</span>
            <button onClick={() => setOpen(false)} className="text-[#5a4a30] hover:text-[#a08860] text-sm leading-none px-1">x</button>
          </div>
          <div className="space-y-1">
            {lights.map(({ key, label, step, max }) => (
              <div key={key} className="flex items-center gap-1">
                <span className="text-[#a08860] text-[9px] w-[60px] shrink-0 text-right pr-1" style={{ fontFamily: FONT }}>
                  {label} <span className="text-[#6a5a40]">({max})</span>
                </span>
                <button
                  onClick={() => update(key, 0)}
                  className="w-6 h-5 flex items-center justify-center rounded bg-[#3a1a18] hover:bg-[#4a2a28] text-[#c87878] text-[8px] font-bold active:scale-90 transition-transform"
                >OFF</button>
                <button
                  onClick={() => update(key, values[key] - step)}
                  className="w-5 h-5 flex items-center justify-center rounded bg-[#2a2418] hover:bg-[#3a3020] text-[#d4a850] text-xs font-bold active:scale-90 transition-transform"
                >-</button>
                <input
                  type="text"
                  value={values[key].toFixed(2)}
                  onChange={(e) => {
                    const parsed = parseFloat(e.target.value);
                    if (!isNaN(parsed)) update(key, parsed);
                  }}
                  className="w-[44px] h-5 text-center text-[10px] font-bold text-[#ede4d0] bg-[#0e0c0a]/60 border border-[#3a2e1a] rounded px-0.5
                             focus:outline-none focus:border-[#d4a850]"
                  style={{ fontFamily: FONT }}
                />
                <button
                  onClick={() => update(key, values[key] + step)}
                  className="w-5 h-5 flex items-center justify-center rounded bg-[#2a2418] hover:bg-[#3a3020] text-[#d4a850] text-xs font-bold active:scale-90 transition-transform"
                >+</button>
                <button
                  onClick={() => update(key, max)}
                  className="w-6 h-5 flex items-center justify-center rounded bg-[#1a3820] hover:bg-[#2a4830] text-[#78c880] text-[8px] font-bold active:scale-90 transition-transform"
                >MAX</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// Stats bar — larger, more legible strip at the top edge, with lighting controls
export function StatsBar({ score, streak, round, isTimed, isFSRS, sceneRef }) {
  return (
    <div className="absolute top-0 left-0 right-0 z-30">
      <div className="flex items-center justify-end gap-1.5 px-3 py-2 sm:py-2.5 border-b border-[#3a2e1a]/30 relative"
           style={{ background: 'linear-gradient(180deg, rgba(14,12,10,0.92) 0%, rgba(14,12,10,0.75) 60%, rgba(14,12,10,0.3) 90%, transparent 100%)' }}>
        {isTimed && (
          <>
            <span className="text-[#a08860] text-sm sm:text-base uppercase" style={{ letterSpacing: '0.05em' }}>Scr</span>
            <span className="text-[#d4a850] text-lg sm:text-2xl font-bold ml-0.5" style={{ fontFamily: FONT }}>{score}</span>
            <span className="text-[#3a2e20] mx-1.5">|</span>
            <span className="text-[#a08860] text-sm sm:text-base uppercase" style={{ letterSpacing: '0.05em' }}>Str</span>
            <span className="text-[#d4a850] text-lg sm:text-2xl font-bold ml-0.5" style={{ fontFamily: FONT }}>{streak}</span>
            <span className="text-[#3a2e20] mx-1.5">|</span>
          </>
        )}
        {isFSRS && (
          <>
            <span className="text-[#5a9060] text-sm sm:text-base font-bold uppercase" style={{ letterSpacing: '0.05em' }}>SRS</span>
            <span className="text-[#3a2e20] mx-1.5">|</span>
          </>
        )}
        <span className="text-[#a08860] text-sm sm:text-base uppercase" style={{ letterSpacing: '0.05em' }}>Rd</span>
        <span className="text-[#ede4d0] text-lg sm:text-2xl font-bold ml-0.5" style={{ fontFamily: FONT }}>{round}</span>
        {sceneRef && (
          <>
            <span className="text-[#3a2e20] mx-1">|</span>
            <LightingPanel sceneRef={sceneRef} />
          </>
        )}
      </div>
    </div>
  );
}

// Combined prompt + timer + hints at the bottom of the screen
export function PromptBar({ prompt, shortTip, timeLeft, maxTime, isTimed, hintLevel, selected, validMoves }) {
  const pct = isTimed ? (timeLeft / maxTime) * 100 : 100;
  const barColor = pct > 40 ? 'bg-[#3a6838]' : pct > 20 ? 'bg-[#8a6828]' : 'bg-[#8a2828]';

  // Determine hint message and accent color
  let hintMsg = null;
  let hintAccent = '';
  if (hintLevel >= 2) {
    hintMsg = "Move to the blue square!";
    hintAccent = 'text-[#68b8d8]';
  } else if (hintLevel >= 1) {
    hintMsg = "Try the golden piece!";
    hintAccent = 'text-[#d4a850]';
  } else if (selected && validMoves?.length > 0) {
    hintMsg = "Tap a green square to move";
    hintAccent = 'text-[#78b878]';
  } else if (selected) {
    hintMsg = "Try another piece";
    hintAccent = 'text-[#a08860]';
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 pb-2 sm:pb-3 px-2 sm:px-3">
      <div className="max-w-xl mx-auto">
        <div className="bg-gradient-to-br from-[#1e1610]/90 via-[#1a1410]/90 to-[#16120e]/90 backdrop-blur-sm
                        border border-[#4a3520]/60 rounded-xl px-5 py-3 sm:px-6 sm:py-3.5
                        shadow-[0_-2px_12px_rgba(0,0,0,0.4)]">
          {isTimed && (
            <div className="h-[3px] bg-[#2a2018] rounded-full overflow-hidden mb-1.5 border border-[#3a3020]/30">
              <div className={`h-full rounded-full transition-all duration-100 ${barColor}`} style={{ width: `${pct}%` }} />
            </div>
          )}
          <p className="text-[#ede4d0] font-semibold text-center text-lg sm:text-xl" style={{ fontFamily: FONT }}>
            {prompt}
          </p>
          {shortTip && !hintMsg && (
            <p className="text-[#a08860] text-center text-base sm:text-lg mt-0.5" style={{ fontFamily: FONT }}>
              {shortTip}
            </p>
          )}
          {hintMsg && (
            <p className={`${hintAccent} text-center text-base sm:text-lg mt-1 font-semibold`} style={{ fontFamily: FONT }}>
              {hintMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// HintBar is now merged into PromptBar — keep export for backwards compatibility
export function HintBar() {
  return null;
}

// Correct/wrong feedback flash
export function Feedback({ type, visible }) {
  if (!visible) return null;
  const isCorrect = type === 'correct';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className={`absolute inset-0 ${isCorrect ? 'bg-[#1a3a20]' : 'bg-[#3a1a18]'} opacity-15`} />
      <div className={`${panelStyle} px-6 sm:px-10 py-3 sm:py-5 ${isCorrect ? 'border-[#3a6838]' : 'border-[#6a2828]'}`}>
        <div className="text-center">
          <div className="text-3xl sm:text-5xl mb-1 text-[#ede4d0]" style={{ fontFamily: FONT }}>{isCorrect ? 'Correct' : 'Not quite'}</div>
          <span className={`text-sm sm:text-lg font-bold ${isCorrect ? 'text-[#78c880]' : 'text-[#c87878]'}`} style={{ fontFamily: FONT }}>
            {isCorrect ? 'Well played!' : 'Let\'s see the answer...'}
          </span>
        </div>
      </div>
    </div>
  );
}

// Explanation panel after each move
// On small screens (<640px): full-screen overlay for readability
// On desktop (>=640px): bottom sheet as before
export function Explanation({ text, name, moveNotation, san, visible, onClose, isFSRS, onFSRSGrade }) {
  if (!visible) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 sm:bg-black/40 z-35" onClick={onClose} />

      {/* Mobile: full-screen centered | Desktop: bottom sheet */}
      <div className="fixed inset-0 z-40 flex items-center justify-center p-3
                      sm:inset-auto sm:bottom-0 sm:left-0 sm:right-0 sm:p-2 sm:pb-2.5 sm:flex-none">
        <div className="max-w-xl w-full sm:mx-auto">
          <div className={`${panelStyle} p-4 sm:p-3`}>
            <div className="flex items-center gap-2 mb-2 sm:mb-1.5">
              <span className="bg-[#3a2e1a] text-[#d4a850] px-2.5 py-1 sm:px-2 sm:py-0.5 rounded-full text-xs sm:text-[9px] font-bold shrink-0"
                    style={{ letterSpacing: '0.03em' }}>{name}</span>
              <span className="text-lg sm:text-base font-bold text-[#ede4d0]" style={{ fontFamily: FONT }}>{san}</span>
              <span className="text-[#a08860] text-sm sm:text-xs">{moveNotation}</span>
              {!isFSRS && <button onClick={onClose} className="text-[#5a4a30] hover:text-[#a08860] text-xl sm:text-lg leading-none ml-auto p-1 sm:p-0.5">x</button>}
            </div>

            <div className="text-[#c8b898] leading-relaxed sm:leading-snug mb-3 sm:mb-2 max-h-[60vh] sm:max-h-40 overflow-y-auto text-base sm:text-sm" style={{ fontFamily: FONT }}>
              {text.split('\n\n').map((para, i) => (
                <p key={i} className="mb-2 sm:mb-1.5 last:mb-0">{para}</p>
              ))}
            </div>

            {isFSRS ? (
              <div>
                <p className="text-[#a08860] text-xs sm:text-[10px] text-center mb-2 sm:mb-1.5" style={{ letterSpacing: '0.03em' }}>How well did you know this?</p>
                <div className="grid grid-cols-4 gap-2 sm:gap-1.5">
                  <button onClick={() => onFSRSGrade(1)} className="bg-[#4a2018] hover:bg-[#5a3028] text-[#e8d0c8] py-2.5 sm:py-1.5 rounded-lg text-sm sm:text-xs font-bold active:scale-95 transition-transform" style={{ fontFamily: FONT }}>Again</button>
                  <button onClick={() => onFSRSGrade(2)} className="bg-[#4a3818] hover:bg-[#5a4828] text-[#e8d8b8] py-2.5 sm:py-1.5 rounded-lg text-sm sm:text-xs font-bold active:scale-95 transition-transform" style={{ fontFamily: FONT }}>Hard</button>
                  <button onClick={() => onFSRSGrade(3)} className="bg-[#1a3820] hover:bg-[#2a4830] text-[#d0e8d4] py-2.5 sm:py-1.5 rounded-lg text-sm sm:text-xs font-bold active:scale-95 transition-transform" style={{ fontFamily: FONT }}>Good</button>
                  <button onClick={() => onFSRSGrade(4)} className="bg-[#1a3848] hover:bg-[#2a4858] text-[#c8e0e8] py-2.5 sm:py-1.5 rounded-lg text-sm sm:text-xs font-bold active:scale-95 transition-transform" style={{ fontFamily: FONT }}>Easy</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-[#6a5a40] text-xs sm:text-[10px]">Correct move highlighted in blue</p>
                <button onClick={onClose} className="bg-[#1a3820] hover:bg-[#2a4830] text-[#d0e8d4] px-5 py-2 sm:px-4 sm:py-1.5 rounded-lg text-sm sm:text-xs font-bold active:scale-95 transition-transform" style={{ fontFamily: FONT }}>
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================================
// START SCREEN / MAIN MENU
// ============================================================================

export function StartScreen({ onStartTimed, onStartUntimed, onStartFSRS, onSelectOpening, highScore, selectedOpening, dueCount, openingsData, onShowProgress }) {
  const [showOpenings, setShowOpenings] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
         style={{ background: 'linear-gradient(160deg, #0e0c0a 0%, #1a1612 50%, #0e0c0a 100%)' }}>
      <PaperTexture />

      <div className={`${panelStyle} p-4 sm:p-6 max-w-md w-full relative z-20 my-auto`}>
        <div className="text-center mb-4 sm:mb-5">
          <div className="inline-block bg-[#3a2e1a] text-[#d4a850] px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold mb-2"
               style={{ letterSpacing: '0.12em' }}>
            CHESS TRAINING
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#ede4d0] mb-1" style={{ fontFamily: FONT, letterSpacing: '0.02em' }}>
            Opening Trainer
          </h1>
          <p className="text-[#a08860] text-xs sm:text-sm" style={{ fontFamily: FONT }}>
            Master chess openings through practice
          </p>
        </div>

        <div className="bg-[#0e0c0a]/40 rounded-xl p-2.5 sm:p-3 mb-3 sm:mb-4 border border-[#3a2e1a]">
          <p className="text-[#c8b898] text-xs sm:text-sm leading-relaxed" style={{ fontFamily: FONT }}>
            Play as <strong className="text-[#ede4d0]">Black</strong>. Find the best response to White's moves and learn <em>why</em> they work.
          </p>
        </div>

        {/* Opening selector */}
        <div className="mb-3 sm:mb-4">
          <button
            onClick={() => setShowOpenings(!showOpenings)}
            className="w-full text-left px-3 py-2 sm:py-2.5 bg-[#0e0c0a]/30 rounded-lg border border-[#3a2e1a]
                       hover:bg-[#0e0c0a]/50 transition-colors flex items-center justify-between"
          >
            <div>
              <span className="text-[9px] sm:text-[10px] text-[#a08860] font-bold uppercase block" style={{ letterSpacing: '0.08em' }}>Opening</span>
              <span className="text-[#ede4d0] font-semibold text-xs sm:text-sm" style={{ fontFamily: FONT }}>
                {selectedOpening === 'all' ? 'All Openings' : openingsData[selectedOpening]?.name}
              </span>
            </div>
            <span className="text-[#a08860] text-sm">{showOpenings ? '\u25B2' : '\u25BC'}</span>
          </button>

          {showOpenings && (
            <div className="mt-1.5 bg-[#141210] rounded-lg border border-[#3a2e1a] overflow-hidden max-h-40 sm:max-h-48 overflow-y-auto">
              <button
                onClick={() => { onSelectOpening('all'); setShowOpenings(false); }}
                className={`w-full text-left px-3 py-2 hover:bg-[#2a2418] border-b border-[#2a1e14] text-xs sm:text-sm
                           ${selectedOpening === 'all' ? 'bg-[#2a2418]' : ''}`}
              >
                <span className="font-semibold text-[#ede4d0]" style={{ fontFamily: FONT }}>All Openings</span>
              </button>
              {Object.entries(openingsData).map(([key, opening]) => (
                <button
                  key={key}
                  onClick={() => { onSelectOpening(key); setShowOpenings(false); }}
                  className={`w-full text-left px-3 py-2 hover:bg-[#2a2418] border-b border-[#2a1e14] last:border-0 text-xs sm:text-sm
                             ${selectedOpening === key ? 'bg-[#2a2418]' : ''}`}
                >
                  <span className="font-semibold text-[#ede4d0]" style={{ fontFamily: FONT }}>{opening.name}</span>
                  <span className="text-[#6a5a40] text-xs ml-2">({opening.positions.length})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {highScore > 0 && (
          <div className="text-center mb-3 sm:mb-4">
            <span className="inline-block bg-[#2a2418] border-2 border-[#4a3520] rounded-full px-4 py-1">
              <span className="text-[#a08860] text-xs">High Score: </span>
              <span className="text-lg font-bold text-[#d4a850]" style={{ fontFamily: FONT }}>{highScore}</span>
            </span>
          </div>
        )}

        <div className="space-y-2">
          <BrainButton onClick={onStartUntimed} variant="primary" size="lg" className="w-full">
            Learn Mode
          </BrainButton>
          <BrainButton onClick={onStartTimed} variant="secondary" size="md" className="w-full">
            Challenge Mode
          </BrainButton>
          <BrainButton onClick={onStartFSRS} variant="success" size="md" className="w-full">
            Spaced Review {dueCount > 0 && <span className="ml-2 bg-[#0a0a0a]/30 px-2 py-0.5 rounded-full text-xs sm:text-sm">{dueCount} due</span>}
          </BrainButton>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-[#6a5a40] text-[10px] sm:text-xs" style={{ fontFamily: FONT }}>
            New? Start with Learn Mode!
          </p>
          <div className="flex items-center gap-2">
            <FullscreenButton />
            <button
              onClick={onShowProgress}
              className="text-[#a08860] hover:text-[#d4a850] text-[10px] sm:text-xs font-semibold underline underline-offset-2"
              style={{ fontFamily: FONT }}
            >
              Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// GAME OVER SCREEN
// ============================================================================

export function GameOverScreen({ score, rounds, highScore, bestStreak, isNewHigh, isTimed, isFSRS, opening, onRestart, onMenu }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
         style={{ background: 'linear-gradient(160deg, #0e0c0a 0%, #1a1612 50%, #0e0c0a 100%)' }}>
      <PaperTexture />

      <div className={`${panelStyle} p-4 sm:p-6 max-w-md w-full text-center relative z-20`}>
        <div className="inline-block bg-[#3a2e1a] text-[#d4a850] px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold mb-3"
             style={{ letterSpacing: '0.12em' }}>
          {isFSRS ? 'REVIEW COMPLETE' : isTimed ? 'CHALLENGE COMPLETE' : 'SESSION COMPLETE'}
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-[#ede4d0] mb-4" style={{ fontFamily: FONT, letterSpacing: '0.02em' }}>
          Well Done!
        </h2>

        {isNewHigh && isTimed && (
          <div className="bg-[#3a2e18] border-2 border-[#6a5020] rounded-lg px-4 py-1.5 mb-3 inline-block animate-pulse">
            <span className="text-[#d4a850] font-bold text-xs sm:text-sm" style={{ fontFamily: FONT }}>New High Score!</span>
          </div>
        )}

        {isTimed && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-[#0e0c0a]/40 rounded-lg p-2 border border-[#3a2e1a]">
              <div className="text-[9px] sm:text-[10px] text-[#a08860] font-bold" style={{ letterSpacing: '0.05em' }}>Score</div>
              <div className="text-xl sm:text-2xl font-bold text-[#ede4d0]" style={{ fontFamily: FONT }}>{score}</div>
            </div>
            <div className="bg-[#0e0c0a]/40 rounded-lg p-2 border border-[#3a2e1a]">
              <div className="text-[9px] sm:text-[10px] text-[#a08860] font-bold" style={{ letterSpacing: '0.05em' }}>Rounds</div>
              <div className="text-xl sm:text-2xl font-bold text-[#ede4d0]" style={{ fontFamily: FONT }}>{rounds}</div>
            </div>
            <div className="bg-[#0e0c0a]/40 rounded-lg p-2 border border-[#3a2e1a]">
              <div className="text-[9px] sm:text-[10px] text-[#a08860] font-bold" style={{ letterSpacing: '0.05em' }}>Streak</div>
              <div className="text-xl sm:text-2xl font-bold text-[#d4a850]" style={{ fontFamily: FONT }}>{bestStreak}</div>
            </div>
          </div>
        )}

        {(isFSRS || !isTimed) && (
          <div className="bg-[#0e0c0a]/40 rounded-lg p-3 mb-4 border border-[#3a2e1a]">
            <p className="text-[#c8b898] text-xs sm:text-sm" style={{ fontFamily: FONT }}>
              You completed <strong className="text-[#ede4d0]">{rounds}</strong> positions!
            </p>
          </div>
        )}

        <div className="space-y-2">
          <BrainButton onClick={onRestart} variant="success" size="lg" className="w-full">
            Play Again
          </BrainButton>
          <BrainButton onClick={onMenu} variant="secondary" size="md" className="w-full">
            Menu
          </BrainButton>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PROGRESS DASHBOARD
// ============================================================================

function masteryColor(accuracy) {
  if (accuracy >= 90) return 'bg-[#2a6830]';
  if (accuracy >= 70) return 'bg-[#3a6838]';
  if (accuracy >= 50) return 'bg-[#8a6828]';
  if (accuracy >= 30) return 'bg-[#8a5020]';
  if (accuracy > 0) return 'bg-[#8a2828]';
  return 'bg-[#2a2820]';
}

function masteryLabel(accuracy) {
  if (accuracy >= 90) return 'Mastered';
  if (accuracy >= 70) return 'Strong';
  if (accuracy >= 50) return 'Learning';
  if (accuracy >= 30) return 'Developing';
  if (accuracy > 0) return 'Needs Work';
  return 'Not Started';
}

export function ProgressDashboard({ onBack, openingsData, dbReady, progressDB }) {
  const [openingStats, setOpeningStats] = useState({});
  const [globalStats, setGlobalStats] = useState(null);
  const [weakSpots, setWeakSpots] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importStatus, setImportStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!dbReady || !progressDB) { setLoading(false); return; }
    loadData();
  }, [dbReady]);

  async function loadData() {
    setLoading(true);
    try {
      const [oStats, gStats, weak, hist] = await Promise.all([
        progressDB.getOpeningStats(),
        progressDB.getStats(),
        progressDB.getWeakSpots(8),
        progressDB.getSessionHistory(20)
      ]);
      setOpeningStats(oStats);
      setGlobalStats(gStats);
      setWeakSpots(weak);
      setSessions(hist);
    } catch (e) {
      console.error('Failed to load progress data:', e);
    }
    setLoading(false);
  }

  async function handleExport() {
    try {
      const json = await progressDB.exportData();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chess-trainer-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed:', e);
    }
  }

  async function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      await progressDB.importData(text);
      setImportStatus('success');
      loadData();
      setTimeout(() => setImportStatus(null), 3000);
    } catch (err) {
      setImportStatus('error');
      console.error('Import failed:', err);
      setTimeout(() => setImportStatus(null), 3000);
    }
    e.target.value = '';
  }

  async function handleReset() {
    if (!window.confirm('This will permanently delete all your progress data. Are you sure?')) return;
    try {
      await progressDB.clearAllData();
      loadData();
    } catch (e) {
      console.error('Reset failed:', e);
    }
  }

  const totalCorrect = globalStats?.totalCorrect || 0;
  const totalWrong = globalStats?.totalWrong || 0;
  const totalReviews = totalCorrect + totalWrong;
  const overallAccuracy = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0;

  const tabClass = (tab) => `px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
    activeTab === tab
      ? 'bg-[#3a2e1a] text-[#d4a850]'
      : 'bg-[#0e0c0a]/30 text-[#a08860] hover:bg-[#0e0c0a]/50'
  }`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-4"
         style={{ background: 'linear-gradient(160deg, #0e0c0a 0%, #1a1612 50%, #0e0c0a 100%)' }}>
      <PaperTexture />

      <div className="max-w-2xl mx-auto relative z-20 pb-6">
        {/* Header */}
        <div className={`${panelStyle} p-3 sm:p-4 mb-3`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="inline-block bg-[#3a2e1a] text-[#d4a850] px-3 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold mb-1"
                   style={{ letterSpacing: '0.12em' }}>
                PROGRESS
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#ede4d0]" style={{ fontFamily: FONT, letterSpacing: '0.02em' }}>
                Your Training History
              </h2>
            </div>
            <button
              onClick={onBack}
              className="text-[#a08860] hover:text-[#ede4d0] text-sm font-bold px-3 py-1 rounded-lg bg-[#0e0c0a]/30 hover:bg-[#0e0c0a]/50 transition-colors"
              style={{ fontFamily: FONT }}
            >
              Back
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button className={tabClass('overview')} onClick={() => setActiveTab('overview')} style={{ fontFamily: FONT }}>Overview</button>
            <button className={tabClass('openings')} onClick={() => setActiveTab('openings')} style={{ fontFamily: FONT }}>Openings</button>
            <button className={tabClass('history')} onClick={() => setActiveTab('history')} style={{ fontFamily: FONT }}>History</button>
            <button className={tabClass('data')} onClick={() => setActiveTab('data')} style={{ fontFamily: FONT }}>Data</button>
          </div>
        </div>

        {loading ? (
          <div className={`${panelStyle} p-8 text-center`}>
            <p className="text-[#a08860] font-semibold" style={{ fontFamily: FONT }}>Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="space-y-3">
                <div className={`${panelStyle} p-3 sm:p-4`}>
                  <h3 className="text-sm font-bold text-[#c8b898] mb-3" style={{ fontFamily: FONT, letterSpacing: '0.02em' }}>Overall Statistics</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <StatCard label="Total Reviews" value={totalReviews} />
                    <StatCard label="Accuracy" value={`${overallAccuracy}%`} />
                    <StatCard label="High Score" value={globalStats?.highScore || 0} />
                    <StatCard label="Best Streak" value={globalStats?.streakRecord || 0} />
                  </div>
                </div>

                <div className={`${panelStyle} p-3 sm:p-4`}>
                  <h3 className="text-sm font-bold text-[#c8b898] mb-3" style={{ fontFamily: FONT, letterSpacing: '0.02em' }}>Opening Mastery</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries(openingsData).map(([key, opening]) => {
                      const stats = openingStats[opening.name] || {};
                      const accuracy = stats.accuracy || 0;
                      const total = stats.total || 0;
                      return (
                        <div key={key} className="bg-[#0e0c0a]/40 rounded-lg p-2 border border-[#2a2418]">
                          <div className="flex items-center gap-1.5 mb-1">
                            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${masteryColor(accuracy)}`} />
                            <span className="text-[10px] font-bold text-[#c8b898] truncate">{opening.name.replace('The ', '')}</span>
                          </div>
                          <div className="h-1.5 bg-[#2a2418] rounded-full overflow-hidden mb-1">
                            <div className={`h-full rounded-full ${masteryColor(accuracy)}`} style={{ width: `${Math.max(accuracy, 3)}%` }} />
                          </div>
                          <div className="flex justify-between text-[9px] text-[#a08860]">
                            <span>{masteryLabel(accuracy)}</span>
                            <span>{total}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {weakSpots.length > 0 && (
                  <div className={`${panelStyle} p-3 sm:p-4`}>
                    <h3 className="text-sm font-bold text-[#c8b898] mb-3" style={{ fontFamily: FONT, letterSpacing: '0.02em' }}>Areas to Improve</h3>
                    <div className="space-y-1.5">
                      {weakSpots.map((spot, i) => (
                        <div key={i} className="flex items-center justify-between bg-[#0e0c0a]/40 rounded-lg px-2.5 py-1.5 border border-[#2a2418]">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[#b83828] text-xs font-bold shrink-0">{spot.accuracy}%</span>
                            <span className="text-[10px] text-[#c8b898] truncate">{spot.opening}</span>
                            <span className="text-[10px] text-[#a08860]">{spot.san}</span>
                          </div>
                          <span className="text-[9px] text-[#6a5a40] shrink-0 ml-2">{spot.wrong}/{spot.total}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'openings' && (
              <div className="space-y-2">
                {Object.entries(openingsData).map(([key, opening]) => {
                  const stats = openingStats[opening.name] || {};
                  const accuracy = stats.accuracy || 0;
                  const total = stats.total || 0;
                  const mastered = stats.masteredCards || 0;
                  const totalCards = stats.totalCards || 0;
                  return (
                    <div key={key} className={`${panelStyle} p-3`}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-bold text-sm text-[#ede4d0]" style={{ fontFamily: FONT }}>{opening.name}</div>
                          <div className="text-[10px] text-[#a08860]">{opening.positions.length} positions</div>
                        </div>
                        <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${masteryColor(accuracy)}`}>
                          {accuracy > 0 ? `${accuracy}%` : 'New'}
                        </div>
                      </div>
                      <div className="h-2 bg-[#2a2418] rounded-full overflow-hidden mb-1.5">
                        <div className={`h-full rounded-full transition-all ${masteryColor(accuracy)}`} style={{ width: `${Math.max(accuracy, 2)}%` }} />
                      </div>
                      <div className="flex justify-between text-[9px] text-[#a08860]">
                        <span>{total} reviews ({stats.correct || 0} correct)</span>
                        {totalCards > 0 && <span>{mastered}/{totalCards} mastered (SRS)</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'history' && (
              <div className={`${panelStyle} p-3 sm:p-4`}>
                <h3 className="text-sm font-bold text-[#c8b898] mb-3" style={{ fontFamily: FONT, letterSpacing: '0.02em' }}>Recent Sessions</h3>
                {sessions.length === 0 ? (
                  <p className="text-[#a08860] text-xs text-center py-4" style={{ fontFamily: FONT }}>
                    No sessions recorded yet. Play a round to see your history!
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-96 overflow-y-auto">
                    {sessions.map((session, i) => (
                      <div key={i} className="flex items-center justify-between bg-[#0e0c0a]/40 rounded-lg px-2.5 py-2 border border-[#2a2418]">
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#ede4d0]" style={{ fontFamily: FONT }}>
                            {session.mode === 'timed' ? 'Challenge' : session.mode === 'fsrs' ? 'SRS Review' : 'Learn'}
                            {session.opening && session.opening !== 'all' && (
                              <span className="font-normal text-[#a08860] ml-1.5">({session.opening})</span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#6a5a40]">
                            {session.date ? new Date(session.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <div className="text-xs font-bold text-[#ede4d0]" style={{ fontFamily: FONT }}>{session.correct || 0}/{session.rounds || 0}</div>
                          <div className="text-[9px] text-[#6a5a40]">
                            {session.rounds > 0 ? Math.round(((session.correct || 0) / session.rounds) * 100) : 0}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'data' && (
              <div className={`${panelStyle} p-3 sm:p-4`}>
                <h3 className="text-sm font-bold text-[#c8b898] mb-3" style={{ fontFamily: FONT, letterSpacing: '0.02em' }}>Data Management</h3>
                <p className="text-[#a08860] text-xs mb-4" style={{ fontFamily: FONT }}>
                  Export your progress as a JSON file for safekeeping, or import a previous backup.
                </p>
                <div className="space-y-2">
                  <BrainButton onClick={handleExport} variant="primary" size="md" className="w-full">
                    Export Progress (JSON)
                  </BrainButton>
                  <BrainButton onClick={() => fileInputRef.current?.click()} variant="secondary" size="md" className="w-full">
                    Import Backup
                  </BrainButton>
                  <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />

                  {importStatus === 'success' && (
                    <div className="bg-[#0e2810] border-2 border-[#1a4820] rounded-lg px-3 py-2 text-[#78c880] text-xs text-center">
                      Import successful! Progress data restored.
                    </div>
                  )}
                  {importStatus === 'error' && (
                    <div className="bg-[#2a0a08] border-2 border-[#4a1a18] rounded-lg px-3 py-2 text-[#c87878] text-xs text-center">
                      Import failed. Please check the file format.
                    </div>
                  )}

                  <div className="border-t border-[#2a2418] pt-3 mt-3">
                    <BrainButton onClick={handleReset} variant="danger" size="sm" className="w-full">
                      Reset All Progress
                    </BrainButton>
                    <p className="text-[#6a5a40] text-[10px] text-center mt-1">This cannot be undone!</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-[#0e0c0a]/40 rounded-lg p-2 border border-[#2a2418] text-center">
      <div className="text-[9px] sm:text-[10px] text-[#a08860] font-bold uppercase" style={{ letterSpacing: '0.05em' }}>{label}</div>
      <div className="text-lg sm:text-xl font-bold text-[#ede4d0]" style={{ fontFamily: FONT }}>{value}</div>
    </div>
  );
}
