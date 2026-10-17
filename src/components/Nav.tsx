import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, Volume2, VolumeX, X, Palette, Cpu, Clock, Disc3, Download, Terminal, BookOpen, Home, GitCompareArrows } from 'lucide-react';
import { Link, usePath } from '../router';
import { XMB_THEMES, mix, useTheme } from '../theme';
import { setSoundEnabled, sfx } from '../sound';
import { cx } from './ui';

export const NAV_LINKS = [
  { to: '/colors', label: 'Colors', icon: Palette, hue: '#ff6fb5' },
  { to: '/models', label: 'Hardware', icon: Cpu, hue: '#5aa9ff' },
  { to: '/history', label: 'History', icon: Clock, hue: '#ffb547' },
  { to: '/games', label: 'Games', icon: Disc3, hue: '#55d68a' },
  { to: '/firmware', label: 'Firmware', icon: Download, hue: '#43d5e6' },
  { to: '/homebrew', label: 'Homebrew', icon: Terminal, hue: '#a98bff' },
  { to: '/guide', label: 'Guide', icon: BookOpen, hue: '#ff7a59' },
];

export function Logo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label="PSP Archive home">
      <span
        className={cx('font-psp chrome-text leading-none tracking-[-0.05em] inline-block', size === 'lg' ? 'text-5xl' : 'text-[1.7rem]')}
        style={{ transform: 'scaleX(1.4) skewX(-12deg)', transformOrigin: 'left', marginRight: '0.85em' }}
      >
        PSP
      </span>
      <span className="flex flex-col leading-none border-l border-white/15 pl-3">
        <span className="font-mono text-[10px] font-bold tracking-[0.28em] text-white/90">ARCHIVE</span>
        <span className="font-mono text-[9px] tracking-[0.28em] mt-1" style={{ color: 'var(--accent-hi)' }}>
          2004–∞
        </span>
      </span>
    </Link>
  );
}

function ThemePicker() {
  const { index, setIndex, isAuto, resetAuto } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="key !px-2.5 !py-2"
        aria-label="Change XMB theme colour"
        aria-expanded={open}
        title="XMB theme colour"
      >
        <span
          className="block w-4 h-4 rounded-full"
          style={{
            background: `radial-gradient(circle at 35% 30%, #fff, var(--accent) 45%, var(--accent-lo))`,
            boxShadow: '0 0 10px rgb(var(--accent-rgb) / 0.8)',
          }}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="glass absolute right-0 top-[calc(100%+12px)] w-[296px] p-4 z-50"
          >
            <div className="label mb-1">XMB Theme</div>
            <p className="text-xs text-[var(--ink-dim)] mb-3 leading-relaxed">The original PSP changed its wave colour every month. Pick one, or let the calendar decide.</p>
            <div className="grid grid-cols-6 gap-2">
              {XMB_THEMES.map((t, i) => (
                <button
                  key={t.month}
                  type="button"
                  onClick={() => {
                    setIndex(i);
                    sfx.toggle();
                  }}
                  className="group flex flex-col items-center gap-1"
                  aria-label={`${t.month} – ${t.name}`}
                  title={`${t.month} · ${t.name}`}
                >
                  <span
                    className="w-8 h-8 rounded-full transition-transform group-hover:scale-110"
                    style={{
                      background: `radial-gradient(circle at 35% 28%, #fff 0, ${mix(t.hex, '#ffffff', 0.4)} 18%, ${t.hex} 50%, ${mix(t.hex, '#000000', 0.5)} 100%)`,
                      boxShadow: i === index ? `0 0 0 2px #05070c, 0 0 0 4px ${t.hex}, 0 0 16px ${t.hex}` : 'inset 0 -2px 4px rgb(0 0 0 / 0.35), 0 3px 8px rgb(0 0 0 / 0.6)',
                    }}
                  />
                  <span className={cx('font-mono text-[9px] tracking-wider', i === index ? 'text-white' : 'text-white/45')}>{t.month}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={resetAuto}
              className={cx('key w-full justify-center mt-4', isAuto && 'is-on')}
            >
              {isAuto ? 'Following the calendar' : 'Follow the calendar'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SoundToggle() {
  const { sound, setSound } = useTheme();
  useEffect(() => setSoundEnabled(sound), [sound]);
  return (
    <button
      type="button"
      className={cx('key !px-2.5 !py-2', sound && 'is-on')}
      aria-pressed={sound}
      aria-label={sound ? 'Mute interface sounds' : 'Enable interface sounds'}
      title={sound ? 'Sound on' : 'Sound off'}
      onClick={() => {
        setSoundEnabled(!sound);
        setSound(!sound);
        if (!sound) setTimeout(() => sfx.select(), 30);
      }}
    >
      {sound ? <Volume2 size={15} /> : <VolumeX size={15} />}
    </button>
  );
}

export function Nav() {
  const path = usePath();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => setMenu(false), [path]);
  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : '';
  }, [menu]);

  const active = (to: string) => path === to || path.startsWith(to + '/') || (to === '/models' && path === '/compare');

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-[90] px-3 md:px-5 pt-3 md:pt-4 pointer-events-none">
        <nav
          className={cx(
            'pointer-events-auto mx-auto max-w-[1320px] flex items-center justify-between gap-3 rounded-[20px] pl-4 pr-2 py-2 transition-all duration-300',
            scrolled ? 'glass' : 'bg-transparent',
          )}
          aria-label="Main"
        >
          <Logo />

          <div className="hidden lg:flex items-center gap-1 rounded-[14px] p-1 well">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cx(
                  'relative px-3 xl:px-3.5 py-2 rounded-[10px] font-mono text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors',
                  active(l.to) ? 'text-white' : 'text-[var(--ink-dim)] hover:text-white',
                )}
                aria-current={active(l.to) ? 'page' : undefined}
              >
                {active(l.to) && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-[10px]"
                    style={{
                      background: 'linear-gradient(180deg, rgb(var(--accent-rgb) / 0.4), rgb(var(--accent-rgb) / 0.12))',
                      boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.25), inset 0 0 0 1px rgb(var(--accent-rgb) / 0.5), 0 0 18px -4px rgb(var(--accent-rgb) / 0.7)',
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
                <span className="relative" style={active(l.to) ? { textShadow: '0 0 10px rgb(var(--accent-rgb))' } : undefined}>
                  {l.label}
                </span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <SoundToggle />
            <ThemePicker />
            <button type="button" className="key lg:hidden !px-2.5 !py-2" onClick={() => setMenu(true)} aria-label="Open menu">
              <Menu size={16} />
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-[120] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setMenu(false)} />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="glass relative m-3 p-5"
              role="dialog"
              aria-label="Site menu"
            >
              <div className="flex items-center justify-between mb-6">
                <Logo />
                <button type="button" className="key !px-2.5 !py-2" onClick={() => setMenu(false)} aria-label="Close menu">
                  <X size={16} />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-x-3 gap-y-5">
                {[{ to: '/', label: 'Home', icon: Home, hue: '#9aa6b8' }, ...NAV_LINKS, { to: '/compare', label: 'Compare', icon: GitCompareArrows, hue: '#f5c542' }].map((l) => {
                  const hi = mix(l.hue, '#ffffff', 0.45);
                  const lo = mix(l.hue, '#000000', 0.45);
                  return (
                    <Link key={l.to} to={l.to} className="flex flex-col items-center gap-2">
                      <span className="app-icon w-14 h-14" style={{ ['--ic' as string]: l.hue, ['--ic-hi' as string]: hi, ['--ic-lo' as string]: lo }}>
                        <l.icon size={24} strokeWidth={2.2} />
                      </span>
                      <span className={cx('text-[11px] font-semibold', active(l.to) ? 'text-white' : 'text-[var(--ink-dim)]')}>{l.label}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
