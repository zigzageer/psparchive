import { useRef, type CSSProperties, type ElementType, type PointerEvent, type ReactNode } from 'react';
import { motion } from 'motion/react';

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(' ');
}

export function Screws({ inset = 10 }: { inset?: number }) {
  const s = (top: boolean, left: boolean, r: number): CSSProperties => ({
    [top ? 'top' : 'bottom']: inset,
    [left ? 'left' : 'right']: inset,
    ['--sr' as string]: `${r}deg`,
  });
  return (
    <>
      <span className="screw" style={s(true, true, 20)} />
      <span className="screw" style={s(true, false, 70)} />
      <span className="screw" style={s(false, true, 110)} />
      <span className="screw" style={s(false, false, 45)} />
    </>
  );
}

export function Panel({
  children,
  className,
  screws,
  as: Tag = 'div',
  style,
}: {
  children: ReactNode;
  className?: string;
  screws?: boolean;
  as?: ElementType;
  style?: CSSProperties;
}) {
  return (
    <Tag className={cx('panel', className)} style={style}>
      {screws && <Screws />}
      {children}
    </Tag>
  );
}

export function SectionHeader({
  index,
  kicker,
  title,
  sub,
  align = 'left',
  action,
}: {
  index?: string;
  kicker: string;
  title: ReactNode;
  sub?: ReactNode;
  align?: 'left' | 'center';
  action?: ReactNode;
}) {
  return (
    <div className={cx('flex flex-col gap-3 mb-8 md:mb-10', align === 'center' && 'items-center text-center')}>
      <div className="flex items-center gap-3">
        {index && <span className="lcd lcd-text px-2 py-0.5 text-lg leading-none rounded-md">{index}</span>}
        <span className="label !text-[11px]" style={{ color: 'var(--accent-hi)' }}>
          {kicker}
        </span>
        <span className="hidden sm:block h-px w-16 bg-gradient-to-r from-[rgb(var(--accent-rgb)/0.6)] to-transparent" />
      </div>
      <div className={cx('flex flex-col md:flex-row md:items-end gap-4 w-full', align === 'center' ? 'justify-center' : 'justify-between')}>
        <div className={cx(align === 'center' && 'flex flex-col items-center')}>
          <h2 className="font-psp chrome-text text-[2rem] leading-[1.05] sm:text-5xl md:text-[3.4rem] pb-1">{title}</h2>
          {sub && <p className="mt-3 text-[15px] md:text-base leading-relaxed text-[var(--ink-dim)] max-w-2xl">{sub}</p>}
        </div>
        {action && <div className="shrink-0 self-start md:self-auto">{action}</div>}
      </div>
    </div>
  );
}

/** Big page-top hero used by inner pages */
export function PageHero({ kicker, title, sub, children, code }: { kicker: string; title: ReactNode; sub?: ReactNode; children?: ReactNode; code?: string }) {
  return (
    <header className="relative pt-32 md:pt-40 pb-10 md:pb-14">
      <div className="mx-auto max-w-[1240px] px-4 md:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="led led-blink" />
            <span className="label !text-[11px]" style={{ color: 'var(--accent-hi)' }}>
              {kicker}
            </span>
            {code && <span className="chip">{code}</span>}
          </div>
          <h1 className="font-psp chrome-text text-[2.6rem] leading-[1] sm:text-6xl md:text-7xl lg:text-[5.4rem] pb-2 max-w-5xl">{title}</h1>
          {sub && <p className="mt-5 text-base md:text-lg leading-relaxed text-[var(--ink-dim)] max-w-2xl">{sub}</p>}
          {children && <div className="mt-7">{children}</div>}
        </motion.div>
      </div>
    </header>
  );
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('mx-auto max-w-[1240px] px-4 md:px-8', className)}>{children}</div>;
}

/** LED-segment meter (0–max) */
export function Meter({ value, max = 5, label }: { value: number; max?: number; label?: string }) {
  return (
    <div className="flex items-center gap-3">
      {label && <span className="label w-24 shrink-0 !tracking-[0.14em]">{label}</span>}
      <div className="flex gap-1" role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}>
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            className="h-2.5 w-5 rounded-[3px]"
            style={
              i < value
                ? {
                    background: 'linear-gradient(180deg, var(--accent-hi), var(--accent))',
                    boxShadow: '0 0 8px rgb(var(--accent-rgb) / 0.7), inset 0 1px 0 rgb(255 255 255 / 0.6)',
                  }
                : { background: '#14171d', boxShadow: 'inset 0 1px 2px rgb(0 0 0 / 0.9)' }
            }
          />
        ))}
      </div>
    </div>
  );
}

/** Pointer-tracked 3D tilt with glare */
export function TiltCard({ children, className, max = 8, style }: { children: ReactNode; className?: string; max?: number; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', `${(px - 0.5) * max * 2}deg`);
    el.style.setProperty('--rx', `${(0.5 - py) * max * 2}deg`);
    el.style.setProperty('--gx', `${px * 100}%`);
    el.style.setProperty('--gy', `${py * 100}%`);
    el.classList.add('is-tilting');
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '0deg');
    el.classList.remove('is-tilting');
  };
  return (
    <div ref={ref} className={cx('tilt', className)} onPointerMove={onMove} onPointerLeave={onLeave} style={style}>
      {children}
      <span className="tilt-glare" />
    </div>
  );
}

export function LCDStat({ value, label, ghost }: { value: string; label: string; ghost?: string }) {
  return (
    <div className="lcd px-4 py-3 md:px-5 md:py-4 min-w-0">
      <div className="relative text-4xl md:text-5xl leading-none">
        <span className="lcd-text lcd-ghost absolute inset-0 select-none" aria-hidden>
          {ghost ?? value.replace(/[0-9]/g, '8')}
        </span>
        <span className="lcd-text relative">{value}</span>
      </div>
      <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[rgb(166_246_255/0.55)]">{label}</div>
    </div>
  );
}

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Face-button glyphs in PlayStation colours */
export function FaceGlyph({ kind, size = 14 }: { kind: 'triangle' | 'circle' | 'cross' | 'square'; size?: number | string }) {
  const c = { triangle: '#3fe0a0', circle: '#ff5a6a', cross: '#7aa8ff', square: '#ff8de0' }[kind];
  const s = { width: size, height: size, display: 'inline-block', filter: `drop-shadow(0 0 4px ${c}aa)` };
  return (
    <svg viewBox="0 0 20 20" style={s} aria-hidden>
      {kind === 'triangle' && <path d="M10 3 L17.5 16 H2.5 Z" fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round" />}
      {kind === 'circle' && <circle cx="10" cy="10" r="6.5" fill="none" stroke={c} strokeWidth="2" />}
      {kind === 'cross' && <path d="M4 4 L16 16 M16 4 L4 16" stroke={c} strokeWidth="2" strokeLinecap="round" />}
      {kind === 'square' && <rect x="4" y="4" width="12" height="12" fill="none" stroke={c} strokeWidth="2" rx="1" />}
    </svg>
  );
}
