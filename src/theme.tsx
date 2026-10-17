import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

// The original PSP XMB tinted its wave background a different colour each month.
// We follow the same idea: the site accent defaults to the current month.
export const XMB_THEMES = [
  { month: 'Jan', name: 'Silver', hex: '#c3c9d4' },
  { month: 'Feb', name: 'Gold', hex: '#d9b636' },
  { month: 'Mar', name: 'Lime', hex: '#86c93f' },
  { month: 'Apr', name: 'Sakura', hex: '#e98bb4' },
  { month: 'May', name: 'Leaf', hex: '#2fae57' },
  { month: 'Jun', name: 'Violet', hex: '#a57ae0' },
  { month: 'Jul', name: 'Aqua', hex: '#22c2d6' },
  { month: 'Aug', name: 'Cobalt', hex: '#3b7cf0' },
  { month: 'Sep', name: 'Plum', hex: '#8a55d8' },
  { month: 'Oct', name: 'Amber', hex: '#e39a2a' },
  { month: 'Nov', name: 'Bronze', hex: '#b0784a' },
  { month: 'Dec', name: 'Crimson', hex: '#e04848' },
] as const;

const STORAGE_KEY = 'psparchive:xmb-theme';
const SOUND_KEY = 'psparchive:sound';

function clamp(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)));
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
}

export function mix(hex: string, target: string, t: number) {
  const a = hexToRgb(hex);
  const b = hexToRgb(target);
  const r = a.map((c, i) => clamp(c + (b[i] - c) * t));
  return `#${r.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

type ThemeCtx = {
  index: number;
  setIndex: (i: number) => void;
  isAuto: boolean;
  resetAuto: () => void;
  accent: string;
  sound: boolean;
  setSound: (v: boolean) => void;
};

const Ctx = createContext<ThemeCtx | null>(null);

function readStored(): number | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === null) return null;
    const n = Number(v);
    return Number.isInteger(n) && n >= 0 && n < 12 ? n : null;
  } catch {
    return null;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<number | null>(() => readStored());
  const [sound, setSoundState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SOUND_KEY) === '1';
    } catch {
      return false;
    }
  });
  const index = stored ?? new Date().getMonth();
  const accent = XMB_THEMES[index].hex;

  useEffect(() => {
    const root = document.documentElement;
    const [r, g, b] = hexToRgb(accent);
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--accent-rgb', `${r} ${g} ${b}`);
    root.style.setProperty('--accent-hi', mix(accent, '#ffffff', 0.55));
    root.style.setProperty('--accent-lo', mix(accent, '#000000', 0.45));
    root.style.setProperty('--accent-deep', mix(accent, '#04060b', 0.8));
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', mix(accent, '#04060b', 0.8));
  }, [accent]);

  const value = useMemo<ThemeCtx>(
    () => ({
      index,
      accent,
      isAuto: stored === null,
      setIndex: (i) => {
        setStored(i);
        try {
          localStorage.setItem(STORAGE_KEY, String(i));
        } catch {
          /* storage unavailable */
        }
      },
      resetAuto: () => {
        setStored(null);
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          /* storage unavailable */
        }
      },
      sound,
      setSound: (v) => {
        setSoundState(v);
        try {
          localStorage.setItem(SOUND_KEY, v ? '1' : '0');
        } catch {
          /* storage unavailable */
        }
      },
    }),
    [index, accent, stored, sound],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useTheme outside ThemeProvider');
  return c;
}
