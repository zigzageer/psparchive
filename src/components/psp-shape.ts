/*
 * PSP-1000 front view in millimetres, origin at the centre of the device, +y up (paths flip to SVG's y-down).
 * Overall 170 × 74 mm. The outline and every feature position were traced from a straight-on product photo
 * of a Piano Black PSP-1000 (924 px wide → 5.435 px/mm).
 */

export type Pt = [number, number];

// Top-left quarter of the outline, from top-centre to left-middle.
const QUARTER: Pt[] = [
  [0, 37], [-20, 37], [-40, 37], [-56, 37], [-62, 36.95], [-65.6, 36.75], [-67.9, 36.3], [-69.7, 35.5],
  [-71.2, 34.1], [-72.8, 32.3], [-74.6, 30.1], [-76.6, 27.6], [-78.4, 24.9], [-79.9, 22.0], [-81.2, 19.0],
  [-82.3, 15.8], [-83.3, 12.4], [-84.1, 8.8], [-84.6, 5.2], [-84.9, 2.2], [-85, 0],
];

// Feature positions (mm), measured from the reference photo
export const P = {
  screen: { x: 0.6, y: 1.1, w: 99, h: 56, aw: 95, ah: 53.9 },
  dpad: { x: -66.1, y: 2.5, r: 12.9 },
  face: { x: 67.2, y: 2.5, off: 10.3, well: 4.95, cap: 4.35, plate: 15.8 },
  nub: { x: -65.5, y: -20.5, well: 6.8, r: 5.6, top: 4.7 },
  row: -32.4,
};

const dist = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const lerp = (a: Pt, b: Pt, t0: number, t1: number, t: number): Pt => {
  const k = t1 === t0 ? 0 : (t - t0) / (t1 - t0);
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
};

/** Closed centripetal Catmull-Rom spline through `pts`, sampled about every `step` mm. */
function spline(pts: Pt[], step: number): Pt[] {
  const n = pts.length;
  const out: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const t0 = 0;
    const t1 = t0 + Math.sqrt(dist(p0, p1));
    const t2 = t1 + Math.sqrt(dist(p1, p2));
    const t3 = t2 + Math.sqrt(dist(p2, p3));
    const steps = Math.max(2, Math.ceil(dist(p1, p2) / step));
    for (let s = 0; s < steps; s++) {
      const t = t1 + ((t2 - t1) * s) / steps;
      const a1 = lerp(p0, p1, t0, t1, t);
      const a2 = lerp(p1, p2, t1, t2, t);
      const a3 = lerp(p2, p3, t2, t3, t);
      const b1 = lerp(a1, a2, t0, t2, t);
      const b2 = lerp(a2, a3, t1, t3, t);
      out.push(lerp(b1, b2, t1, t2, t));
    }
  }
  return out;
}

/** Full outline, counter-clockwise. */
export const OUTLINE: Pt[] = (() => {
  const q = QUARTER;
  const bl = [...q].reverse().slice(1).map(([x, y]) => [x, -y] as Pt);
  const br = q.slice(1).map(([x, y]) => [-x, -y] as Pt);
  const tr = [...q].reverse().slice(1, -1).map(([x, y]) => [-x, y] as Pt);
  return spline([...q, ...bl, ...br, ...tr], 0.5);
})();

/** Offset a closed counter-clockwise polyline: positive = outward. */
export function offset(pts: Pt[], d: number): Pt[] {
  const n = pts.length;
  return pts.map((p, i) => {
    const a = pts[(i - 1 + n) % n];
    const b = pts[(i + 1) % n];
    const len = dist(a, b) || 1;
    const tx = (b[0] - a[0]) / len;
    const ty = (b[1] - a[1]) / len;
    return [p[0] + ty * d, p[1] - tx * d];
  });
}

const f2 = (v: number) => (Math.abs(v) < 0.005 ? '0' : v.toFixed(2));

/** Polyline → SVG path (flips y). */
export function toPath(pts: Pt[], close = true) {
  return pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f2(x)} ${f2(-y)}`).join('') + (close ? 'Z' : '');
}

/** Polygon with every corner rounded to radius `r` → SVG path (flips y). */
export function roundedPath(points: Pt[], r: number) {
  const n = points.length;
  let d = '';
  for (let i = 0; i < n; i++) {
    const p = points[i];
    const prev = points[(i - 1 + n) % n];
    const next = points[(i + 1) % n];
    const ra = Math.min(r, dist(prev, p) / 2) / (dist(prev, p) || 1);
    const rb = Math.min(r, dist(next, p) / 2) / (dist(next, p) || 1);
    const a: Pt = [p[0] + (prev[0] - p[0]) * ra, p[1] + (prev[1] - p[1]) * ra];
    const b: Pt = [p[0] + (next[0] - p[0]) * rb, p[1] + (next[1] - p[1]) * rb];
    d += `${i ? 'L' : 'M'}${f2(a[0])} ${f2(-a[1])}Q${f2(p[0])} ${f2(-p[1])} ${f2(b[0])} ${f2(-b[1])}`;
  }
  return d + 'Z';
}

export const rotate = ([x, y]: Pt, deg: number): Pt => {
  const a = (deg * Math.PI) / 180;
  return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
};
export const move = ([x, y]: Pt, dx: number, dy: number): Pt => [x + dx, y + dy];

/** Circle → SVG path (centre in y-up mm). */
export function circlePath(cx: number, cy: number, r: number) {
  const y = -cy;
  return `M${f2(cx - r)} ${f2(y)}A${r} ${r} 0 1 0 ${f2(cx + r)} ${f2(y)}A${r} ${r} 0 1 0 ${f2(cx - r)} ${f2(y)}Z`;
}

/** Pill (fully rounded rectangle) centred on (cx, cy). */
export function pillPath(cx: number, cy: number, w: number, h: number) {
  const r = Math.min(w, h) / 2;
  const x0 = cx - w / 2 + r;
  const x1 = cx + w / 2 - r;
  const t = -cy - h / 2;
  const b = -cy + h / 2;
  return `M${f2(x0)} ${f2(t)}H${f2(x1)}A${r} ${r} 0 0 1 ${f2(x1)} ${f2(b)}H${f2(x0)}A${r} ${r} 0 0 1 ${f2(x0)} ${f2(t)}Z`;
}

/**
 * A band hugging part of the outline: the silver L/R shoulders and the strap holder.
 * `pick` selects outline points, `sortAsc` orders them along the outline, `thickAt(t)` gives the
 * band width from start (t = 0) to end (t = 1). The outer edge sits a hair proud of the shell.
 */
function band(pick: (p: Pt) => boolean, sortAsc: boolean, thickAt: (t: number) => number, mirrorX: boolean) {
  const seg = OUTLINE.filter(pick).sort((a, b) => (sortAsc ? a[0] - b[0] : b[0] - a[0]));
  const n = seg.length;
  const outer: Pt[] = [];
  const inner: Pt[] = [];
  seg.forEach((p, i) => {
    const t = i / (n - 1);
    const a = seg[Math.max(0, i - 1)];
    const b = seg[Math.min(n - 1, i + 1)];
    const len = dist(a, b) || 1;
    // both bands are sorted in the outline's counter-clockwise order, so inward is the tangent turned left
    const nx = -(b[1] - a[1]) / len;
    const ny = (b[0] - a[0]) / len;
    outer.push([p[0] - nx * 0.3, p[1] - ny * 0.3]);
    inner.push([p[0] + nx * thickAt(t), p[1] + ny * thickAt(t)]);
  });
  let ring = [...outer, ...inner.reverse()];
  if (mirrorX) ring = ring.map(([x, y]) => [-x, y] as Pt);
  return toPath(ring);
}

/** Silver L / R shoulder buttons wrapping the top corners — thickest at the corner, like the real part. */
export const shoulderPath = (side: 'l' | 'r') =>
  band((p) => p[0] < -54.5 && p[1] > 28.5, false, (t) => 2.4 + Math.sin(t * Math.PI) * 2.4 + t * 0.5, side === 'r');

/** The silver wrist-strap holder on the bottom-left corner. */
export const strapPath = () => band((p) => p[0] < -58 && p[1] < -31, true, (t) => 1.1 + Math.sin(t * Math.PI) * 1.1, false);

/**
 * One d-pad key, pointing up, relative to the d-pad centre.
 * Measured: 8.1 mm wide, outer end on a 12 mm radius (follows the well), pointed tip 3.55 mm from the centre.
 */
export function dpadKeyPoints(): Pt[] {
  const R = 12;
  const hw = 4.05;
  const a = Math.asin(hw / R);
  const pts: Pt[] = [];
  for (let i = 0; i <= 8; i++) {
    const th = a - (2 * a * i) / 8; // right → left along the outer arc
    pts.push([R * Math.sin(th), R * Math.cos(th)]);
  }
  pts.push([-hw, 6.1], [0, 3.55], [hw, 6.1]);
  return pts;
}

/** Rounded square standing on its corner — the plate under the face buttons. */
export const diamondPoints = (h: number): Pt[] => [[0, h], [-h, 0], [0, -h], [h, 0]];
