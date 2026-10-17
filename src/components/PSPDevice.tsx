import { useCallback, useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import {
  Settings, Image, Music, Film, Gamepad2, Globe, BookOpen, ScanLine, ClipboardCheck, CircleHelp, Palette, Sparkles,
  Shuffle, Cpu, GitCompareArrows, Plug, Clock, Disc3, Star, Gem, Flag, Terminal, Download, ChevronUp, ChevronDown,
  ChevronLeft, ChevronRight, Smartphone, type LucideIcon,
} from 'lucide-react';
import { navigate } from '../router';
import { sfx } from '../sound';
import { colorways } from '../lib/catalog';
import { FaceGlyph } from './ui';
import './psp-device.css';

type XItem = { label: string; sub: string; icon: LucideIcon; to: string | (() => string) };
type XCat = { label: string; icon: LucideIcon; items: XItem[] };

const randomColorway = () => {
  const c = colorways[Math.floor(Math.random() * colorways.length)];
  return `/colors/${c.model.id}/${c.slug}`;
};

export const XMB: XCat[] = [
  {
    label: 'Guide',
    icon: Settings,
    items: [
      { label: 'Buyer’s Guide', sub: 'Which PSP should you get?', icon: BookOpen, to: '/guide' },
      { label: 'Model Decoder', sub: 'Decode any PSP-xxxx number', icon: ScanLine, to: '/guide#decoder' },
      { label: 'Inspection Checklist', sub: 'Before you buy used', icon: ClipboardCheck, to: '/guide#checklist' },
      { label: 'FAQ', sub: 'Regions, memory cards, batteries', icon: CircleHelp, to: '/guide#faq' },
    ],
  },
  {
    label: 'Colors',
    icon: Image,
    items: [
      { label: 'All Colorways', sub: `${colorways.length} finishes, 5 models`, icon: Palette, to: '/colors' },
      { label: 'Limited Editions', sub: 'Bundles, collabs & rarities', icon: Sparkles, to: '/colors?type=limited' },
      { label: 'Random Colorway', sub: 'Feeling lucky?', icon: Shuffle, to: randomColorway },
      { label: 'PSP-3000 Colors', sub: 'The biggest palette', icon: Image, to: '/colors?model=psp-3000' },
      { label: 'PSP-2000 Colors', sub: 'Slim & Lite finishes', icon: Image, to: '/colors?model=psp-2000' },
      { label: 'PSP-1000 Colors', sub: 'Where it began', icon: Image, to: '/colors?model=psp-1000' },
    ],
  },
  {
    label: 'History',
    icon: Music,
    items: [
      { label: 'Full Timeline', sub: '2003 → today', icon: Clock, to: '/history' },
      { label: 'Launch Era', sub: '2005 – 2006', icon: Flag, to: '/history#launch' },
      { label: 'Slim Era', sub: '2007 – 2008', icon: Flag, to: '/history#slim' },
      { label: 'Brite & Go', sub: '2009 – 2010', icon: Flag, to: '/history#go' },
      { label: 'Twilight', sub: '2011 – 2016', icon: Flag, to: '/history#twilight' },
    ],
  },
  {
    label: 'Hardware',
    icon: Film,
    items: [
      { label: 'All Models', sub: 'Five generations', icon: Cpu, to: '/models' },
      { label: 'Compare Models', sub: 'Side-by-side specs', icon: GitCompareArrows, to: '/compare' },
      { label: 'PSP-1000', sub: 'The original, 2004', icon: Smartphone, to: '/models/psp-1000' },
      { label: 'PSP-2000', sub: 'Slim & Lite, 2007', icon: Smartphone, to: '/models/psp-2000' },
      { label: 'PSP-3000', sub: 'Brite, 2008', icon: Smartphone, to: '/models/psp-3000' },
      { label: 'PSP Go', sub: 'N1000, 2009', icon: Smartphone, to: '/models/psp-go' },
      { label: 'PSP Street', sub: 'E1000, 2011', icon: Smartphone, to: '/models/psp-street' },
      { label: 'Accessories', sub: 'Cameras, GPS, TV tuners', icon: Plug, to: '/models#accessories' },
    ],
  },
  {
    label: 'Game',
    icon: Gamepad2,
    items: [
      { label: 'Essential Library', sub: 'The games that matter', icon: Disc3, to: '/games' },
      { label: 'Must-Plays', sub: 'Start here', icon: Star, to: '/games?tag=Essential' },
      { label: 'Hidden Gems', sub: 'Underrated UMDs', icon: Gem, to: '/games?tag=Hidden%20gem' },
      { label: 'Japan Only', sub: 'Import & fan-translated', icon: Flag, to: '/games?tag=Japan%20only' },
    ],
  },
  {
    label: 'Network',
    icon: Globe,
    items: [
      { label: 'System Updates', sub: 'Firmware 1.00 → 6.61', icon: Download, to: '/firmware' },
      { label: 'Homebrew & CFW', sub: 'The scene, explained', icon: Terminal, to: '/homebrew' },
    ],
  },
];

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(t);
  }, []);
  const md = `${now.getMonth() + 1}/${now.getDate()}`;
  const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return `${md} ${time}`;
}

function Waves() {
  const path = (amp: number, y: number, phase: number) => {
    let d = `M0 ${y}`;
    for (let x = 0; x <= 400; x += 10) d += ` L${x} ${(y + Math.sin((x / 200) * Math.PI * 2 + phase) * amp).toFixed(1)}`;
    return d;
  };
  return (
    <>
      <svg className="xmb-waves" viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden>
        <path d={path(14, 40, 0)} stroke="rgba(255,255,255,0.75)" strokeWidth="0.6" fill="none" />
        <path d={path(18, 46, 0.6)} stroke="rgba(255,255,255,0.35)" strokeWidth="2.2" fill="none" />
        <path d={`${path(14, 40, 0)} L400 100 L0 100 Z`} fill="rgba(255,255,255,0.07)" />
      </svg>
      <svg className="xmb-waves slow" viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden>
        <path d={path(10, 50, 2)} stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" fill="none" />
        <path d={`${path(12, 52, 2.4)} L400 100 L0 100 Z`} fill="rgba(255,255,255,0.06)" />
      </svg>
    </>
  );
}

type Dir = 'up' | 'down' | 'left' | 'right';

export function PSPDevice({ autoFocusKeys = true }: { autoFocusKeys?: boolean }) {
  const [nav, setNav] = useState(() => ({ cat: 1, sel: XMB.map(() => 0) }));
  const navRef = useRef(nav);
  navRef.current = nav;
  const { cat, sel } = nav;
  const [pressed, setPressed] = useState<string | null>(null);
  const [flash, setFlash] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(true);
  const clock = useClock();

  const press = (id: string) => {
    setPressed(id);
    window.setTimeout(() => setPressed((p) => (p === id ? null : p)), 140);
  };

  const setCat = (n: number) => setNav((v) => ({ ...v, cat: n }));
  const setItem = (c: number, i: number) =>
    setNav((v) => {
      const copy = [...v.sel];
      copy[c] = i;
      return { ...v, sel: copy };
    });

  const move = useCallback((d: Dir) => {
    press(d);
    const { cat, sel } = navRef.current;
    if (d === 'left' || d === 'right') {
      const n = Math.max(0, Math.min(XMB.length - 1, cat + (d === 'left' ? -1 : 1)));
      if (n !== cat) {
        sfx.move();
        navRef.current = { cat: n, sel };
        setCat(n);
      }
    } else {
      const cur = sel[cat];
      const n = Math.max(0, Math.min(XMB[cat].items.length - 1, cur + (d === 'up' ? -1 : 1)));
      if (n !== cur) {
        sfx.move();
        const copy = [...sel];
        copy[cat] = n;
        navRef.current = { cat, sel: copy };
        setItem(cat, n);
      }
    }
  }, []);

  const open = useCallback(
    (c = cat, i = sel[cat]) => {
      press('crs');
      sfx.select();
      setFlash((f) => f + 1);
      const item = XMB[c].items[i];
      const to = typeof item.to === 'function' ? item.to() : item.to;
      window.setTimeout(() => navigate(to), 260);
    },
    [cat, sel],
  );

  const back = useCallback(() => {
    press('cir');
    sfx.back();
    setItem(navRef.current.cat, 0);
  }, []);

  // Keyboard: always when the device has focus; ←/→/Enter globally while it is on screen and nothing else is focused.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (visibleRef.current = e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const focused = el.contains(document.activeElement);
      const idle = document.activeElement === document.body || document.activeElement === null;
      if (!focused && !(autoFocusKeys && idle && visibleRef.current)) return;
      const k = e.key;
      const map: Record<string, Dir> = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
      if (map[k]) {
        if (!focused && (k === 'ArrowUp' || k === 'ArrowDown')) return; // leave page scrolling alone
        e.preventDefault();
        move(map[k]);
      } else if (k === 'Enter' || k === 'x' || k === 'X') {
        if (!focused && k !== 'Enter') return;
        e.preventDefault();
        open();
      } else if (focused && (k === 'Escape' || k === 'Backspace' || k === 'o' || k === 'O')) {
        e.preventDefault();
        back();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      io.disconnect();
    };
  }, [move, open, back, autoFocusKeys]);

  // Swipe on the screen
  const swipe = useRef<{ x: number; y: number; t: number } | null>(null);
  const onScreenDown = (e: RPointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY, t: Date.now() };
  };
  const onScreenUp = (e: RPointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
    if (Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 'right' : 'left');
    else move(dy < 0 ? 'down' : 'up');
  };

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

  const focusDevice = () => rootRef.current?.focus({ preventScroll: true });

  const ROW = 11.2; // cqw (screen) between list rows
  const catLeft = 15; // cqw: where the selected category sits

  const arrow = (d: Dir, Icon: LucideIcon) => (
    <button
      type="button"
      aria-label={`D-pad ${d}`}
      className={`psp-arrow ${d} ${pressed === d ? 'is-down' : ''}`}
      onClick={() => {
        focusDevice();
        move(d);
      }}
    >
      <Icon strokeWidth={3} />
    </button>
  );

  return (
    <div className="psp-wrap">
      <div
        ref={rootRef}
        className="psp"
        tabIndex={0}
        role="application"
        aria-label="Interactive PSP. Use arrow keys to browse the menu, Enter to open."
      >
        <div className={`psp-shoulder l ${pressed === 'l' ? 'is-down' : ''}`} onClick={() => { focusDevice(); move('left'); press('l'); }}>
          <span>L</span>
        </div>
        <div className={`psp-shoulder r ${pressed === 'r' ? 'is-down' : ''}`} onClick={() => { focusDevice(); move('right'); press('r'); }}>
          <span>R</span>
        </div>

        <div className="psp-body">
          <div className="psp-grille" />

          <div className="psp-bezel">
            <div className="psp-screen" onPointerDown={onScreenDown} onPointerUp={onScreenUp} onClick={focusDevice}>
              <div className="xmb">
                <Waves />

                <div className="xmb-status">
                  <span>{clock}</span>
                  <span className="xmb-batt">
                    <i />
                  </span>
                </div>

                <div className="xmb-cats">
                  {XMB.map((c, i) => {
                    const offset = i - cat;
                    const x = catLeft + offset * 15.5 - 6.5;
                    const Icon = c.icon;
                    return (
                      <div
                        key={c.label}
                        className={`xmb-cat ${i === cat ? 'is-sel' : ''}`}
                        style={{ transform: `translateX(${x}cqw)`, opacity: i === cat ? 1 : offset < 0 ? 0.4 : 0.75 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          focusDevice();
                          if (i !== cat) {
                            setCat(i);
                            sfx.move();
                          }
                        }}
                      >
                        <Icon />
                        <span className="xmb-cat-label">{c.label}</span>
                      </div>
                    );
                  })}
                </div>

                {XMB[cat].items.map((it, i) => {
                  const s = sel[cat];
                  const above = i < s;
                  // selected + following items below the category row; earlier ones stack above it
                  const y = above ? 9.5 - (s - i) * ROW + 4 : 36 + (i - s) * ROW;
                  const Icon = it.icon;
                  return (
                    <div
                      key={`${cat}-${it.label}`}
                      className={`xmb-item ${i === s ? 'is-sel' : ''}`}
                      style={{ transform: `translateY(${y}cqw)`, opacity: above ? 0.35 : i === s ? 1 : 0.7, top: 0 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        focusDevice();
                        if (i === s) open(cat, i);
                        else {
                          sfx.move();
                          setItem(cat, i);
                        }
                      }}
                    >
                      <span className="xmb-item-icon">
                        <Icon strokeWidth={2} />
                      </span>
                      <span className="xmb-item-text">
                        <span className="xmb-item-title">{it.label}</span>
                        <span className="xmb-item-sub">{it.sub}</span>
                      </span>
                    </div>
                  );
                })}

                <div className="xmb-hint">
                  <span>
                    <b>✕</b> Enter
                  </span>
                  <span>
                    <b>○</b> Back
                  </span>
                </div>

                <div key={flash} className={`xmb-flash ${flash ? 'go' : ''}`} />
                <div className="xmb-boot">
                  <span className="xmb-boot-logo">PSP</span>
                  <span className="xmb-boot-sub">ARCHIVE</span>
                </div>
              </div>
            </div>
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
            <button type="button" aria-label="Triangle: random colorway" title="△ Random colorway" className={`psp-face tri ${pressed === 'tri' ? 'is-down' : ''}`} onClick={() => { press('tri'); sfx.select(); navigate(randomColorway()); }}>
              <FaceGlyph kind="triangle" size="2.1cqw" />
            </button>
            <button type="button" aria-label="Circle: back" title="○ Back" className={`psp-face cir ${pressed === 'cir' ? 'is-down' : ''}`} onClick={() => { focusDevice(); back(); }}>
              <FaceGlyph kind="circle" size="2.1cqw" />
            </button>
            <button type="button" aria-label="Cross: open" title="✕ Open" className={`psp-face crs ${pressed === 'crs' ? 'is-down' : ''}`} onClick={() => { focusDevice(); open(); }}>
              <FaceGlyph kind="cross" size="2.1cqw" />
            </button>
            <button type="button" aria-label="Square: compare models" title="□ Compare models" className={`psp-face sqr ${pressed === 'sqr' ? 'is-down' : ''}`} onClick={() => { press('sqr'); sfx.select(); navigate('/compare'); }}>
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
