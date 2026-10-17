import { Link } from '../router';
import type { Colorway } from '../lib/catalog';
import { TiltCard, cx } from './ui';

export function Swatch({ hex, size = 14 }: { hex: string; size?: number }) {
  return (
    <span
      className="inline-block rounded-full shrink-0"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 35% 30%, rgb(255 255 255 / 0.85), ${hex} 42%, ${hex})`,
        boxShadow: `inset 0 -1px 2px rgb(0 0 0 / 0.4), 0 0 0 1px rgb(0 0 0 / 0.5), 0 0 10px ${hex}55`,
      }}
    />
  );
}

export function ColorCard({ cw, compact = false, eager = false }: { cw: Colorway; compact?: boolean; eager?: boolean }) {
  const limited = cw.color.type === 'limited';
  return (
    <Link to={`/colors/${cw.model.id}/${cw.slug}`} className="group block focus-visible:outline-none" aria-label={`${cw.color.name}, ${cw.model.name}`}>
      <TiltCard className="relative rounded-[22px] h-full" max={6}>
        <div className="glass h-full overflow-hidden flex flex-col transition-shadow duration-300 group-hover:shadow-[0_0_0_1px_rgb(var(--accent-rgb)/0.5),0_30px_60px_-25px_rgb(0_0_0/0.9)] group-focus-visible:shadow-[0_0_0_2px_var(--accent-hi)]">
          {/* stage */}
          <div
            className={cx('relative pinstripe', compact ? 'aspect-[16/10]' : 'aspect-[16/11]')}
            style={{
              background: `radial-gradient(70% 60% at 50% 62%, ${cw.color.hex}40, transparent 70%), linear-gradient(180deg, rgb(255 255 255 / 0.03), rgb(0 0 0 / 0.25))`,
            }}
          >
            <div className="stage-floor" style={{ background: `radial-gradient(ellipse at center, ${cw.color.hex}66, ${cw.color.hex}11 45%, transparent 70%)` }} />
            {cw.front ? (
              <img
                src={cw.front}
                alt={`${cw.color.name} ${cw.model.name}`}
                loading={eager ? 'eager' : 'lazy'}
                decoding="async"
                className="reflect absolute inset-x-[7%] top-[8%] w-[86%] h-[72%] object-contain transition-transform duration-500 ease-out group-hover:scale-[1.05] group-hover:-translate-y-1"
                style={{ filter: 'drop-shadow(0 14px 18px rgb(0 0 0 / 0.55))' }}
              />
            ) : (
              <div className="absolute inset-x-[18%] top-[26%] h-[38%] rounded-full" style={{ background: cw.color.hex }} />
            )}
            <span className="absolute left-3 top-3 lcd lcd-text px-2 py-0.5 text-[15px] leading-none !rounded-md">{cw.model.name}</span>
            {limited && <span className="holo absolute right-3 top-3 rotate-[4deg]">Limited</span>}
          </div>
          {/* label plate */}
          <div className={cx('relative flex items-start gap-3 border-t border-white/[0.07]', compact ? 'px-3.5 py-3' : 'px-4 py-3.5')}>
            <Swatch hex={cw.color.hex} size={compact ? 14 : 16} />
            <div className="min-w-0 -mt-0.5">
              <h3 className={cx('font-psp leading-tight text-white truncate', compact ? 'text-[15px]' : 'text-[17px]')} title={cw.color.name}>
                {cw.color.name}
              </h3>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-faint)]">
                {cw.model.year} · {cw.color.hex}
              </div>
            </div>
          </div>
        </div>
      </TiltCard>
    </Link>
  );
}
