import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/*
 * PSP-1000 geometry in millimetres, origin at the centre of the device, +y up, +z towards the viewer.
 * Overall size 170 × 74 × 23 mm. The outline and every feature position were traced from a straight-on
 * product photo of a Piano Black PSP-1000 (924 px wide → 5.435 px/mm).
 */

export const DEPTH = 23;
export const FRONT = DEPTH / 2; // z of the flat front face

// Top-left quarter of the outline, from top-centre to left-middle.
const QUARTER: [number, number][] = [
  [0, 37], [-20, 37], [-40, 37], [-56, 37], [-62, 36.95], [-65.6, 36.75], [-67.9, 36.3], [-69.7, 35.5],
  [-71.2, 34.1], [-72.8, 32.3], [-74.6, 30.1], [-76.6, 27.6], [-78.4, 24.9], [-79.9, 22.0], [-81.2, 19.0],
  [-82.3, 15.8], [-83.3, 12.4], [-84.1, 8.8], [-84.6, 5.2], [-84.9, 2.2], [-85, 0],
];

/** Full outline, counter-clockwise, densely resampled with a closed Catmull-Rom spline. */
export function outlinePoints(samples = 260): THREE.Vector2[] {
  const q = QUARTER;
  const tl = q;
  const bl = [...q].reverse().slice(1).map(([x, y]) => [x, -y] as [number, number]);
  const br = q.slice(1).map(([x, y]) => [-x, -y] as [number, number]);
  const tr = [...q].reverse().slice(1, -1).map(([x, y]) => [-x, y] as [number, number]);
  const pts = [...tl, ...bl, ...br, ...tr].map(([x, y]) => new THREE.Vector3(x, y, 0));
  const curve = new THREE.CatmullRomCurve3(pts, true, 'centripetal');
  return curve.getSpacedPoints(samples).slice(0, -1).map((p) => new THREE.Vector2(p.x, p.y));
}

/** Offset a closed CCW polyline: positive = outward. */
export function offsetPolyline(pts: THREE.Vector2[], d: number): THREE.Vector2[] {
  const n = pts.length;
  return pts.map((p, i) => {
    const a = pts[(i - 1 + n) % n];
    const b = pts[(i + 1) % n];
    const t = new THREE.Vector2().subVectors(b, a).normalize();
    const normal = new THREE.Vector2(t.y, -t.x); // outward for CCW
    return p.clone().addScaledVector(normal, d);
  });
}

function smooth(g: THREE.BufferGeometry) {
  g.deleteAttribute('normal');
  g.deleteAttribute('uv');
  const m = mergeVertices(g, 1e-3);
  m.computeVertexNormals();
  return m;
}

/** Main shell: flat front, rounded edges all round. */
export function bodyGeometry() {
  const bevel = 2.2;
  const bevelT = 3.6;
  const depth = DEPTH - bevelT * 2;
  const shape = new THREE.Shape(offsetPolyline(outlinePoints(), -bevel));
  const g = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevelT,
    bevelSize: bevel,
    bevelSegments: 12,
    curveSegments: 1,
    steps: 1,
  });
  g.translate(0, 0, -depth / 2);
  return smooth(g);
}

/**
 * A silver band that hugs part of the outline (used for the L/R shoulders and the strap hook).
 * `pick` selects the outline points, `sortAsc` orders them along the CCW outline, `thickAt(t)` gives the
 * band thickness from start (t=0) to end (t=1).
 */
function cornerBand(pick: (p: THREE.Vector2) => boolean, sortAsc: boolean, thickAt: (t: number) => number, depth: number, mirrorX: boolean) {
  const all = outlinePoints(620);
  const seg = all.filter(pick).sort((a, b) => (sortAsc ? a.x - b.x : b.x - a.x));
  const n = seg.length;
  const bevel = 0.7;
  const outer: THREE.Vector2[] = [];
  const inner: THREE.Vector2[] = [];
  seg.forEach((p, i) => {
    const t = i / (n - 1);
    const tan = new THREE.Vector2().subVectors(seg[Math.min(n - 1, i + 1)], seg[Math.max(0, i - 1)]).normalize();
    const inward = new THREE.Vector2(-tan.y, tan.x); // inward normal for a CCW outline
    // the extrude bevel grows the shape by `bevel`, so pre-shrink both edges
    outer.push(p.clone().addScaledVector(inward, bevel - 0.35));
    inner.push(p.clone().addScaledVector(inward, thickAt(t) - bevel));
  });
  let ring = [...outer, ...inner.reverse()];
  if (mirrorX) ring = ring.map((p) => new THREE.Vector2(-p.x, p.y)); // ExtrudeGeometry fixes the winding
  const g = new THREE.ExtrudeGeometry(new THREE.Shape(ring), {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.9,
    bevelSize: bevel,
    bevelSegments: 5,
    curveSegments: 1,
  });
  g.translate(0, 0, FRONT + 0.1 - depth - 0.9); // front sits just proud of the face
  return smooth(g);
}

/** Silver L/R shoulder buttons wrapping the top corners — thickest at the corner, like the real part. */
export function shoulderGeometry(side: 'l' | 'r') {
  return cornerBand(
    (p) => p.x < -54.5 && p.y > 28.5,
    false, // CCW runs from the top edge (x ≈ −55) towards the side
    (t) => 2.4 + Math.sin(t * Math.PI) * 2.4 + t * 0.5,
    17,
    side === 'r',
  );
}

/** The silver wrist-strap holder on the bottom-left corner. */
export function strapHookGeometry() {
  return cornerBand(
    (p) => p.x < -58 && p.y < -31,
    true, // CCW runs from the side towards the bottom edge
    (t) => 1.7 + Math.sin(t * Math.PI) * 1.5,
    9,
    false,
  );
}

/** Rounded polygon helper (corner radius r). */
function roundedPoly(points: [number, number][], r: number) {
  const s = new THREE.Shape();
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const p = new THREE.Vector2(...points[i]);
    const prev = new THREE.Vector2(...points[(i - 1 + n) % n]);
    const next = new THREE.Vector2(...points[(i + 1) % n]);
    const a = p.clone().add(prev.clone().sub(p).normalize().multiplyScalar(Math.min(r, prev.distanceTo(p) / 2)));
    const b = p.clone().add(next.clone().sub(p).normalize().multiplyScalar(Math.min(r, next.distanceTo(p) / 2)));
    if (i === 0) s.moveTo(a.x, a.y);
    else s.lineTo(a.x, a.y);
    s.quadraticCurveTo(p.x, p.y, b.x, b.y);
  }
  s.closePath();
  return s;
}

/**
 * One d-pad arrow key, pointing up. Local origin = key centre, which sits 7.9 mm from the d-pad centre.
 * Measured: 7.8 mm wide, outer end on a 12 mm radius (follows the well), tip 4 mm from the centre.
 */
export const DPAD_KEY_OFFSET = 7.9;
export function dpadKeyGeometry() {
  const bevel = 0.5;
  const R = 12.0 - bevel;
  const hw = 4.05 - bevel;
  const c = DPAD_KEY_OFFSET;
  const sideEnd = 6.1;
  const tip = 3.55 + bevel;
  const a = Math.asin(hw / R);
  const pts: [number, number][] = [];
  for (let i = 0; i <= 8; i++) {
    const th = a - (2 * a * i) / 8; // right → left along the outer arc
    pts.push([R * Math.sin(th), R * Math.cos(th) - c]);
  }
  pts.push([-hw, sideEnd - c], [0, tip - c], [hw, sideEnd - c]);
  const g = new THREE.ExtrudeGeometry(roundedPoly(pts, 0.9), {
    depth: 1.1,
    bevelEnabled: true,
    bevelThickness: 0.6,
    bevelSize: bevel,
    bevelSegments: 6,
    curveSegments: 6,
  });
  return smooth(g);
}

/** Pill-shaped key for the bottom row. */
export function pillGeometry(w: number, h: number) {
  const r = Math.min(h / 2, w / 2) - 0.01;
  const s = new THREE.Shape();
  const x = w / 2 - r;
  s.moveTo(-x, -h / 2);
  s.lineTo(x, -h / 2);
  s.absarc(x, 0, r, -Math.PI / 2, Math.PI / 2, false);
  s.lineTo(-x, h / 2);
  s.absarc(-x, 0, r, Math.PI / 2, (Math.PI * 3) / 2, false);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.5, bevelEnabled: true, bevelThickness: 0.45, bevelSize: 0.35, bevelSegments: 4, curveSegments: 10 });
  return smooth(g);
}

/** Domed round face button (Ø 8.6 mm). Lathe profile in (radius, height). */
export function faceButtonGeometry() {
  const prof = [
    [0, 2.42], [1.4, 2.41], [2.3, 2.36], [3.1, 2.2], [3.7, 1.95], [4.1, 1.6], [4.3, 1.15], [4.35, 0],
  ].map(([r, z]) => new THREE.Vector2(r, z));
  const g = new THREE.LatheGeometry(prof, 48);
  g.rotateX(Math.PI / 2); // lathe axis y → z
  return g;
}

/** Analog nub: a low, slightly concave disc (Ø 11.2 mm). */
export function nubGeometry() {
  const prof = [
    [0, 1.25], [2.5, 1.3], [4.3, 1.42], [5.2, 1.3], [5.6, 0.85], [5.6, 0],
  ].map(([r, z]) => new THREE.Vector2(r, z));
  const g = new THREE.LatheGeometry(prof, 56);
  g.rotateX(Math.PI / 2);
  return g;
}

/** Rounded square rotated 45° — the plate under the face buttons. */
export function diamondShape(halfDiag: number, r: number) {
  return roundedPoly(
    [
      [0, halfDiag],
      [-halfDiag, 0],
      [0, -halfDiag],
      [halfDiag, 0],
    ],
    r,
  );
}

/* ───────────────────────── Canvas textures ───────────────────────── */

const PX = 10; // px per mm for the face print

function canvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function tex(c: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Everything printed or moulded flat on the front: logos, labels, LED icons, grille, speakers. */
export function facePrintTexture(ink: string, dark: string) {
  const W = 170 * PX;
  const H = 74 * PX;
  const c = canvas(W, H);
  const g = c.getContext('2d')!;
  const X = (x: number) => (x + 85) * PX;
  const Y = (y: number) => (37 - y) * PX;
  g.textBaseline = 'middle';

  // top grille (perforated strip between the shoulders)
  g.fillStyle = '#3a3d44';
  for (let x = -54.5; x <= 54.5; x += 0.8) {
    for (let row = 0; row < 3; row++) {
      g.beginPath();
      g.arc(X(x + (row % 2) * 0.4), Y(34.35 - row * 0.5), 0.2 * PX, 0, Math.PI * 2);
      g.fill();
    }
  }

  // speaker holes under the d-pad and the face buttons
  for (const sx of [-55.9, 56.3]) {
    for (let i = -2; i <= 2; i++)
      for (let j = -1; j <= 1; j++) {
        g.beginPath();
        g.arc(X(sx + i * 0.55 + (j % 2 ? 0.27 : 0)), Y(-27.3 + j * 0.5), 0.17 * PX, 0, Math.PI * 2);
        g.fill();
      }
  }

  g.fillStyle = ink;
  g.strokeStyle = ink;

  // PS logo (top left): tall P with a flattened S across its foot
  g.save();
  g.beginPath();
  g.rect(X(-74.5), Y(25.3), 1.07 * PX, 3.7 * PX); // stem
  g.fill();
  g.beginPath();
  g.moveTo(X(-73.45), Y(25.3));
  g.bezierCurveTo(X(-71.0), Y(25.3), X(-70.6), Y(23.1), X(-73.45), Y(23.15));
  g.closePath();
  g.fill();
  g.fillStyle = dark;
  g.beginPath();
  g.ellipse(X(-72.55), Y(24.25), 0.45 * PX, 0.5 * PX, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = ink;
  g.translate(X(-73.6), Y(22.2));
  g.transform(1, 0, -0.55, 0.36, 0, 0);
  g.font = `900 ${4.3 * PX}px "Arial Black", "Space Grotesk", sans-serif`;
  g.textAlign = 'center';
  g.fillText('S', 0, 0);
  g.restore();

  // SONY wordmark (top right)
  g.save();
  g.font = `700 ${4.35 * PX}px Georgia, "Times New Roman", serif`;
  g.textAlign = 'center';
  const sw = g.measureText('SONY').width;
  g.translate(X(64.5), Y(26.75));
  g.scale((13.8 * PX) / (sw + 1.8 * PX), 1);
  try {
    (g as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${0.6 * PX}px`;
  } catch {
    /* older canvas */
  }
  g.fillText('SONY', 0, 0.12 * PX);
  g.restore();

  // POWER / HOLD with their indicator dots
  g.font = `600 ${1.5 * PX}px "Space Grotesk", Arial, sans-serif`;
  g.textAlign = 'right';
  g.fillText('POWER', X(78.4), Y(-15.6));
  g.fillText('HOLD', X(76.2), Y(-22.1));
  g.fillStyle = dark;
  for (const [x, y] of [[80.0, -15.6], [77.8, -22.1]]) {
    g.beginPath();
    g.arc(X(x), Y(y), 0.42 * PX, 0, Math.PI * 2);
    g.fill();
  }
  g.fillStyle = ink;

  // LED icons (power, WLAN)
  g.lineWidth = 0.18 * PX;
  g.beginPath();
  g.arc(X(-76.6), Y(-14.9), 0.75 * PX, -Math.PI * 0.32, Math.PI * 1.32);
  g.stroke();
  g.beginPath();
  g.moveTo(X(-76.6), Y(-14.0));
  g.lineTo(X(-76.6), Y(-14.9));
  g.stroke();
  for (let i = 1; i <= 3; i++) {
    g.beginPath();
    g.arc(X(-75.6), Y(-22.6), i * 0.45 * PX, -Math.PI * 0.5, -Math.PI * 0.05);
    g.stroke();
  }

  // VOL
  g.textAlign = 'center';
  g.font = `700 ${1.5 * PX}px "Space Grotesk", Arial, sans-serif`;
  g.fillText('VOL', X(-29.0), Y(-32.6));

  // PSP logotype — thin upright strokes, traced from the photo (origin = top-left of the mark)
  g.save();
  g.translate(X(-10.71), Y(-31.68));
  g.scale(PX, PX);
  g.lineWidth = 0.24;
  g.lineJoin = 'miter';
  g.lineCap = 'butt';
  const pl = (pts: [number, number][]) => {
    g.beginPath();
    pts.forEach(([u, v], i) => (i ? g.lineTo(u, v) : g.moveTo(u, v)));
    g.stroke();
  };
  pl([[0, 0], [6.29, 0], [6.29, 1.47], [0.15, 1.47], [0.15, 3.16]]); // P
  pl([[7.05, 3.16], [10.58, 3.16], [10.58, 0.09], [13.8, 0.09]]); // S
  pl([[15.18, 0.09], [21.62, 0.09], [21.62, 1.63], [15.03, 1.63], [15.03, 3.16]]); // P
  g.restore();

  // light catch on the lower-right lip of the d-pad well, as in the photo
  g.lineWidth = 0.22 * PX;
  g.globalAlpha = 0.35;
  g.beginPath();
  g.arc(X(-66.1), Y(2.5), 13.1 * PX, -0.2, Math.PI * 0.75);
  g.stroke();
  g.globalAlpha = 1;
  return tex(c);
}

/** Face-button / d-pad symbol, drawn as a light outline on transparent (meant for a 7 mm plane). */
export function glyphTexture(kind: 'tri' | 'cir' | 'crs' | 'sqr' | 'up', ink: string) {
  const S = 256;
  const c = canvas(S, S);
  const g = c.getContext('2d')!;
  g.strokeStyle = ink;
  g.lineWidth = 15;
  g.lineJoin = 'miter';
  g.lineCap = 'butt';
  const m = S / 2;
  g.beginPath();
  if (kind === 'tri') {
    g.moveTo(m, m - 78);
    g.lineTo(m + 88, m + 66);
    g.lineTo(m - 88, m + 66);
    g.closePath();
  } else if (kind === 'cir') {
    g.arc(m, m, 76, 0, Math.PI * 2);
  } else if (kind === 'crs') {
    g.moveTo(m - 62, m - 62);
    g.lineTo(m + 62, m + 62);
    g.moveTo(m + 62, m - 62);
    g.lineTo(m - 62, m + 62);
  } else if (kind === 'sqr') {
    g.rect(m - 60, m - 60, 120, 120);
  } else {
    // d-pad: outlined triangle pointing outwards
    g.lineWidth = 17;
    g.moveTo(m, m - 64);
    g.lineTo(m + 74, m + 56);
    g.lineTo(m - 74, m + 56);
    g.closePath();
  }
  g.stroke();
  return tex(c);
}

/** Label for a bottom-row key cap. */
export function capLabelTexture(label: string, wmm: number, hmm: number, ink: string) {
  const s = 40; // px per mm
  const c = canvas(Math.round(wmm * s), Math.round(hmm * s));
  const g = c.getContext('2d')!;
  g.fillStyle = ink;
  g.strokeStyle = ink;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const cx = c.width / 2;
  const cy = c.height / 2;
  if (label === 'display') {
    g.lineWidth = 0.32 * s;
    g.beginPath();
    g.roundRect(cx - 1.35 * s, cy - 0.95 * s, 2.7 * s, 1.9 * s, 0.45 * s);
    g.stroke();
    g.beginPath();
    g.arc(cx, cy, 0.42 * s, 0, Math.PI * 2);
    g.fill();
  } else if (label === 'note') {
    g.font = `700 ${2.6 * s}px "Space Grotesk", sans-serif`;
    g.fillText('♪', cx, cy + 0.1 * s);
  } else {
    g.font = `700 ${(label.length > 1 ? 1.45 : 2.4) * s}px "Space Grotesk", sans-serif`;
    g.fillText(label, cx, cy + 0.08 * s);
  }
  return tex(c);
}

/** Analog-nub top: dark grey with a grid of small raised dots catching the light. */
export function knurlTexture() {
  const S = 256;
  const c = canvas(S, S);
  const g = c.getContext('2d')!;
  g.fillStyle = '#26282c';
  g.fillRect(0, 0, S, S);
  const step = 14;
  for (let y = step / 2, row = 0; y < S; y += step, row++) {
    for (let x = step / 2 + (row % 2) * (step / 2); x < S; x += step) {
      const grad = g.createRadialGradient(x - 1.5, y - 1.5, 0.5, x, y, 5);
      grad.addColorStop(0, '#8a8e95');
      grad.addColorStop(0.55, '#4a4d53');
      grad.addColorStop(1, 'rgba(38,40,44,0)');
      g.fillStyle = grad;
      g.beginPath();
      g.arc(x, y, 5, 0, Math.PI * 2);
      g.fill();
    }
  }
  return tex(c);
}
