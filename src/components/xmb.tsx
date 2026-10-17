import { useCallback, useEffect, useRef, useState, type PointerEvent as RPointerEvent, type RefObject } from 'react';
import {
  Settings, Image, Music, Film, Gamepad2, Globe, BookOpen, ScanLine, ClipboardCheck, CircleHelp, Palette, Sparkles,
  Shuffle, Cpu, GitCompareArrows, Plug, Clock, Disc3, Star, Gem, Flag, Terminal, Download, Smartphone, type LucideIcon,
} from 'lucide-react';
import { navigate } from '../router';
import { sfx } from '../sound';
import { colorways } from '../lib/catalog';
import './psp-device.css';

// The XMB menu shown on the hero PSP's screen, shared by the CSS and the 3D device.

type XItem = { label: string; sub: string; icon: LucideIcon; to: string | (() => string) };
type XCat = { label: string; icon: LucideIcon; items: XItem[] };
export type Dir = 'up' | 'down' | 'left' | 'right';

export const randomColorway = () => {
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

export type XMBController = ReturnType<typeof useXMBController>;

/**
 * Menu state + input handling. Keyboard works whenever `rootRef` has focus; ←/→/Enter also work
 * globally while the device is on screen and nothing else is focused (↑/↓ are left to page scrolling).
 */
export function useXMBController(rootRef: RefObject<HTMLElement | null>, autoFocusKeys = true) {
  const [nav, setNav] = useState(() => ({ cat: 1, sel: XMB.map(() => 0) }));
  const navRef = useRef(nav);
  navRef.current = nav;
  const [pressed, setPressed] = useState<string | null>(null);
  const [flash, setFlash] = useState(0);
  const visibleRef = useRef(true);

  const press = useCallback((id: string) => {
    setPressed(id);
    window.setTimeout(() => setPressed((p) => (p === id ? null : p)), 140);
  }, []);

  const setCat = useCallback((n: number) => setNav((v) => ({ ...v, cat: n })), []);
  const setItem = useCallback(
    (c: number, i: number) =>
      setNav((v) => {
        const copy = [...v.sel];
        copy[c] = i;
        return { ...v, sel: copy };
      }),
    [],
  );

  const move = useCallback(
    (d: Dir) => {
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
    },
    [press, setCat, setItem],
  );

  const open = useCallback(
    (c?: number, i?: number) => {
      const cur = navRef.current;
      const cc = c ?? cur.cat;
      const ii = i ?? cur.sel[cc];
      press('crs');
      sfx.select();
      setFlash((f) => f + 1);
      const item = XMB[cc].items[ii];
      const to = typeof item.to === 'function' ? item.to() : item.to;
      window.setTimeout(() => navigate(to), 260);
    },
    [press],
  );

  const back = useCallback(() => {
    press('cir');
    sfx.back();
    setItem(navRef.current.cat, 0);
  }, [press, setItem]);

  const triangle = useCallback(() => {
    press('tri');
    sfx.select();
    navigate(randomColorway());
  }, [press]);

  const square = useCallback(() => {
    press('sqr');
    sfx.select();
    navigate('/compare');
  }, [press]);

  const focus = useCallback(() => rootRef.current?.focus({ preventScroll: true }), [rootRef]);

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
        if (!focused && (k === 'ArrowUp' || k === 'ArrowDown')) return;
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
  }, [rootRef, move, open, back, autoFocusKeys]);

  return { nav, pressed, flash, press, move, open, back, triangle, square, setCat, setItem, focus };
}

// The boot animation plays once per page load, even if the device remounts (e.g. CSS → 3D swap).
let bootShown = false;

/** The XMB itself. Fills its container; sizes are in cqw of `.psp-screen`. */
export function XMBScreen({ ctl, className = '' }: { ctl: XMBController; className?: string }) {
  const { nav, flash, move, open, setCat, setItem, focus } = ctl;
  const { cat, sel } = nav;
  const clock = useClock();
  const [boot] = useState(() => {
    const show = !bootShown;
    bootShown = true;
    return show;
  });

  const swipe = useRef<{ x: number; y: number } | null>(null);
  const onDown = (e: RPointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onUp = (e: RPointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
    if (Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 'right' : 'left');
    else move(dy < 0 ? 'down' : 'up');
  };

  const ROW = 11.2; // cqw between list rows
  const catLeft = 15; // cqw: where the selected category sits

  return (
    <div className={`psp-screen ${className}`} onPointerDown={onDown} onPointerUp={onUp} onClick={focus}>
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
                  focus();
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
          // selected + following items sit below the category row; earlier ones stack above it
          const y = above ? 9.5 - (s - i) * ROW + 4 : 36 + (i - s) * ROW;
          const Icon = it.icon;
          return (
            <div
              key={`${cat}-${it.label}`}
              className={`xmb-item ${i === s ? 'is-sel' : ''}`}
              style={{ transform: `translateY(${y}cqw)`, opacity: above ? 0.35 : i === s ? 1 : 0.7, top: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                focus();
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
        {boot && (
          <div className="xmb-boot">
            <span className="xmb-boot-logo">PSP</span>
            <span className="xmb-boot-sub">ARCHIVE</span>
          </div>
        )}
      </div>
    </div>
  );
}
