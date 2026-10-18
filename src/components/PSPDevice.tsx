import { useId, useRef, useState, type PointerEvent as RPointerEvent, type ReactNode } from 'react';
import { XMB_THEMES, useTheme } from '../theme';
import { setSoundEnabled, sfx } from '../sound';
import { XMBScreen, useXMBController, type XMBController, type Dir } from './xmb';
import {
  OUTLINE, P, offset, toPath, roundedPath, rotate, move, circlePath, pillPath, shoulderPath, strapPath, dpadKeyPoints, diamondPoints,
  type Pt,
} from './psp-shape';
import './psp-device.css';

/*
 * The hero PSP-1000, drawn flat and straight-on like a product shot: real proportions (1:1 in mm, see psp-shape.ts),
 * one light from above, glossy plastic, recessed wells, keys that sink when pressed, and soft shadows. SVG for the
 * shell and keys; the live XMB is ordinary DOM placed over the screen.
 */

type Finish = {
  name: string;
  swatch: string;
  face: [string, string, string]; // top, middle, bottom of the flat front
  edge: [string, string, string, string]; // rounded edge: top catch, upper, lower, bottom bounce
  key: [string, string];
  well: [string, string]; // floor, wall
  ink: string; // printed labels and key symbols
  holes: string; // grille and speaker holes
  silver: [string, string, string];
  nub: [string, string];
  gloss: number; // strength of the white reflection on the shell
  shade: number; // strength of the shadows the keys cast
};

/* The five PSP-1000 launch-era finishes. */
export const FINISHES: Finish[] = [
  {
    name: 'Piano Black', swatch: '#040405',
    face: ['#24252b', '#0c0c0f', '#040405'], edge: ['#a3a9b3', '#2a2c32', '#060607', '#2c2e34'],
    key: ['#3b3e45', '#0d0e11'], well: ['#000000', '#16171b'], ink: '#b7bdc7', holes: '#35383f',
    silver: ['#fbfcfd', '#c4cad3', '#7d8590'], nub: ['#5c6068', '#1c1e22'], gloss: 0.15, shade: 0.85,
  },
  {
    name: 'Ceramic White', swatch: '#eceef1',
    face: ['#ffffff', '#f0f1f4', '#d8dbe0'], edge: ['#ffffff', '#e2e5e9', '#a9afb7', '#d0d4d9'],
    key: ['#ffffff', '#d3d7dd'], well: ['#b4b9c1', '#d7dade'], ink: '#5c6370', holes: '#a2a8b1',
    silver: ['#fbfcfd', '#cdd2d9', '#8b939e'], nub: ['#f6f7f9', '#c0c5cc'], gloss: 0.6, shade: 0.4,
  },
  {
    name: 'Metallic Blue', swatch: '#2149b8',
    face: ['#4d78e2', '#244cbb', '#173893'], edge: ['#b3c6f5', '#3359c6', '#0f2c78', '#2a4ba6'],
    key: ['#5079de', '#17378f'], well: ['#0a1843', '#1a3480'], ink: '#dfe7f8', holes: '#122966',
    silver: ['#fbfcfd', '#c2c8d1', '#7b838f'], nub: ['#6283dc', '#18378b'], gloss: 0.22, shade: 0.65,
  },
  {
    name: 'Pink', swatch: '#f0a2c0',
    face: ['#fccddd', '#f0a2c0', '#dc84a6'], edge: ['#fff2f7', '#f3b2cb', '#c47292', '#df98b3'],
    key: ['#fdcadd', '#de8bab'], well: ['#bc6e8b', '#df99b4'], ink: '#7b475b', holes: '#c17a95',
    silver: ['#fbfcfd', '#d8dbe0', '#959ca6'], nub: ['#fbc5d9', '#d5869f'], gloss: 0.38, shade: 0.45,
  },
  {
    name: 'Champagne Gold', swatch: '#d6c393',
    face: ['#f1e5c4', '#d6c393', '#b9a670'], edge: ['#fcf5e0', '#ddcda2', '#9f8c60', '#c3b182'],
    key: ['#efe0b8', '#b9a679'], well: ['#93825d', '#bcaa83'], ink: '#4c4434', holes: '#9a8963',
    silver: ['#fcfaf3', '#d8d2c2', '#958e7e'], nub: ['#e8d9b0', '#ad9a71'], gloss: 0.32, shade: 0.5,
  },
];

// Visible area in mm (the shadow is allowed to spill past it)
const VIEW = { x: -88, y: -40, w: 176, h: 84 };
const pct = (v: number, of: number) => `${(v / of) * 100}%`;

const BODY = toPath(OUTLINE);
const FACE = toPath(offset(OUTLINE, -2));

const keyAt = (deg: number) => roundedPath(dpadKeyPoints().map((p) => move(rotate(p, deg), P.dpad.x, P.dpad.y)), 0.9);
const DPAD: { dir: Dir; deg: number }[] = [
  { dir: 'up', deg: 0 },
  { dir: 'left', deg: 90 },
  { dir: 'down', deg: 180 },
  { dir: 'right', deg: -90 },
];

/** Polyline (y-up mm) → SVG path, open. */
const line = (pts: Pt[]) => toPath(pts, false);

type Ids = (name: string) => string;

/** A key that sinks when pressed (from the controller, the keyboard, or a click) and casts a soft shadow. */
function Key({
  id,
  ctl,
  label,
  d,
  fill,
  url,
  f,
  onPress,
  children,
  className = '',
}: {
  id: string;
  ctl: XMBController;
  label: string;
  d: string;
  fill: string;
  url: Ids;
  f: Finish;
  onPress: () => void;
  children?: ReactNode;
  className?: string;
}) {
  const [down, setDown] = useState(false);
  const isDown = down || ctl.pressed === id;
  const release = () => setDown(false);
  return (
    <g
      role="button"
      aria-label={label}
      className={`psp-key ${isDown ? 'is-down' : ''} ${className}`}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        setDown(true);
        ctl.focus();
        onPress();
      }}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
    >
      <path className="psp-key-shadow" d={d} fill="#000" opacity={f.shade} filter={url('soft')} />
      <g className="psp-key-cap">
        <path d={d} fill={fill} />
        <path d={d} fill={url('keySheen')} />
        <path d={d} fill="none" stroke={url('keyEdge')} strokeWidth={0.32} />
        {children}
        <path className="psp-key-press" d={d} />
      </g>
    </g>
  );
}

/** A recess in the shell: dark floor, shadowed upper wall, a lit lower wall and a lip that catches the light. */
function Well({ x, y, r, url, f }: { x: number; y: number; r: number; url: Ids; f: Finish }) {
  return (
    <g>
      <circle cx={x} cy={-y} r={r} fill={f.well[0]} />
      <circle cx={x} cy={-y} r={r - 0.55} fill="none" stroke={url('wellWall')} strokeWidth={1.1} />
      <circle cx={x} cy={-y} r={r + 0.18} fill="none" stroke={url('lip')} strokeWidth={0.36} />
    </g>
  );
}

export function PSPDevice({ autoFocusKeys = true }: { autoFocusKeys?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const ctl = useXMBController(rootRef, autoFocusKeys);
  const theme = useTheme();
  const [finishIndex, setFinishIndex] = useState(0);
  const f = FINISHES[finishIndex];

  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const id = (n: string) => `${uid}-${n}`;
  const url: Ids = (n) => `url(#${id(n)})`;

  const nextFinish = () => {
    sfx.toggle();
    setFinishIndex((i) => (i + 1) % FINISHES.length);
  };
  const nextTheme = () => {
    sfx.toggle();
    theme.setIndex((theme.index + 1) % XMB_THEMES.length);
  };
  const sound = (on?: boolean) => {
    const v = on ?? !theme.sound;
    setSoundEnabled(v);
    theme.setSound(v);
    if (v) setTimeout(() => sfx.select(), 30);
  };

  // Draggable analog nub: up to 1.6 mm of travel, a strong push moves the XMB once
  const nubDrag = useRef<{ x: number; y: number; fired: boolean } | null>(null);
  const [nub, setNub] = useState({ x: 0, y: 0, drag: false });
  const onNubDown = (e: RPointerEvent<SVGGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    nubDrag.current = { x: e.clientX, y: e.clientY, fired: false };
    setNub({ x: 0, y: 0, drag: true });
    ctl.focus();
  };
  const onNubMove = (e: RPointerEvent<SVGGElement>) => {
    const s = nubDrag.current;
    if (!s) return;
    const max = 22; // px of pointer travel for full deflection
    let dx = e.clientX - s.x;
    let dy = e.clientY - s.y;
    const len = Math.hypot(dx, dy);
    if (len > max) {
      dx = (dx / len) * max;
      dy = (dy / len) * max;
    }
    setNub({ x: (dx / max) * 1.6, y: (dy / max) * 1.6, drag: true });
    const strong = Math.hypot(dx, dy) > max * 0.75;
    if (strong && !s.fired) {
      s.fired = true;
      ctl.move(Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : dy < 0 ? 'up' : 'down');
    } else if (!strong && len < max * 0.3) s.fired = false;
  };
  const onNubUp = () => {
    nubDrag.current = null;
    setNub({ x: 0, y: 0, drag: false });
  };

  const keyProps = { ctl, url, f };
  const row = P.row;
  const fc = P.face;
  const faces = [
    { id: 'tri', x: 0, y: fc.off, label: 'Triangle: random colourway', act: ctl.triangle },
    { id: 'cir', x: fc.off, y: 0, label: 'Circle: back', act: ctl.back },
    { id: 'crs', x: 0, y: -fc.off, label: 'Cross: open', act: () => ctl.open() },
    { id: 'sqr', x: -fc.off, y: 0, label: 'Square: compare models', act: ctl.square },
  ];
  // Symbols at the size traced from the photo (a 7 mm square), as y-down offsets from the button centre
  const glyph = (kind: string) => {
    const common = { fill: 'none', stroke: f.ink, strokeWidth: 0.42 };
    if (kind === 'tri') return <path d="M0 -2.13 L2.41 1.8 L-2.41 1.8 Z" strokeLinejoin="miter" {...common} />;
    if (kind === 'cir') return <circle r={2.08} {...common} />;
    if (kind === 'crs') return <path d="M-1.7 -1.7 L1.7 1.7 M1.7 -1.7 L-1.7 1.7" {...common} />;
    return <rect x={-1.64} y={-1.64} width={3.28} height={3.28} {...common} />;
  };

  const pill = (
    key: string,
    label: string,
    x: number,
    w: number,
    h: number,
    onPress: () => void,
    content: ReactNode,
  ) => (
    <Key key={key} id={key} label={label} d={pillPath(x, row, w, h)} fill={url('key')} onPress={onPress} {...keyProps}>
      <g transform={`translate(${x} ${-row})`} className="psp-print">
        {content}
      </g>
    </Key>
  );
  const capText = (t: string, size = 1.45) => (
    <text fontSize={size} fontWeight={700} textAnchor="middle" dominantBaseline="central" fill={f.ink} letterSpacing={size > 2 ? 0 : 0.06}>
      {t}
    </text>
  );

  const s = P.screen;

  return (
    <div className="flex flex-col items-center w-full">
      <div
        ref={rootRef}
        tabIndex={0}
        role="application"
        aria-label="Interactive PSP-1000. Use the arrow keys to browse the menu and Enter to open. SELECT changes the shell colour."
        className="psp-wrap"
      >
        <svg className="psp-svg" viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}>
          <defs>
            {/* ── shell ── */}
            <linearGradient id={id('face')} gradientUnits="userSpaceOnUse" x1="0" y1="-37" x2="0" y2="37">
              <stop offset="0" stopColor={f.face[0]} />
              <stop offset="0.45" stopColor={f.face[1]} />
              <stop offset="1" stopColor={f.face[2]} />
            </linearGradient>
            <linearGradient id={id('edge')} gradientUnits="userSpaceOnUse" x1="0" y1="-37.2" x2="0" y2="37">
              <stop offset="0" stopColor={f.edge[0]} />
              <stop offset="0.035" stopColor={f.edge[1]} />
              <stop offset="0.5" stopColor={f.edge[1]} />
              <stop offset="0.95" stopColor={f.edge[2]} />
              <stop offset="1" stopColor={f.edge[3]} />
            </linearGradient>
            {/* the thin bright line where the rounded edge turns into the flat front */}
            <linearGradient id={id('rim')} gradientUnits="userSpaceOnUse" x1="0" y1="-35" x2="0" y2="35">
              <stop offset="0" stopColor="#fff" stopOpacity={0.55} />
              <stop offset="0.25" stopColor="#fff" stopOpacity={0.08} />
              <stop offset="0.75" stopColor="#fff" stopOpacity={0} />
              <stop offset="1" stopColor="#000" stopOpacity={0.35} />
            </linearGradient>
            {/* reflection of the room on the gloss: brighter towards the top, fading out below the middle */}
            <linearGradient id={id('sheen')} gradientUnits="userSpaceOnUse" x1="0" y1="-35" x2="0" y2="35">
              <stop offset="0" stopColor="#fff" stopOpacity={f.gloss} />
              <stop offset="0.42" stopColor="#fff" stopOpacity={f.gloss * 0.3} />
              <stop offset="0.6" stopColor="#fff" stopOpacity={0} />
            </linearGradient>
            {/* the lamp, reflected off to the upper left */}
            <radialGradient id={id('lamp')} gradientUnits="userSpaceOnUse" cx="-52" cy="-27" r="34" gradientTransform="translate(-52 -27) scale(1 0.42) translate(52 27)">
              <stop offset="0" stopColor="#fff" stopOpacity={f.gloss * 1.25} />
              <stop offset="0.5" stopColor="#fff" stopOpacity={f.gloss * 0.35} />
              <stop offset="1" stopColor="#fff" stopOpacity={0} />
            </radialGradient>
            <linearGradient id={id('streak')} gradientUnits="userSpaceOnUse" x1="-6" y1="0" x2="6" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity={0} />
              <stop offset="0.5" stopColor="#fff" stopOpacity={f.gloss * 0.42} />
              <stop offset="1" stopColor="#fff" stopOpacity={0} />
            </linearGradient>
            <clipPath id={id('faceClip')}>
              <path d={FACE} />
            </clipPath>

            {/* ── keys ── */}
            <linearGradient id={id('key')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={f.key[0]} />
              <stop offset="1" stopColor={f.key[1]} />
            </linearGradient>
            <radialGradient id={id('dome')} cx="0.5" cy="0.32" r="0.72">
              <stop offset="0" stopColor={f.key[0]} />
              <stop offset="0.55" stopColor={f.key[1]} />
              <stop offset="1" stopColor={f.key[1]} />
            </radialGradient>
            <linearGradient id={id('keySheen')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity={Math.min(0.5, f.gloss * 1.7)} />
              <stop offset="0.45" stopColor="#fff" stopOpacity={0} />
            </linearGradient>
            <linearGradient id={id('keyEdge')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity={0.6} />
              <stop offset="0.35" stopColor="#fff" stopOpacity={0.06} />
              <stop offset="0.7" stopColor="#000" stopOpacity={0.05} />
              <stop offset="1" stopColor="#000" stopOpacity={0.55} />
            </linearGradient>
            <radialGradient id={id('spec')} cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#fff" stopOpacity={0.55} />
              <stop offset="1" stopColor="#fff" stopOpacity={0} />
            </radialGradient>
            <linearGradient id={id('silver')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={f.silver[0]} />
              <stop offset="0.35" stopColor={f.silver[1]} />
              <stop offset="0.7" stopColor={f.silver[2]} />
              <stop offset="1" stopColor={f.silver[1]} />
            </linearGradient>
            <linearGradient id={id('wellWall')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#000" stopOpacity={0.75} />
              <stop offset="0.45" stopColor="#000" stopOpacity={0.15} />
              <stop offset="0.8" stopColor={f.well[1]} stopOpacity={0.6} />
              <stop offset="1" stopColor="#fff" stopOpacity={0.22} />
            </linearGradient>
            <linearGradient id={id('lip')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity={0.45} />
              <stop offset="0.5" stopColor="#fff" stopOpacity={0.04} />
              <stop offset="1" stopColor="#000" stopOpacity={0.35} />
            </linearGradient>
            <radialGradient id={id('nubSide')} cx="0.5" cy="0.4" r="0.6">
              <stop offset="0.7" stopColor={f.nub[0]} />
              <stop offset="1" stopColor={f.nub[1]} />
            </radialGradient>
            <radialGradient id={id('bump')} cx="0.35" cy="0.3" r="0.65">
              <stop offset="0" stopColor="#fff" stopOpacity={0.55} />
              <stop offset="0.6" stopColor="#fff" stopOpacity={0.1} />
              <stop offset="1" stopColor="#000" stopOpacity={0.35} />
            </radialGradient>
            {/* knurled nub top: rows of small raised dots */}
            <pattern id={id('knurl')} patternUnits="userSpaceOnUse" width="0.56" height="0.97" x="0" y="0">
              <rect width="0.56" height="0.97" fill={f.nub[1]} />
              {[[0.28, 0.24], [0, 0.73], [0.56, 0.73]].map(([cx, cy]) => (
                <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={0.2} fill={url('bump')} />
              ))}
            </pattern>
            <pattern id={id('grille')} patternUnits="userSpaceOnUse" width="0.8" height="1" x="-54.5" y="-34.35">
              {[[0, 0], [0.8, 0], [0.4, 0.5], [0, 1], [0.8, 1]].map(([cx, cy]) => (
                <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={0.2} fill={f.holes} />
              ))}
            </pattern>
            <radialGradient id={id('ledG')} cx="0.4" cy="0.35" r="0.65">
              <stop offset="0" stopColor="#eafff0" />
              <stop offset="0.45" stopColor="#3dff7a" />
              <stop offset="1" stopColor="#0d9a3c" />
            </radialGradient>
            <radialGradient id={id('ledO')} cx="0.4" cy="0.35" r="0.65">
              <stop offset="0" stopColor="#fff3df" />
              <stop offset="0.45" stopColor="#ffa23a" />
              <stop offset="1" stopColor="#b45a06" />
            </radialGradient>

            {/* ── shadows ── */}
            <filter id={id('soft')} x="-50%" y="-50%" width="200%" height="200%">
              <feOffset dy="0.7" />
              <feGaussianBlur stdDeviation="0.45" />
            </filter>
            <filter id={id('drop')} x="-10%" y="-20%" width="120%" height="160%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
            <filter id={id('contact')} x="-5%" y="-10%" width="110%" height="130%">
              <feGaussianBlur stdDeviation="0.8" />
            </filter>
            <filter id={id('glow')} x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="0.7" />
            </filter>
          </defs>

          {/* shadow on the surface below: wide and soft, then tight where the shell nearly touches */}
          <path d={BODY} fill="#000" opacity={0.6} transform="translate(0 4.2)" filter={url('drop')} />
          <path d={BODY} fill="#000" opacity={0.7} transform="translate(0 1.3)" filter={url('contact')} />

          {/* shell: rounded edge, then the flat front, then the reflections on it */}
          <path d={BODY} fill={url('edge')} />
          <path d={FACE} fill={url('face')} />
          <g clipPath={url('faceClip')} className="psp-gloss">
            <rect x={-86} y={-38} width={172} height={76} fill={url('sheen')} />
            <rect x={-86} y={-38} width={172} height={76} fill={url('lamp')} />
            {/* window reflections across the two wings */}
            <rect x={-6} y={-60} width={12} height={120} fill={url('streak')} transform="translate(-66 0) skewX(-28)" />
            <rect x={-6} y={-60} width={12} height={120} fill={url('streak')} transform="translate(-55.5 0) skewX(-28) scale(0.3 1)" />
            <rect x={-6} y={-60} width={12} height={120} fill={url('streak')} transform="translate(73 0) skewX(-28) scale(0.7 1)" />
          </g>
          <path d={FACE} fill="none" stroke={url('rim')} strokeWidth={0.28} />

          {/* printed and moulded details */}
          <g className="psp-print">
            <rect x={-54.7} y={-34.6} width={109.4} height={1.5} fill={url('grille')} />
            {[-55.9, 56.3].map((sx) =>
              [-2, -1, 0, 1, 2].flatMap((i) =>
                [-1, 0, 1].map((j) => (
                  <circle key={`${sx}${i}${j}`} cx={sx + i * 0.55 + (j % 2 ? 0.27 : 0)} cy={27.3 - j * 0.5} r={0.17} fill={f.holes} />
                )),
              ),
            )}

            {/* PS logo: tall P with a flattened S across its foot */}
            <g fill={f.ink}>
              <rect x={-74.5} y={-25.3} width={1.07} height={3.7} />
              <path d="M-73.45 -25.3 C-71 -25.3 -70.6 -23.1 -73.45 -23.15 Z" />
              <ellipse cx={-72.55} cy={-24.25} rx={0.45} ry={0.5} fill={f.face[0]} />
              <text transform="translate(-73.6 -22.2) matrix(1 0 -0.55 0.36 0 0)" fontSize={4.3} fontWeight={900} textAnchor="middle" dominantBaseline="central" className="psp-ps">
                S
              </text>
            </g>

            <text x={64.5} y={-26.6} fontSize={4.35} fontWeight={700} textAnchor="middle" dominantBaseline="central" textLength={13.8} lengthAdjust="spacingAndGlyphs" fill={f.ink} className="psp-sony">
              SONY
            </text>

            <g fill={f.ink} fontSize={1.5} fontWeight={600} letterSpacing={0.08}>
              <text x={78.4} y={15.6} textAnchor="end" dominantBaseline="central">POWER</text>
              <text x={76.2} y={22.1} textAnchor="end" dominantBaseline="central">HOLD</text>
              <text x={-29} y={32.6} textAnchor="middle" dominantBaseline="central" fontWeight={700}>VOL</text>
            </g>
            <circle cx={80} cy={15.6} r={0.42} fill={f.well[0]} />
            <circle cx={77.8} cy={22.1} r={0.42} fill={f.well[0]} />

            {/* LED icons: power, WLAN */}
            <g fill="none" stroke={f.ink} strokeWidth={0.18}>
              <path d="M-76.2 14.27 A0.75 0.75 0 1 1 -77 14.27 M-76.6 14 L-76.6 14.9" />
              {[0.45, 0.9, 1.35].map((r) => (
                <path key={r} d={`M-75.6 ${22.6 - r} A${r} ${r} 0 0 1 ${-75.6 + r * 0.988} ${22.6 - r * 0.156}`} />
              ))}
            </g>

            {/* PSP logotype — thin upright strokes, traced from the photo */}
            <g transform="translate(-10.71 31.68)" fill="none" stroke={f.ink} strokeWidth={0.24} strokeLinejoin="miter">
              <path d={line([[0, 0], [6.29, 0], [6.29, -1.47], [0.15, -1.47], [0.15, -3.16]])} />
              <path d={line([[7.05, -3.16], [10.58, -3.16], [10.58, -0.09], [13.8, -0.09]])} />
              <path d={line([[15.18, -0.09], [21.62, -0.09], [21.62, -1.63], [15.03, -1.63], [15.03, -3.16]])} />
            </g>
          </g>

          {/* screen recess (the live XMB sits on top of it, see .psp-screen-slot) */}
          <rect x={s.x - s.w / 2 - 0.7} y={-s.y - s.h / 2 - 0.7} width={s.w + 1.4} height={s.h + 1.4} rx={0.9} fill="#000" />
          <rect x={s.x - s.w / 2 - 0.7} y={-s.y - s.h / 2 - 0.7} width={s.w + 1.4} height={s.h + 1.4} rx={0.9} fill="none" stroke={url('lip')} strokeWidth={0.3} />

          {/* plate under the face buttons */}
          <path d={roundedPath(diamondPoints(fc.plate).map((p) => move(p, fc.x, fc.y)), 5)} fill="none" stroke={url('lip')} strokeWidth={0.26} opacity={0.45} />

          {/* wells */}
          <Well x={P.dpad.x} y={P.dpad.y} r={P.dpad.r} url={url} f={f} />
          {faces.map((b) => (
            <Well key={b.id} x={fc.x + b.x} y={fc.y + b.y} r={fc.well} url={url} f={f} />
          ))}
          <Well x={P.nub.x} y={P.nub.y} r={P.nub.well} url={url} f={f} />

          {/* silver strap holder */}
          <path d={strapPath()} fill={url('silver')} stroke={f.silver[2]} strokeWidth={0.12} />

          {/* silver L / R */}
          <Key id="l" label="L" d={shoulderPath('l')} fill={url('silver')} onPress={() => { ctl.move('left'); ctl.press('l'); }} className="psp-shoulder" {...keyProps} />
          <Key id="r" label="R" d={shoulderPath('r')} fill={url('silver')} onPress={() => { ctl.move('right'); ctl.press('r'); }} className="psp-shoulder" {...keyProps} />

          {/* d-pad */}
          {DPAD.map(({ dir, deg }) => {
            // outlined arrow, pointing outwards, 8.9 mm from the centre
            const tri = ([[0, 10.45], [1.79, 7.54], [-1.79, 7.54]] as Pt[]).map((p) => move(rotate(p, deg), P.dpad.x, P.dpad.y));
            return (
              <Key key={dir} id={dir} label={`D-pad ${dir}`} d={keyAt(deg)} fill={url('key')} onPress={() => ctl.move(dir)} {...keyProps}>
                <path d={toPath(tri)} fill="none" stroke={f.ink} strokeWidth={0.4} strokeLinejoin="miter" className="psp-print" />
              </Key>
            );
          })}

          {/* face buttons */}
          {faces.map((b) => {
            const cx = fc.x + b.x;
            const cy = fc.y + b.y;
            return (
              <Key key={b.id} id={b.id} label={b.label} d={circlePath(cx, cy, fc.cap)} fill={url('dome')} onPress={b.act} {...keyProps}>
                <ellipse cx={cx} cy={-cy - 2.3} rx={2.6} ry={1.25} fill={url('spec')} />
                <g transform={`translate(${cx} ${-cy})`} className="psp-print">
                  {glyph(b.id)}
                </g>
              </Key>
            );
          })}

          {/* analog nub */}
          <g
            className={`psp-nub ${nub.drag ? 'is-drag' : ''}`}
            style={{ transform: `translate(${nub.x}px, ${nub.y}px)` }}
            onPointerDown={onNubDown}
            onPointerMove={onNubMove}
            onPointerUp={onNubUp}
            onPointerCancel={onNubUp}
          >
            <circle cx={P.nub.x} cy={-P.nub.y} r={P.nub.r} fill="#000" opacity={f.shade} filter={url('soft')} />
            <circle cx={P.nub.x} cy={-P.nub.y} r={P.nub.r} fill={url('nubSide')} />
            <circle cx={P.nub.x} cy={-P.nub.y} r={P.nub.r} fill="none" stroke={url('keyEdge')} strokeWidth={0.3} />
            <circle cx={P.nub.x} cy={-P.nub.y} r={P.nub.top} fill={url('knurl')} />
            <circle cx={P.nub.x} cy={-P.nub.y} r={P.nub.top} fill={url('keySheen')} />
            <circle cx={P.nub.x} cy={-P.nub.y} r={P.nub.top} fill="none" stroke="#000" strokeOpacity={0.35} strokeWidth={0.2} />
          </g>

          {/* bottom row */}
          {pill('home', 'Home', -47.3, 10.1, 4.6, () => {
            ctl.press('home');
            sfx.back();
            ctl.setItem(ctl.nav.cat, 0);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, capText('HOME'))}
          {pill('vol-', 'Volume down: sound off', -34.6, 5.4, 5, () => { ctl.press('vol-'); sound(false); }, capText('−', 2.4))}
          {pill('vol+', 'Volume up: sound on', -23.2, 5.4, 5, () => { ctl.press('vol+'); sound(true); }, capText('+', 2.4))}
          {pill('disp', 'Display: next XMB colour', 19, 6.4, 4.4, () => { ctl.press('disp'); nextTheme(); }, (
            <>
              <rect x={-1.35} y={-0.95} width={2.7} height={1.9} rx={0.45} fill="none" stroke={f.ink} strokeWidth={0.32} />
              <circle r={0.42} fill={f.ink} />
            </>
          ))}
          {pill('note', 'Sound: toggle', 26.5, 6.1, 4.4, () => { ctl.press('note'); sound(); }, capText('♪', 2.6))}
          {pill('select', 'Select: next shell colour', 37.2, 10.7, 4.6, () => { ctl.press('select'); nextFinish(); }, capText('SELECT'))}
          {pill('start', 'Start: open', 48, 10.1, 4.6, () => ctl.open(), capText('START'))}

          {/* LEDs */}
          <circle cx={-79.4} cy={15.2} r={1.1} fill="#3dff7a" opacity={0.55} filter={url('glow')} />
          <circle cx={-79.4} cy={15.2} r={0.55} fill={url('ledG')} />
          <circle cx={-78.2} cy={22.6} r={1} fill="#ff9b2a" opacity={0.45} filter={url('glow')} />
          <circle cx={-78.2} cy={22.6} r={0.5} fill={url('ledO')} />
        </svg>

        {/* the screen: live XMB under a sheet of glass */}
        <div
          className="psp-screen-slot"
          style={{
            left: pct(s.x - s.w / 2 - VIEW.x, VIEW.w),
            top: pct(-s.y - s.h / 2 - VIEW.y, VIEW.h),
            width: pct(s.w, VIEW.w),
            height: pct(s.h, VIEW.h),
            padding: `${pct((s.h - s.ah) / 2, s.w)} ${pct((s.w - s.aw) / 2, s.w)}`,
          }}
        >
          <XMBScreen ctl={ctl} />
          <div className="psp-glass" />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <span className="label hidden sm:inline">Shell</span>
        <div className="flex gap-2 well p-1.5 !rounded-full">
          {FINISHES.map((x, i) => (
            <button
              key={x.name}
              type="button"
              title={x.name}
              aria-label={`${x.name} shell`}
              aria-pressed={i === finishIndex}
              onClick={() => {
                sfx.toggle();
                setFinishIndex(i);
              }}
              className="w-6 h-6 rounded-full transition-transform hover:scale-110"
              style={{
                background: `radial-gradient(circle at 35% 28%, rgb(255 255 255 / 0.9), ${x.swatch} 48%, ${x.swatch})`,
                boxShadow: i === finishIndex ? `0 0 0 2px #06080d, 0 0 0 4px var(--accent-hi)` : 'inset 0 -2px 3px rgb(0 0 0 / 0.35), 0 0 0 1px rgb(0 0 0 / 0.6)',
              }}
            />
          ))}
        </div>
        <span className="lcd lcd-text px-2.5 py-1 text-lg leading-none !rounded-md min-w-[150px] text-center">{f.name.toUpperCase()}</span>
      </div>
    </div>
  );
}
