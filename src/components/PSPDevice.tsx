import { useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react';
import { navigate } from '../router';
import { FaceGlyph } from './ui';
import { XMBScreen, useXMBController, type Dir } from './xmb';
import './psp-device.css';

/**
 * Flat CSS-drawn PSP-1000. Used while the 3D model loads and when WebGL is unavailable.
 */
export function PSPDevice({ autoFocusKeys = true }: { autoFocusKeys?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const ctl = useXMBController(rootRef, autoFocusKeys);
  const { pressed, press, move, open, back, triangle, square, focus } = ctl;

  // Draggable analog nub
  const nubRef = useRef<HTMLDivElement>(null);
  const nubState = useRef<{ x: number; y: number; fired: boolean } | null>(null);
  const [nub, setNub] = useState({ x: 0, y: 0, drag: false });
  const onNubDown = (e: RPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    nubState.current = { x: e.clientX, y: e.clientY, fired: false };
    setNub({ x: 0, y: 0, drag: true });
  };
  const onNubMove = (e: RPointerEvent<HTMLDivElement>) => {
    const s = nubState.current;
    const el = nubRef.current;
    if (!s || !el) return;
    const max = el.offsetWidth * 0.32;
    let dx = e.clientX - s.x;
    let dy = e.clientY - s.y;
    const len = Math.hypot(dx, dy);
    if (len > max) {
      dx = (dx / len) * max;
      dy = (dy / len) * max;
    }
    setNub({ x: dx, y: dy, drag: true });
    const strong = Math.hypot(dx, dy) > max * 0.75;
    if (strong && !s.fired) {
      s.fired = true;
      if (Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 'left' : 'right');
      else move(dy < 0 ? 'up' : 'down');
    } else if (!strong && Math.hypot(dx, dy) < max * 0.3) s.fired = false;
  };
  const onNubUp = () => {
    nubState.current = null;
    setNub({ x: 0, y: 0, drag: false });
  };

  const arrow = (d: Dir, Icon: LucideIcon) => (
    <button
      type="button"
      aria-label={`D-pad ${d}`}
      className={`psp-arrow ${d} ${pressed === d ? 'is-down' : ''}`}
      onClick={() => {
        focus();
        move(d);
      }}
    >
      <Icon strokeWidth={3} />
    </button>
  );

  return (
    <div className="psp-wrap">
      <div ref={rootRef} className="psp" tabIndex={0} role="application" aria-label="Interactive PSP. Use arrow keys to browse the menu, Enter to open.">
        <div className={`psp-shoulder l ${pressed === 'l' ? 'is-down' : ''}`} onClick={() => { focus(); move('left'); press('l'); }}>
          <span>L</span>
        </div>
        <div className={`psp-shoulder r ${pressed === 'r' ? 'is-down' : ''}`} onClick={() => { focus(); move('right'); press('r'); }}>
          <span>R</span>
        </div>

        <div className="psp-body">
          <div className="psp-grille" />

          <div className="psp-bezel">
            <XMBScreen ctl={ctl} />
            <div className="psp-glass" />
          </div>

          <div className="psp-dpad">
            {arrow('up', ChevronUp)}
            {arrow('left', ChevronLeft)}
            {arrow('right', ChevronRight)}
            {arrow('down', ChevronDown)}
          </div>

          <div className="psp-nub-well">
            <div
              ref={nubRef}
              className={`psp-nub ${nub.drag ? 'is-drag' : ''}`}
              style={{ transform: `translate(${nub.x}px, ${nub.y}px)` }}
              onPointerDown={onNubDown}
              onPointerMove={onNubMove}
              onPointerUp={onNubUp}
              onPointerCancel={onNubUp}
              aria-hidden
            />
          </div>

          <div className="psp-faces">
            <button type="button" aria-label="Triangle: random colorway" title="△ Random colorway" className={`psp-face tri ${pressed === 'tri' ? 'is-down' : ''}`} onClick={triangle}>
              <FaceGlyph kind="triangle" size="2.1cqw" />
            </button>
            <button type="button" aria-label="Circle: back" title="○ Back" className={`psp-face cir ${pressed === 'cir' ? 'is-down' : ''}`} onClick={() => { focus(); back(); }}>
              <FaceGlyph kind="circle" size="2.1cqw" />
            </button>
            <button type="button" aria-label="Cross: open" title="✕ Open" className={`psp-face crs ${pressed === 'crs' ? 'is-down' : ''}`} onClick={() => { focus(); open(); }}>
              <FaceGlyph kind="cross" size="2.1cqw" />
            </button>
            <button type="button" aria-label="Square: compare models" title="□ Compare models" className={`psp-face sqr ${pressed === 'sqr' ? 'is-down' : ''}`} onClick={square}>
              <FaceGlyph kind="square" size="2.1cqw" />
            </button>
          </div>

          <span className="psp-led led-green" style={{ top: '27cqw' }} />
          <span className="psp-led" style={{ top: '29.6cqw', background: '#ff9b2a', boxShadow: '0 0 0.8cqw #ff9b2a' }} />
          <span className="psp-side-label" style={{ top: '27.5cqw' }}>POWER</span>
          <span className="psp-side-label" style={{ top: '30.2cqw' }}>HOLD</span>

          <div className="psp-row">
            <button type="button" className="psp-pill" style={{ left: '20cqw' }} onClick={() => navigate('/')} aria-label="Home">
              HOME
            </button>
            <span className="psp-pill" style={{ left: '28cqw', padding: '0 0.9cqw' }}>
              −
            </span>
            <span className="psp-pill" style={{ left: '31.4cqw', padding: '0 0.6cqw', background: 'none', boxShadow: 'none' }}>
              VOL
            </span>
            <span className="psp-pill" style={{ left: '35.2cqw', padding: '0 0.9cqw' }}>
              +
            </span>
            <span className="psp-logo">PSP</span>
            <span className="psp-pill" style={{ left: '61cqw', padding: '0 0.9cqw' }}>
              ◐
            </span>
            <span className="psp-pill" style={{ left: '64.6cqw', padding: '0 0.9cqw' }}>
              ♪
            </span>
            <span className="psp-pill" style={{ left: '69cqw' }}>
              SELECT
            </span>
            <span className="psp-pill" style={{ left: '75.4cqw' }}>
              START
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
